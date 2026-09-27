import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { theme } from "../../styles/theme";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { preparednessTasks } from "./tasks";
import { AppContext } from "../../context/AppContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

export default function ChecklistScreen({ route, navigation }) {
  const { checklist, taskId } = route.params;

  const task = checklist ||
    preparednessTasks.find((t) => t.id === taskId) || {
      id: "unknown",
      title: "Unknown Task",
      description: "",
      items: [],
    };

  const { completeTask, completedTasks, saveChecklist, savedChecklists, checklistProgress, updateChecklistProgress } = useContext(AppContext);
  
  const isTaskCompletedGlobal = completedTasks.includes(task.id);
  const isSaved = savedChecklists.some((c) => c.id === task.id);
  const isAiChecklist = task.id.startsWith("ai_");

  const [items, setItems] = useState(() => {
    const savedItemProgress = checklistProgress[task.id] || [];
    return task.items.map((label, index) => ({
      id: index + 1,
      label,
      checked: savedItemProgress.includes(index + 1),
    }));
  });

  const toggleItem = (id) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setItems(newItems);
    
    
    const checkedIndices = newItems
      .filter((i) => i.checked)
      .map((i) => i.id);
    updateChecklistProgress(task.id, checkedIndices);
  };

  const completed = items.filter((i) => i.checked).length;
  const total = items.length;
  const progress = completed / total;

  useEffect(() => {
    if (completed === total && total > 0 && !isTaskCompletedGlobal) {
      completeTask(task.id, 50);
      Alert.alert("Awesome!", "You completed a task +50 XP");
    }
  }, [completed, total]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Typography.Caption
            style={{
              marginLeft: 16,
              fontSize: 13,
              textTransform: "uppercase",
              color: theme.colors.text.secondary,
            }}
          >
            Mission Detail
          </Typography.Caption>
        </View>

        <View style={styles.titleSection}>
          <Typography.Header style={{ fontSize: 28 }}>
            {task.title}
          </Typography.Header>
          <Typography.Body style={styles.desc}>
            {task.description}
          </Typography.Body>
          
          {isAiChecklist && !isSaved && (
            <Button
              title="Save to Preparedness Hub"
              onPress={async () => {
                const success = await saveChecklist(task);
                if (success) {
                  Alert.alert("Saved!", "You can now access this guide from your Preparedness Hub.");
                }
              }}
              variant="outline"
              style={{ marginTop: 16, alignSelf: 'flex-start' }}
              icon={<Ionicons name="bookmark-outline" size={20} color={theme.colors.primary} />}
            />
          )}

          {isAiChecklist && isSaved && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Typography.Caption style={{ marginLeft: 6, color: theme.colors.success }}>
                SAVED TO HUB
              </Typography.Caption>
            </View>
          )}
        </View>


        <View
          style={[
            styles.heroCardFlat,
            { backgroundColor: theme.colors.primaryDark },
          ]}
        >
          <View style={styles.progressRow}>
            <Typography.SubHeader style={{ color: "#FFF" }}>
              Mission Progress
            </Typography.SubHeader>
            <Typography.Body style={{ fontWeight: "800", color: "#FFF" }}>
              {Math.round(progress * 100)}%
            </Typography.Body>
          </View>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${progress * 100}%` }]} />
          </View>
          <Typography.Caption
            style={{
              marginTop: 8,
              color: "rgba(255,255,255,0.8)",
              fontWeight: "600",
            }}
          >
            {completed} of {total} items secured
          </Typography.Caption>
        </View>

        <Typography.SubHeader style={styles.sectionTitle}>
          Checklist
        </Typography.SubHeader>

        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.checkItem, item.checked && styles.checkItemActive]}
            onPress={() => toggleItem(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, item.checked && styles.checkboxActive]}
            >
              {item.checked && (
                <Ionicons name="checkmark" size={16} color="#FFF" />
              )}
            </View>
            <Typography.Body
              style={[styles.itemText, item.checked && styles.itemTextActive]}
            >
              {item.label}
            </Typography.Body>
          </TouchableOpacity>
        ))}

        {(completed === total || isTaskCompletedGlobal) && (
          <View style={styles.celebration}>
            <Ionicons name="gift" size={48} color={theme.colors.primary} />
            <Typography.Header style={{ fontSize: 22, marginTop: 16 }}>
              Mission Accomplished!
            </Typography.Header>
            <Typography.Body
              style={{
                textAlign: "center",
                marginTop: 8,
                color: theme.colors.text.secondary,
              }}
            >
              Excellent work. You are now better prepared for this scenario.
            </Typography.Body>
            <Button
              title="Back to Missions"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 24, paddingHorizontal: 32 }}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Constants.statusBarHeight + 10,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  titleSection: {
    marginBottom: 24,
  },
  desc: {
    color: theme.colors.text.secondary,
    marginTop: 8,
  },
  heroCardFlat: {
    borderRadius: theme.borderRadius.md,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  track: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: "#FFF",
    borderRadius: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  checkItemActive: {
    backgroundColor: theme.colors.successLight,
    borderColor: theme.colors.success + "40",
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: theme.colors.text.muted,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  itemTextActive: {
    color: theme.colors.text.secondary,
    textDecorationLine: "line-through",
  },
  celebration: {
    alignItems: "center",
    marginTop: 32,
    padding: 32,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
});
