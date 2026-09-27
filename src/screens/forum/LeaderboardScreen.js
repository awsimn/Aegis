import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { supabase } from "../../services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";

export default function LeaderboardScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("level"); 

  const leaderboardTabs = [
    { id: "level", label: "Level", icon: "star", color: theme.colors.primary, sort: "level" },
    { id: "reputation", label: "Reputation", icon: "ribbon", color: theme.colors.warning, sort: "reputation" },
    { id: "missions", label: "Missions", icon: "list", color: theme.colors.success, sort: "completed_tasks_count" },
    { id: "quizzes", label: "Quizzes", icon: "school", color: theme.colors.secondary, sort: "completed_quizzes_count" },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard(false);
    }, [activeTab]),
  );

  async function fetchLeaderboard(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const activeTabConfig = leaderboardTabs.find(t => t.id === activeTab);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, level, xp, reputation, completed_tasks, completed_quizzes, completed_tasks_count, completed_quizzes_count")
        .order(activeTabConfig.sort, { ascending: false })
        .order("xp", { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      Alert.alert("Error", "Failed to load leaderboard.");
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard(false);
  }, [activeTab]);

  const getTrophyConfig = (rank) => {
    if (rank === 1) return { color: "#F59E0B", bg: "#FFFBEB" };
    if (rank === 2) return { color: "#94A3B8", bg: "#F8FAFC" };
    if (rank === 3) return { color: "#D97706", bg: "#FFF7ED" };
    return null;
  };

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const trophy = getTrophyConfig(rank);
    
    let displayValue = "";
    let displayLabel = "";
    
    switch(activeTab) {
      case "level":
        displayValue = `Lvl ${item.level || 1}`;
        displayLabel = `${item.xp || 0} XP earned`;
        break;
      case "reputation":
        displayValue = `${item.reputation || 0} Rep`;
        displayLabel = "Total Reputation";
        break;
      case "missions":
        displayValue = `${item.completed_tasks_count || 0} Missions`;
        displayLabel = "Preparation Completed";
        break;
      case "quizzes":
        displayValue = `${item.completed_quizzes_count || 0} Quizzes`;
        displayLabel = "Knowledge Mastery";
        break;
    }

    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={() => navigation.navigate("StatsScreen", { userId: item.id, username: item.username })}
      >
        <Card style={styles.card}>
          <View style={styles.rankBadge}>
            <Typography.Body
              style={[styles.rankText, rank <= 3 && { color: trophy.color }]}
            >
              #{rank}
            </Typography.Body>
          </View>
          <View style={styles.userInfo}>
            <Typography.SubHeader style={styles.username}>
              {item.username || "Anonymous"}
            </Typography.SubHeader>
            <Typography.Caption style={styles.xpText}>
              {displayLabel}
            </Typography.Caption>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: leaderboardTabs.find(t => t.id === activeTab).color }]}>
            <Typography.Caption style={styles.levelText}>
              {displayValue}
            </Typography.Caption>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ForumHome")}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Typography.Header style={styles.headerTitle}>
            Leaderboard
          </Typography.Header>
          <View style={{ width: 40 }} />
        </View>

        {}
        <View style={styles.tabContainer}>
          {leaderboardTabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: tab.color + "15", borderColor: tab.color }
              ]}
            >
              <Ionicons 
                name={activeTab === tab.id ? tab.icon : `${tab.icon}-outline`} 
                size={18} 
                color={activeTab === tab.id ? tab.color : theme.colors.text.muted} 
              />
              <Typography.Caption 
                style={[
                  styles.tabLabel, 
                  { color: activeTab === tab.id ? tab.color : theme.colors.text.muted }
                ]}
              >
                {tab.label}
              </Typography.Caption>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <Typography.Body style={styles.emptyText}>
              No users found.
            </Typography.Body>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  headerArea: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingTop: 50,
    paddingBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: theme.colors.surfaceHighlight,
  },
  tabLabel: {
    marginLeft: 6,
    fontWeight: "800",
    fontSize: 10,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceHighlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text.muted,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    marginBottom: 2,
  },
  xpText: {
    fontSize: 12,
  },
  levelBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    color: "white",
    fontWeight: "800",
    fontSize: 11,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: theme.colors.text.muted,
  },
});
