import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";
import Constants from "expo-constants";
import { NAV_TREE } from "../../data/disasterKnowledge";
import { calculateReadinessScore } from "../../utils/gamification";
import { QUIZZES } from "../../data/quizData";
import { PREP_DATA } from "../../data/prepData";

export default function StatsScreen({ route, navigation }) {
  const { user } = useAuth();
  const { 
    userXP, userLevel, checklistProgress, savedQuizzes, savedChecklists, 
    rpgScores, isConnected, completedTasks, completedQuizzes 
  } = useContext(AppContext);

  const targetUserId = route.params?.userId;
  const isViewingSelf = !targetUserId || (user && targetUserId === user.id);

  const [forumStats, setForumStats] = useState({ posts: 0, replies: 0, reputation: 0 });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [leaderboardRanks, setLeaderboardRanks] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected) return;
      setLoading(true);
      try {
        const fetchId = isViewingSelf ? user?.id : targetUserId;
        if (!fetchId) {
          setLoading(false);
          return;
        }

        const [profRes, postsRes, repliesRes, ...rankRes] = await Promise.all([
          !isViewingSelf ? supabase.from("profiles").select("*").eq("id", targetUserId).single() : Promise.resolve({ data: null }),
          supabase.from("forum_posts").select("score").eq("author_id", fetchId),
          supabase.from("forum_replies").select("score").eq("author_id", fetchId),
          supabase.from("profiles").select("id").order("level", { ascending: false }).order("xp", { ascending: false }).limit(100),
          supabase.from("profiles").select("id").order("reputation", { ascending: false }).limit(100),
          supabase.from("profiles").select("id").order("completed_tasks_count", { ascending: false }).limit(100),
          supabase.from("profiles").select("id").order("completed_quizzes_count", { ascending: false }).limit(100)
        ]);

        const userProfile = profRes.data;
        const postsData = postsRes.data;
        const repliesData = repliesRes.data;

        const ranks = {
          level: (rankRes[0].data || []).findIndex(u => u.id === fetchId) + 1 || null,
          reputation: (rankRes[1].data || []).findIndex(u => u.id === fetchId) + 1 || null,
          missions: (rankRes[2].data || []).findIndex(u => u.id === fetchId) + 1 || null,
          quizzes: (rankRes[3].data || []).findIndex(u => u.id === fetchId) + 1 || null,
        };
        setLeaderboardRanks(ranks);

        let totalPosts = postsData ? postsData.length : 0;
        let totalReplies = repliesData ? repliesData.length : 0;
        let totalScore = 0;

        if (postsData) {
          totalScore += postsData.reduce((acc, curr) => acc + (curr.score || 0), 0);
        }
        if (repliesData) {
          totalScore += repliesData.reduce((acc, curr) => acc + (curr.score || 0), 0);
        }

        setForumStats({
          posts: totalPosts,
          replies: totalReplies,
          reputation: Math.max(0, totalScore),
        });
        if (userProfile) {
          setProfileData(userProfile);
        }
      } catch (e) {
        console.error("Failed to fetch stats:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isConnected, targetUserId, isViewingSelf]);

  const d_xp = isViewingSelf ? userXP : (profileData?.xp || 0);
  const d_level = isViewingSelf ? userLevel : (profileData?.level || 1);
  const d_checklists = isViewingSelf ? checklistProgress : (profileData?.checklist_progress || {});
  const d_completedTasksCount = isViewingSelf ? completedTasks.length : (profileData?.completed_tasks?.length || 0);
  const d_completedQuizzesCount = isViewingSelf ? completedQuizzes.length : (profileData?.completed_quizzes || []).length;
  const d_quizzes = isViewingSelf ? savedQuizzes : (profileData?.saved_quizzes || []);
  const d_rpgScores = isViewingSelf ? rpgScores : (profileData?.rpg_scores || {});
  const targetUsername = route.params?.username || profileData?.username;
  const d_namePrefix = isViewingSelf ? "My" : (targetUsername ? `${targetUsername}'s` : "User's");

  const completedChecklistsCount = Object.keys(d_checklists).length;
  const rawReadinessScore = calculateReadinessScore(d_completedTasksCount, d_xp, d_level);

  const d_completedQuizzesList = isViewingSelf ? completedQuizzes : (profileData?.completed_quizzes || []);
  const d_completedTasksList = isViewingSelf ? completedTasks : (profileData?.completed_tasks || []);
  const d_savedQuizzes = isViewingSelf ? savedQuizzes : (profileData?.saved_quizzes || []);
  const d_savedChecklists = isViewingSelf ? savedChecklists : (profileData?.saved_checklists || []);

  const getQuizTitle = (id) => {
    const q = QUIZZES.find(q => q.id === id);
    if (q) return q.title;
    const ai = d_savedQuizzes.find(q => q.id === id);
    return ai ? ai.title : "AI Quiz";
  };

  const getTaskTitle = (id) => {
    for (const cat of PREP_DATA) {
      const t = cat.checklists.find(c => c.id === id);
      if (t) return t.title;
    }
    const ai = d_savedChecklists.find(c => c.id === id);
    return ai ? ai.title : "AI Guide";
  };

  const renderRankBadge = (rank, type) => {
    if (!rank || rank > 100) return null;
    let color = theme.colors.text.muted;
    if (rank === 1) color = "#F59E0B";
    else if (rank === 2) color = "#94A3B8";
    else if (rank === 3) color = "#D97706";

    return (
      <TouchableOpacity 
        style={styles.rankBadgeSmall}
        onPress={() => navigation.navigate("Main", { screen: "Forum", params: { screen: "Leaderboard" } })}
      >
        <Ionicons name="trophy" size={12} color={color} />
        <Typography.Caption style={[styles.rankBadgeText, { color }]}>
          #{rank} in {type}
        </Typography.Caption>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Typography.Header style={styles.headerTitle}>{d_namePrefix} Stats</Typography.Header>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {loading && !isViewingSelf ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View>
            <Typography.SubHeader style={styles.sectionTitle}>General Readiness</Typography.SubHeader>
            <View style={styles.statsGrid}>
              <Card style={[styles.statBox, { borderColor: theme.colors.primary + '30' }]}>
                <Ionicons name="star" size={28} color={theme.colors.primary} />
                <Typography.Header style={styles.statValue}>Lv. {d_level}</Typography.Header>
                <Typography.Caption style={styles.statLabel}>{d_xp} XP</Typography.Caption>
                {renderRankBadge(leaderboardRanks.level, "Levels")}
              </Card>
              <Card style={[styles.statBox, { borderColor: theme.colors.success + '30' }]}>
                <Ionicons name="shield-checkmark" size={28} color={theme.colors.success} />
                <Typography.Header style={styles.statValue}>{rawReadinessScore}%</Typography.Header>
                <Typography.Caption style={styles.statLabel}>Readiness Score</Typography.Caption>
              </Card>
            </View>

            <Typography.SubHeader style={styles.sectionTitle}>Preparation Tasks</Typography.SubHeader>
            <Card style={styles.listCard}>
              <View style={styles.listItem}>
                <Ionicons name="list" size={22} color={theme.colors.text.secondary} style={styles.listIcon} />
                <Typography.Body style={styles.listText}>Missions Completed</Typography.Body>
                <View style={{ alignItems: 'flex-end' }}>
                  <Typography.SubHeader>{d_completedTasksCount}</Typography.SubHeader>
                  {renderRankBadge(leaderboardRanks.missions, "Missions")}
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.listItem}>
                <Ionicons name="help-circle" size={22} color={theme.colors.text.secondary} style={styles.listIcon} />
                <Typography.Body style={styles.listText}>Quizzes Completed</Typography.Body>
                <View style={{ alignItems: 'flex-end' }}>
                  <Typography.SubHeader>{d_completedQuizzesCount}</Typography.SubHeader>
                  {renderRankBadge(leaderboardRanks.quizzes, "Quizzes")}
                </View>
              </View>
            </Card>

            <Typography.SubHeader style={styles.sectionTitle}>Community Impact</Typography.SubHeader>
            <Card style={styles.listCard}>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} style={{ margin: 20 }} />
              ) : (!user && isViewingSelf) ? (
                <View style={{ padding: 16 }}>
                  <Typography.Body style={{ textAlign: "center", color: theme.colors.text.muted }}>Sign in to view community impact stats.</Typography.Body>
                </View>
              ) : (
                <View>
                  <View style={styles.listItem}>
                    <Ionicons name="chatbubbles" size={22} color={theme.colors.primary} style={styles.listIcon} />
                    <Typography.Body style={styles.listText}>Forum Posts</Typography.Body>
                    <Typography.SubHeader>{forumStats.posts}</Typography.SubHeader>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.listItem}>
                    <Ionicons name="chatbox-ellipses" size={22} color={theme.colors.success} style={styles.listIcon} />
                    <Typography.Body style={styles.listText}>Comments & Replies</Typography.Body>
                    <Typography.SubHeader>{forumStats.replies}</Typography.SubHeader>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.listItem}>
                    <Ionicons name="star" size={22} color={theme.colors.warning} style={styles.listIcon} />
                    <Typography.Body style={styles.listText}>Reputation</Typography.Body>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Typography.SubHeader style={{ color: forumStats.reputation > 0 ? theme.colors.text.primary : theme.colors.text.muted }}>
                        {forumStats.reputation}
                      </Typography.SubHeader>
                      {renderRankBadge(leaderboardRanks.reputation, "Reputation")}
                    </View>
                  </View>
                </View>
              )}
            </Card>

            <Typography.SubHeader style={styles.sectionTitle}>RPG Simulation Best Scores</Typography.SubHeader>
            <Card style={styles.listCard}>
              {Object.keys(d_rpgScores).length === 0 ? (
                <View style={{ padding: 16 }}>
                  <Typography.Body style={{ textAlign: "center", color: theme.colors.text.muted }}>
                    No RPG scenarios completed yet.
                  </Typography.Body>
                </View>
              ) : (
                NAV_TREE.filter(d => d_rpgScores[d.id] !== undefined).map((disaster, index, arr) => {
                  const score = d_rpgScores[disaster.id];
                  return (
                    <View key={disaster.id}>
                      <View style={styles.listItem}>
                        <Ionicons name={disaster.icon} size={22} color={disaster.color} style={styles.listIcon} />
                        <Typography.Body style={styles.listText}>{disaster.title} Survival</Typography.Body>
                        <Typography.SubHeader style={{ color: score > 150 ? theme.colors.success : score > 50 ? theme.colors.warning : theme.colors.danger }}>
                          {score} Pts
                        </Typography.SubHeader>
                      </View>
                      {index < arr.length - 1 && <View style={styles.divider} />}
                    </View>
                  );
                })
              )}
            </Card>

            {(d_completedTasksList.length > 0 || d_completedQuizzesList.length > 0) && (
              <View>
                <Typography.SubHeader style={styles.sectionTitle}>Completed Achievements</Typography.SubHeader>
                <Card style={styles.listCard}>
                  {d_completedTasksList.map((taskId, idx) => (
                    <View key={`task-${taskId}`}>
                      <View style={styles.listItem}>
                        <Ionicons name="checkmark-done" size={20} color={theme.colors.success} style={styles.listIcon} />
                        <Typography.Body style={styles.listText}>{getTaskTitle(taskId)}</Typography.Body>
                        <Typography.Caption style={{ color: theme.colors.success }}>MISSION</Typography.Caption>
                      </View>
                      {(idx < d_completedTasksList.length - 1 || d_completedQuizzesList.length > 0) && <View style={styles.divider} />}
                    </View>
                  ))}
                  {d_completedQuizzesList.map((quizId, idx) => (
                    <View key={`quiz-${quizId}`}>
                      <View style={styles.listItem}>
                        <Ionicons name="school" size={20} color={theme.colors.primary} style={styles.listIcon} />
                        <Typography.Body style={styles.listText}>{getQuizTitle(quizId)}</Typography.Body>
                        <Typography.Caption style={{ color: theme.colors.primary }}>QUIZ</Typography.Caption>
                      </View>
                      {idx < d_completedQuizzesList.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </Card>
              </View>
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceHighlight,
  },
  headerTitle: { marginLeft: 16, fontSize: 20 },
  scroll: { padding: 20 },
  sectionTitle: {
    fontSize: 14,
    color: theme.colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
    marginTop: 8,
  },
  statsGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statBox: {
    width: "48%",
    alignItems: "center",
    paddingVertical: 24,
    borderWidth: 1,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: { fontSize: 28, marginTop: 12, marginBottom: 4 },
  statLabel: { color: theme.colors.text.secondary, fontWeight: "600" },
  listCard: { padding: 4, backgroundColor: "white", marginBottom: 20 },
  listItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  listIcon: { marginRight: 16 },
  listText: { flex: 1, fontSize: 16, color: theme.colors.text.primary },
  divider: { height: 1, backgroundColor: theme.colors.borderLight, marginHorizontal: 16 },
  rankBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },
});
