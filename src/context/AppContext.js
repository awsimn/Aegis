import React, { createContext, useState, useEffect } from "react";
import { loadData, saveData } from "../services/storage";
import * as Location from "expo-location";
import * as Network from "expo-network";
import { useAuth } from "./AuthContext";
import { supabase } from "../services/supabase";
import { theme } from "../styles/theme";
import { registerForPushNotificationsAsync, setupNotificationListeners, scheduleLocalNotification } from "../services/notifications";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [savedChecklists, setSavedChecklists] = useState([]);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [checklistProgress, setChecklistProgress] = useState({});
  const [rpgScores, setRpgScores] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [pushToken, setPushToken] = useState(null);
  const [preferences, setPreferences] = useState({
    vibration: true,
    notifications: true,
  });

  const [alertStatus, setAlertStatus] = useState("NORMAL");
  const [userLocation, setUserLocation] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  
  useEffect(() => {
    let isMounted = true;
    
    if (preferences.notifications) {
      const setupNotifications = async () => {
        const token = await registerForPushNotificationsAsync();
        if (isMounted && token) {
          setPushToken(token);
          if (user) {
            await supabase
              .from("profiles")
              .update({ push_token: token })
              .eq("id", user.id);
          }
        }
      };
      setupNotifications();
    }

    const cleanup = setupNotificationListeners(
      (notification) => {
        console.log("Notification Received:", notification);
      },
      (response) => {
        console.log("Notification Response:", response);
      }
    );

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [user, preferences.notifications]);

  useEffect(() => {
    const init = async () => {
       const savedXP = await loadData("@user_xp");
       const savedLevel = await loadData("@user_level");
       const savedTasks = await loadData("@completed_tasks");
       const savedAi = await loadData("@saved_checklists");
       const savedQuiz = await loadData("@saved_quizzes");
       const savedProgress = await loadData("@checklist_progress");
       const savedRpg = await loadData("@rpg_scores");
       const savedCompletedQuizzes = await loadData("@completed_quizzes");
       const savedPrefs = await loadData("@user_preferences");

       if (!user) {
        if (savedXP) setUserXP(savedXP);
        if (savedLevel) setUserLevel(savedLevel);
        if (savedTasks) setCompletedTasks(savedTasks);
        if (savedAi) setSavedChecklists(savedAi);
        if (savedQuiz) setSavedQuizzes(savedQuiz);
        if (savedProgress) setChecklistProgress(savedProgress);
        if (savedRpg) setRpgScores(savedRpg);
        if (savedCompletedQuizzes) setCompletedQuizzes(savedCompletedQuizzes);
        if (savedPrefs) setPreferences(savedPrefs);
      }

      if (user) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("xp, level, completed_tasks, saved_checklists, saved_quizzes, checklist_progress, preferences, push_token, rpg_scores, completed_quizzes")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            const remoteXP = data.xp || 0;
            const remoteTasks = data.completed_tasks || [];
            const remoteAi = data.saved_checklists || [];
            const remoteQuiz = data.saved_quizzes || [];
            const remoteProgress = data.checklist_progress || {};
            const remoteRpg = data.rpg_scores || {};
            const remoteCompletedQuizzes = data.completed_quizzes || [];
            const remotePrefs = data.preferences || { vibration: true, notifications: true };
            const localXP = savedXP || 0;
            const localLevel = savedLevel || 1;
            const localTasks = savedTasks || [];
            const localAi = savedAi || [];
            const localQuiz = savedQuiz || [];
            const localProgress = savedProgress || {};
            const localRpg = savedRpg || {};
            const localCompletedQuizzes = savedCompletedQuizzes || [];
            const localPrefs = savedPrefs || { vibration: true, notifications: true };

            
            const mergedTasks = Array.from(
              new Set([...remoteTasks, ...localTasks]),
            );
            setCompletedTasks(mergedTasks);

            
            const checklistMap = new Map();
            [...remoteAi, ...localAi].forEach((item) =>
              checklistMap.set(item.id, item),
            );
            setSavedChecklists(Array.from(checklistMap.values()));

            
            const quizMap = new Map();
            [...remoteQuiz, ...localQuiz].forEach((item) =>
              quizMap.set(item.id, item),
            );
            setSavedQuizzes(Array.from(quizMap.values()));

            
            setChecklistProgress({ ...remoteProgress, ...localProgress });
            
            const mergedRpg = { ...localRpg };
            for (const key in remoteRpg) {
              mergedRpg[key] = Math.max(mergedRpg[key] || 0, remoteRpg[key]);
            }
            setRpgScores(mergedRpg);

            const mergedCompletedQuizzes = Array.from(
              new Set([...remoteCompletedQuizzes, ...localCompletedQuizzes]),
            );
            setCompletedQuizzes(mergedCompletedQuizzes);

            
            setPreferences(remotePrefs);
            setPushToken(data.push_token);

            if (remoteXP > localXP) {
              setUserXP(remoteXP);
              setUserLevel(data.level || 1);
            } else if (
              localXP > remoteXP ||
              localTasks.length < mergedTasks.length
            ) {
              await supabase
                .from("profiles")
                .update({
                  xp: Math.max(localXP, remoteXP),
                  level: Math.max(localLevel, data.level || 1),
                  completed_tasks: mergedTasks,
                  saved_checklists: Array.from(checklistMap.values()),
                  saved_quizzes: Array.from(quizMap.values()),
                  checklist_progress: { ...remoteProgress, ...localProgress },
                  rpg_scores: mergedRpg,
                })
                .eq("id", user.id);
            }
          }
        } catch (err) {
          console.error("Failed to sync profile:", err);
        }
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };
    init();
  }, [user]);

  const handleLogout = async () => {
    setUserXP(0);
    setUserLevel(1);
    setCompletedTasks([]);
    setSavedChecklists([]);
    setSavedQuizzes([]);
    setChecklistProgress({});
    setRpgScores({});
    setCompletedQuizzes([]);
    setPushToken(null);
    setPreferences({ vibration: true, notifications: true });

    saveData("@user_xp", 0);
    saveData("@user_level", 1);
    saveData("@completed_tasks", []);
    saveData("@saved_checklists", []);
    saveData("@saved_quizzes", []);
    saveData("@checklist_progress", {});
    saveData("@rpg_scores", {});
    saveData("@completed_quizzes", []);
    saveData("@user_preferences", { vibration: true, notifications: true });
  };

  useEffect(() => { saveData("@user_xp", userXP); }, [userXP]);
  useEffect(() => { saveData("@user_level", userLevel); }, [userLevel]);
  useEffect(() => { saveData("@completed_tasks", completedTasks); }, [completedTasks]);
  useEffect(() => { saveData("@saved_checklists", savedChecklists); }, [savedChecklists]);
  useEffect(() => { saveData("@saved_quizzes", savedQuizzes); }, [savedQuizzes]);
  useEffect(() => { saveData("@checklist_progress", checklistProgress); }, [checklistProgress]);
  useEffect(() => { saveData("@rpg_scores", rpgScores); }, [rpgScores]);
  useEffect(() => { saveData("@completed_quizzes", completedQuizzes); }, [completedQuizzes]);
  useEffect(() => { saveData("@user_preferences", preferences); }, [preferences]);

  const updatePreferences = async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    
    if (user && isConnected) {
      try {
        await supabase
          .from("profiles")
          .update({ preferences: updated })
          .eq("id", user.id);
      } catch (e) {}
    }
  };

  const addXP = async (amount) => {
    const newXP = userXP + amount;
    setUserXP(newXP);

    const newLevel = Math.floor(newXP / 100) + 1;
    if (newLevel > userLevel) {
      setUserLevel(newLevel);
    }

    if (user && isConnected) {
      try {
        await supabase
          .from("profiles")
          .update({ xp: newXP, level: newLevel })
          .eq("id", user.id);
        setLastSyncTime(Date.now());
      } catch (error) {
        console.log("Offline: XP saved locally.");
      }
    }
  };

  const syncData = async () => {
    if (!user || !isConnected) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          xp: userXP,
          level: userLevel,
          completed_tasks: completedTasks,
          saved_checklists: savedChecklists,
          saved_quizzes: savedQuizzes,
          checklist_progress: checklistProgress,
          rpg_scores: rpgScores,
          completed_quizzes: completedQuizzes,
          push_token: pushToken,
          preferences: preferences
        })
        .eq("id", user.id);

      if (!error) {
        setLastSyncTime(Date.now());
        console.log("Sync Successful.");
      }
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  useEffect(() => {
    let interval;
    const monitorNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        const reachable = !!state.isInternetReachable;

        if (reachable && !isConnected) {
          syncData();
        }
        setIsConnected(reachable);
      } catch (e) {}
    };

    monitorNetwork();
    interval = setInterval(monitorNetwork, 10000);
    return () => clearInterval(interval);
  }, [isConnected, userXP, userLevel, user, pushToken, preferences]);

  const completeTask = async (taskId, xpReward) => {
    if (!completedTasks.includes(taskId)) {
      const newTasks = [...completedTasks, taskId];
      setCompletedTasks(newTasks);
      
      
      await addXP(xpReward);

      if (user && isConnected) {
        try {
          await supabase
            .from("profiles")
            .update({ completed_tasks: newTasks })
            .eq("id", user.id);
        } catch (e) {}
      }
    }
  };

  const completeQuiz = async (quizId, xpReward) => {
    if (!completedQuizzes.includes(quizId)) {
      const newList = [...completedQuizzes, quizId];
      setCompletedQuizzes(newList);
      
      
      await addXP(xpReward);

      if (user && isConnected) {
        try {
          await supabase
            .from("profiles")
            .update({ completed_quizzes: newList })
            .eq("id", user.id);
        } catch (e) {}
      }
    }
  };

  const saveChecklist = async (checklist) => {
    if (!savedChecklists.find((c) => c.id === checklist.id)) {
      const newList = [checklist, ...savedChecklists];
      setSavedChecklists(newList);

      if (user && isConnected) {
        try {
          await supabase
            .from("profiles")
            .update({ saved_checklists: newList })
            .eq("id", user.id);
        } catch (e) {}
      }
      return true;
    }
    return false;
  };

  const saveQuiz = async (quiz) => {
    if (!savedQuizzes.find((q) => q.id === quiz.id)) {
      const newList = [quiz, ...savedQuizzes];
      setSavedQuizzes(newList);

      if (user && isConnected) {
        try {
          await supabase
            .from("profiles")
            .update({ saved_quizzes: newList })
            .eq("id", user.id);
        } catch (e) {}
      }
      return true;
    }
    return false;
  };

  const updateChecklistProgress = async (taskId, itemIndices) => {
    const newProgress = { ...checklistProgress, [taskId]: itemIndices };
    setChecklistProgress(newProgress);

    if (user && isConnected) {
      try {
        await supabase
          .from("profiles")
          .update({ checklist_progress: newProgress })
          .eq("id", user.id);
      } catch (e) {}
    }
  };

  const updateRpgScore = async (disasterType, score) => {
    const currentScore = rpgScores[disasterType] || 0;
    if (score > currentScore) {
      const newScores = { ...rpgScores, [disasterType]: score };
      setRpgScores(newScores);
      
      if (user && isConnected) {
        try {
          await supabase
            .from("profiles")
            .update({ rpg_scores: newScores })
            .eq("id", user.id);
        } catch (e) {}
      }
    }
  };

  const toggleAlert = (status) => {
    setAlertStatus(status);
    if (status === "NORMAL") {
      setActiveEvent(null);
    }
  };

  const simulateEvent = async (mode, type = "EARTHQUAKE") => {
    if (!userLocation) return;
    const isNear = mode === "NEAR";
    const latOffset = isNear ? Math.random() * 0.02 - 0.01 : 5.0;
    const lngOffset = isNear ? Math.random() * 0.02 - 0.01 : 5.0;

    const event = {
      id: Date.now(),
      type: type,
      latitude: userLocation.latitude + latOffset,
      longitude: userLocation.longitude + lngOffset,
      radius: isNear ? 5000 : 50000,
      title: type + " Alert",
      description: isNear ? "Immediate danger!" : "Remote activity.",
      severity: isNear ? "HIGH" : "LOW",
    };

    setActiveEvent(event);
    const newStatus = isNear ? (["FLOOD", "DROUGHT"].includes(type) ? "WARNING" : "EMERGENCY") : "NORMAL";
    setAlertStatus(newStatus);

    if (newStatus !== "NORMAL" && preferences.notifications) {
      await scheduleLocalNotification(
        `🚨 ${event.title}`,
        `${event.description} Stay tuned for updates.`,
        event
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        userXP,
        userLevel,
        completedTasks,
        savedChecklists,
        savedQuizzes,
        checklistProgress,
        rpgScores,
        completedQuizzes,
        pushToken,
        preferences,
        alertStatus,
        userLocation,
        activeEvent,
        isConnected,
        lastSyncTime,
        theme,
        addXP,
        completeTask,
        completeQuiz,
        saveChecklist,
        saveQuiz,
        updateChecklistProgress,
        updateRpgScore,
        updatePreferences,
        toggleAlert,
        simulateEvent,
        handleLogout,
        syncData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
