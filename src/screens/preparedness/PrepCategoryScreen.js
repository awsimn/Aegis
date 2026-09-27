import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../styles/theme";
import { Button } from "../../components/Button";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import { AppContext } from "../../context/AppContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

export default function PrepCategoryScreen({ navigation, route }) {
  const { category } = route.params;
  const { completedTasks } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {}
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
              fontSize: 14,
              color: theme.colors.text.secondary,
            }}
          >
            PREPAREDNESS HUB
          </Typography.Caption>
        </View>

        {}
        <View style={styles.heroFlat}>
          <View
            style={[
              styles.heroContent,
              { backgroundColor: theme.colors.primaryDark },
            ]}
          >
            <Ionicons
              name={category.icon}
              size={48}
              color="#FFF"
              style={{ marginBottom: 16 }}
            />
            <Typography.Header style={{ color: "#FFF", fontSize: 32 }}>
              {category.title}
            </Typography.Header>
            <Typography.Body
              style={{ color: "rgba(255,255,255,0.9)", marginTop: 8 }}
            >
              {category.description}
            </Typography.Body>
          </View>
        </View>

        <Typography.SubHeader style={{ marginBottom: 16 }}>
          Checklists & Missions
        </Typography.SubHeader>

        {category.checklists.map((checklist, index) => (
          <Card
            key={checklist.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("Checklist", {
                checklist: checklist,
                categoryGradient: category.gradient,
              })
            }
          >
            <View style={styles.indexCircle}>
              <Typography.Header
                style={{ color: theme.colors.primary, fontSize: 18 }}
              >
                {index + 1}
              </Typography.Header>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography.SubHeader style={{ fontSize: 18 }}>
                  {checklist.title}
                </Typography.SubHeader>
                {completedTasks.includes(checklist.id) && (
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} style={{ marginLeft: 8 }} />
                )}
              </View>
              <Typography.Caption
                numberOfLines={2}
                style={{ marginTop: 4, lineHeight: 18 }}
              >
                {checklist.description}
              </Typography.Caption>
              <View style={styles.metaRow}>
                <Ionicons
                  name="list"
                  size={14}
                  color={theme.colors.text.muted}
                />
                <Typography.Caption style={{ marginLeft: 4, fontSize: 12 }}>
                  {checklist.items.length} Tasks
                </Typography.Caption>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.text.muted}
            />
          </Card>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Constants.statusBarHeight,
  },
  scroll: {
    padding: theme.spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  heroFlat: {
    marginBottom: 32,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  heroContent: {
    padding: 32,
    alignItems: "flex-start",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 20,
  },
  indexCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
