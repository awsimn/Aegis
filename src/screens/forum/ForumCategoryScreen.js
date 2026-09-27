import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ForumCategoryScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [categoryId]),
  );

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(
          `
          *,
          profiles:author_id (username)
        `,
        )
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreatePost = () => {
    if (!user) {
      navigation.navigate("Auth");
    } else {
      navigation.navigate("CreatePost", { categoryId });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("ForumPost", { postId: item.id, title: item.title })
      }
    >
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={() => navigation.navigate("StatsScreen", { userId: item.author_id, username: item.profiles?.username })}
          >
            <Typography.Body style={styles.author}>
              @{item.profiles?.username || "Unknown"}
            </Typography.Body>
          </TouchableOpacity>
          <Typography.Caption style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Typography.Caption>
        </View>
        <Typography.SubHeader style={styles.postTitle}>
          {item.title}
        </Typography.SubHeader>
        <Typography.Body style={styles.postPreview} numberOfLines={4}>
          {item.content}
        </Typography.Body>

        <View style={styles.footerRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={styles.stat}>
              <Ionicons name="arrow-up-circle-outline" size={18} color={theme.colors.text.muted} />
              <Typography.Caption style={styles.statText}>{item.score || 0}</Typography.Caption>
            </View>
            <View style={styles.stat}>
              <Ionicons
                name="chatbubbles-outline"
                size={16}
                color={theme.colors.text.muted}
              />
              <Typography.Caption style={styles.statText}>
                View Discussion
              </Typography.Caption>
            </View>
          </View>
          {item.is_locked && (
            <Ionicons
              name="lock-closed"
              size={14}
              color={theme.colors.danger}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Typography.Header style={styles.headerTitle}>
          {categoryName}
        </Typography.Header>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchPosts} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet.</Text>
              <Text style={styles.emptySubText}>
                Be the first to start a discussion!
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  author: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  date: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  postPreview: {
    lineHeight: 20,
    marginBottom: 16,
    color: theme.colors.text.secondary,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.medium,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
});
