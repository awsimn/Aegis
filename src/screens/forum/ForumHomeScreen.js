import React, { useEffect, useState, useCallback, useContext } from "react";
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
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";

export default function ForumHomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, signOut } = useAuth();
  const { handleLogout } = useContext(AppContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories(false);
    }, []),
  );

  async function fetchCategories(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategories(false);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("ForumCategory", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
    >
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Typography.SubHeader style={styles.categoryName}>
            {item.name}
          </Typography.SubHeader>
          <Typography.Caption
            numberOfLines={2}
            style={styles.categoryDescription}
          >
            {item.description}
          </Typography.Caption>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.text.muted}
        />
      </Card>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typography.Header style={styles.header}>Community</Typography.Header>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Leaderboard")}
            style={styles.iconButton}
          >
            <Ionicons
              name="trophy-outline"
              size={22}
              color={theme.colors.warning}
            />
          </TouchableOpacity>
          {user && (
            <TouchableOpacity
              onPress={async () => {
                await handleLogout();
                await signOut();
              }}
              style={[
                styles.iconButton,
                { backgroundColor: theme.colors.dangerLight },
              ]}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={theme.colors.danger}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={categories}
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
            No categories found.
          </Typography.Body>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    color: theme.colors.text.primary,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 10,
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: 12,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: theme.colors.text.muted,
  },
});
