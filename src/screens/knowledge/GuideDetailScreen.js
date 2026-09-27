import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { theme } from "../../styles/theme";

export default function GuideDetailScreen({ route, navigation }) {
  const { guide } = route.params;

  const getPriorityColor = (p) => {
    switch (p) {
      case "critical": return "#DC2626";
      case "high": return "#F59E0B";
      case "medium": return "#3B82F6";
      default: return "#64748B";
    }
  };

  const getPhaseLabel = (phase) => {
    switch (phase) {
      case "before": return "PREPARATION";
      case "during": return "RESPONSE";
      case "after": return "RECOVERY";
      default: return "GUIDE";
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case "before": return "construct";
      case "during": return "warning";
      case "after": return "checkmark-circle";
      default: return "document";
    }
  };

  const priorityColor = getPriorityColor(guide.priority);

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
          <View style={[styles.phaseChip, { backgroundColor: priorityColor + "15" }]}>
            <Ionicons name={getPhaseIcon(guide.phase)} size={14} color={priorityColor} />
            <Typography.Caption style={{ color: priorityColor, marginLeft: 6, fontWeight: "800" }}>
              {getPhaseLabel(guide.phase)}
            </Typography.Caption>
          </View>
        </View>

        {}
        <View style={styles.titleSection}>
          <View style={styles.priorityRow}>
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor + "15" }]}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Typography.Caption style={{ color: priorityColor, fontWeight: "800", textTransform: "uppercase" }}>
                {guide.priority} priority
              </Typography.Caption>
            </View>
          </View>

          <Typography.Header style={styles.title}>
            {guide.title}
          </Typography.Header>
          <Typography.Body style={styles.summary}>
            {guide.summary}
          </Typography.Body>
        </View>

        {}
        {guide.duration && (
          <Card style={styles.durationCard}>
            <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
            <Typography.Body style={{ marginLeft: 12, flex: 1, fontSize: 13, lineHeight: 19 }}>
              {guide.duration}
            </Typography.Body>
          </Card>
        )}

        {}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={18} color={theme.colors.primary} />
            <Typography.SubHeader style={styles.sectionTitle}>
              Step-by-Step Guide
            </Typography.SubHeader>
          </View>

          {(guide.steps || []).map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary + "12" }]}>
                <Typography.Caption style={{ color: theme.colors.primary, fontWeight: "900", fontSize: 12 }}>
                  {index + 1}
                </Typography.Caption>
              </View>
              <Typography.Body style={styles.stepText}>
                {step}
              </Typography.Body>
            </View>
          ))}
        </View>

        {}
        {guide.warnings && guide.warnings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Typography.SubHeader style={[styles.sectionTitle, { color: "#DC2626" }]}>
                Critical Warnings
              </Typography.SubHeader>
            </View>

            {guide.warnings.map((warning, index) => (
              <Card key={index} style={styles.warningCard}>
                <View style={styles.warningRow}>
                  <Ionicons name="close-circle" size={16} color="#DC2626" style={{ marginTop: 2 }} />
                  <Typography.Body style={styles.warningText}>
                    {warning}
                  </Typography.Body>
                </View>
              </Card>
            ))}
          </View>
        )}

        {}
        <View style={styles.tagsSection}>
          <Typography.Caption style={{ marginBottom: 10, fontWeight: "800", letterSpacing: 1 }}>
            RELATED TOPICS
          </Typography.Caption>
          <View style={styles.tagsWrap}>
            {(guide.tags || []).map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Typography.Caption style={{ fontSize: 11 }}>
                  {tag}
                </Typography.Caption>
              </View>
            ))}
          </View>
        </View>

        {}
        <View style={styles.offlineBadge}>
          <Ionicons name="cloud-offline-outline" size={14} color={theme.colors.success} />
          <Typography.Caption style={{ marginLeft: 6, color: theme.colors.success, fontSize: 11 }}>
            Available offline
          </Typography.Caption>
        </View>

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
  scroll: { padding: 24, paddingTop: Constants.statusBarHeight + 10 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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
  phaseChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  titleSection: { marginBottom: 24 },
  priorityRow: { marginBottom: 12 },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: 26, marginBottom: 8 },
  summary: { fontSize: 15, lineHeight: 22, opacity: 0.8 },
  durationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { marginLeft: 10, fontSize: 17 },
  stepRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    marginTop: 1,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  warningCard: {
    marginBottom: 10,
    padding: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningRow: {
    flexDirection: "row",
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#991B1B",
  },
  tagsSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceHighlight,
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
});
