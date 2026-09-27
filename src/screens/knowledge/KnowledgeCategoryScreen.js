import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { CONTENT_MAP } from "../../data/disasterKnowledge";

export default function KnowledgeCategoryScreen({ route, navigation }) {
  const { category } = route.params;

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case "before": return "construct-outline";
      case "during": return "warning-outline";
      case "after": return "checkmark-circle-outline";
      default: return "document-outline";
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case "before": return "#3B82F6";
      case "during": return "#EF4444";
      case "after": return "#10B981";
      default: return "#64748B";
    }
  };

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
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        {}
        <View style={[styles.hero, { backgroundColor: category.color }]}>
          <Ionicons name={category.icon} size={48} color="white" style={{ marginBottom: 16 }} />
          <Typography.Header style={{ color: "white", fontSize: 28 }}>
            {category.title}
          </Typography.Header>
          <Typography.Body style={{ color: "rgba(255,255,255,0.85)", marginTop: 8 }}>
            {category.description}
          </Typography.Body>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="cloud-offline-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Typography.Caption style={{ color: "rgba(255,255,255,0.7)", marginLeft: 6 }}>
                Available offline
              </Typography.Caption>
            </View>
          </View>
        </View>

        {}
        {category.sections.map((section, sIndex) => {
          const phaseColor = getPhaseColor(section.phase);
          return (
            <View key={sIndex} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <View style={[styles.phasePill, { backgroundColor: phaseColor + "15" }]}>
                  <Ionicons name={getPhaseIcon(section.phase)} size={14} color={phaseColor} />
                  <Typography.Caption style={{ color: phaseColor, marginLeft: 6, fontWeight: "800" }}>
                    {section.label}
                  </Typography.Caption>
                </View>
              </View>

              {section.ids.map((id) => {
                const entry = CONTENT_MAP[id];
                if (!entry) return null;
                return (
                  <TouchableOpacity
                    key={id}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("GuideDetail", { guide: entry })}
                  >
                    <Card style={styles.guideCard}>
                      <View style={styles.guideContent}>
                        <View style={{ flex: 1 }}>
                          <Typography.SubHeader style={{ fontSize: 15 }}>
                            {entry.title}
                          </Typography.SubHeader>
                          <Typography.Caption style={{ marginTop: 4, lineHeight: 17 }} numberOfLines={2}>
                            {entry.summary}
                          </Typography.Caption>
                          <View style={styles.guideMeta}>
                            <Ionicons name="list-outline" size={12} color={theme.colors.text.muted} />
                            <Typography.Caption style={{ marginLeft: 4, fontSize: 11 }}>
                              {entry.steps?.length || 0} steps
                            </Typography.Caption>
                            {entry.warnings && entry.warnings.length > 0 && (
                              <>
                                <Ionicons name="alert-circle-outline" size={12} color="#DC2626" style={{ marginLeft: 12 }} />
                                <Typography.Caption style={{ marginLeft: 4, fontSize: 11, color: "#DC2626" }}>
                                  {entry.warnings.length} warning{entry.warnings.length !== 1 ? "s" : ""}
                                </Typography.Caption>
                              </>
                            )}
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

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
  scroll: { paddingBottom: 24 },
  topRow: {
    paddingHorizontal: 24,
    paddingTop: Constants.statusBarHeight + 10,
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  hero: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 28,
    marginBottom: 28,
  },
  heroMeta: {
    flexDirection: "row",
    marginTop: 16,
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionBlock: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  phasePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  guideCard: {
    padding: 16,
    marginBottom: 10,
  },
  guideContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  guideMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
});
