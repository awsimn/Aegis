import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import { Chip } from "../../components/Chip";
import { Button } from "../../components/Button";
import NetworkStatus from "../../components/NetworkStatus";
import ReadinessGauge from "../../components/ReadinessGauge";
import Constants from "expo-constants";
import { PREP_DATA } from "../../data/prepData";
import { calculateReadinessScore } from "../../utils/gamification";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { alertStatus, userXP, userLevel, completedTasks } =
    useContext(AppContext);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [isSnoozed, setIsSnoozed] = useState(false);

  const isEmergency = alertStatus === "EMERGENCY";
  const isWarning = alertStatus === "WARNING";

  React.useEffect(() => {
    if (!isEmergency) setIsSnoozed(false);
  }, [isEmergency]);

  const getStatusVariant = () => {
    if (isEmergency) return "danger";
    if (isWarning) return "warning";
    return "success";
  };

  const statusInfo = {
    EMERGENCY: {
      text: "EMERGENCY ACTIVE",
      icon: "warning",
      msg: "Danger detected! Follow emergency SOPs immediately.",
      color: theme.colors.danger,
    },
    WARNING: {
      text: "WARNING IN EFFECT",
      icon: "alert-circle",
      msg: "Potential hazard detected. Stay alert for updates.",
      color: theme.colors.emergency,
    },
    NORMAL: {
      text: "SYSTEMS NORMAL",
      icon: "shield-checkmark",
      msg: "No active threats detected in your sector.",
      color: theme.colors.success,
    },
  };

  const currentStatus = statusInfo[alertStatus] || statusInfo.NORMAL;

  const shortcuts = [
    { id: "earthquake", label: "Quake", icon: "earth", color: "#64748B" },
    { id: "flood", label: "Flood", icon: "water", color: "#64748B" },
    { id: "fire", label: "Fire", icon: "flame", color: "#64748B" },
    { id: "storm", label: "Storm", icon: "thunderstorm", color: "#64748B" },
    { id: "drought", label: "Drought", icon: "sunny", color: "#64748B" },
    { id: "epidemic", label: "Epidemic", icon: "medical", color: "#64748B" },
  ];

  const readinessScore = calculateReadinessScore(
    completedTasks.length,
    userXP,
    userLevel,
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle={isEmergency && !isSnoozed ? "light-content" : "dark-content"}
      />
      <NetworkStatus />

      {}
      <View style={styles.topNav}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../../assets/aegis-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Typography.Header style={styles.brandTitle}>
              READY
            </Typography.Header>
            <Typography.Caption style={styles.dateLabel}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Typography.Caption>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileCircle}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="person" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <Card variant={getStatusVariant()} style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons
              name={currentStatus.icon}
              size={24}
              color={currentStatus.color}
            />
            <Typography.SubHeader
              style={[styles.statusTitle, { color: currentStatus.color }]}
            >
              {currentStatus.text}
            </Typography.SubHeader>
          </View>
          <Typography.Body style={styles.statusMsg}>
            {currentStatus.msg}
          </Typography.Body>
          {alertStatus === "NORMAL" ? (
            <Typography.Caption style={styles.monitorTag}>
              GPS real-time monitoring active
            </Typography.Caption>
          ) : (
            <Button
              title="Activate SOS Beacon"
              variant="danger"
              style={{ marginTop: 16 }}
              onPress={() => navigation.navigate("SOSBeacon")}
              icon={<Ionicons name="radio" size={20} color="white" />}
            />
          )}
        </Card>

        <View style={styles.sectionHeader}>
          <Typography.SubHeader>Tactical Tools</Typography.SubHeader>
        </View>

        <View style={styles.toolsRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("SOSBeacon")}
            style={[
              styles.toolCard,
              { backgroundColor: "#FEF2F2", borderColor: "#FEE2E2" },
            ]}
          >
            <View style={styles.toolIconWrapper}>
              <Ionicons name="radio" size={24} color="#DC2626" />
            </View>
            <Typography.SubHeader
              style={{
                fontSize: 13,
                marginTop: 10,
                color: "#DC2626",
                fontWeight: "800",
              }}
            >
              SOS BEACON
            </Typography.SubHeader>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("OfflineNav")}
            style={[
              styles.toolCard,
              { backgroundColor: "#F0F9FF", borderColor: "#E0F2FE" },
            ]}
          >
            <View style={styles.toolIconWrapper}>
              <Ionicons name="compass" size={24} color="#0284C7" />
            </View>
            <Typography.SubHeader
              style={{
                fontSize: 13,
                marginTop: 10,
                color: "#0284C7",
                fontWeight: "800",
              }}
            >
              RESCUE RADAR
            </Typography.SubHeader>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.statsRow}>
          <Card style={styles.statBox}>
            <Typography.Header style={styles.statVal}>
              {userLevel}
            </Typography.Header>
            <Typography.Caption>XP LEVEL</Typography.Caption>
          </Card>
          <Card style={styles.statBox}>
            <Typography.Header style={styles.statVal}>
              {userXP}
            </Typography.Header>
            <Typography.Caption>XP POINTS</Typography.Caption>
          </Card>
        </View>

        {}
        <Card style={styles.readinessCard}>
          <View style={styles.readinessRow}>
            <ReadinessGauge score={readinessScore} />
            <View style={styles.readinessInfo}>
              <Typography.SubHeader style={{ fontSize: 15, marginBottom: 4 }}>
                Readiness Score
              </Typography.SubHeader>
              <Typography.Caption style={{ lineHeight: 18 }}>
                {readinessScore < 50
                  ? "Your score is low. Complete the emergency kit checklist to reach a safer tier."
                  : readinessScore < 80
                    ? "Good progress. Secure your furniture to enhance your readiness."
                    : "Excellent preparation. Keep your supplies rotated and up-to-date."}
              </Typography.Caption>
            </View>
          </View>
        </Card>

        {!user && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Forum", { screen: "Auth" })}
            style={[styles.authBanner, { marginTop: 0, marginBottom: 32 }]}
          >
            <Ionicons name="cloud-done-outline" size={24} color="white" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Typography.Body style={{ color: "white", fontWeight: "700" }}>
                Sync Your Progress
              </Typography.Body>
              <Typography.Caption style={{ color: "white", opacity: 0.8 }}>
                Backup your XP to the cloud.
              </Typography.Caption>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        )}

        {}
        <View style={styles.sectionHeader}>
          <Typography.SubHeader>Quick Resources</Typography.SubHeader>
          <Button
            title="View All"
            variant="outline"
            style={styles.miniBtn}
            onPress={() => navigation.navigate("Prepare")}
          />
        </View>

        <View style={styles.grid}>
          {shortcuts.map((item, index) => {
            const dataItem = PREP_DATA.find((d) => d.id === item.id);
            return (
              <TouchableOpacity
                key={index}
                style={styles.gridItemWrapper}
                onPress={() =>
                  navigation.navigate("GuideDetail", { disasterId: item.id })
                }
              >
                <Card style={[styles.gridItem]}>
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name={item.icon}
                      size={28}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Typography.Body style={styles.gridLabel}>
                    {item.label}
                  </Typography.Body>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {}
        <Card style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb" size={20} color={theme.colors.emergency} />
            <Typography.SubHeader style={styles.insightTitle}>
              Daily Insight
            </Typography.SubHeader>
          </View>
          <Typography.Body style={styles.insightText}>
            Families with a written reunification plan are 3x more likely to
            stay together during tectonic events.
          </Typography.Body>
          <Button
            title="Setup Now"
            variant="outline"
            style={{ paddingVertical: 8, marginTop: 12 }}
            onPress={() => navigation.navigate("Prepare")}
          />
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>

      {}
      {isEmergency && !isSnoozed && (
        <View style={styles.emergencyOverlay}>
          <View style={styles.emergencyTop}>
            <Ionicons name="warning" size={72} color="white" />
            <Typography.Header
              style={{
                color: "white",
                marginTop: 16,
                fontSize: 32,
                textAlign: "center",
              }}
            >
              EMERGENCY ACTIVE
            </Typography.Header>
            <Typography.Body
              style={{
                color: "white",
                marginTop: 12,
                textAlign: "center",
                fontSize: 18,
                opacity: 0.9,
              }}
            >
              Hazard detected in your sector.
            </Typography.Body>
          </View>

          <View
            style={[
              styles.emergencyActions,
              { paddingBottom: (insets.bottom || 20) + 20 },
            ]}
          >
            <TouchableOpacity
              style={styles.emergencyBtnBig}
              onPress={() => navigation.navigate("SOSBeacon")}
              activeOpacity={0.8}
            >
              <Ionicons name="radio" size={32} color={theme.colors.danger} />
              <Typography.Header
                style={{
                  color: theme.colors.danger,
                  marginTop: 8,
                  fontSize: 18,
                }}
              >
                SOS BEACON
              </Typography.Header>
            </TouchableOpacity>

            <View style={styles.emergencyRow}>
              <TouchableOpacity
                style={[
                  styles.emergencyBtnSmall,
                  { backgroundColor: "rgba(255,255,255,0.25)" },
                ]}
                onPress={() => navigation.navigate("KnowledgeBase")}
                activeOpacity={0.8}
              >
                <Ionicons name="book" size={28} color="white" />
                <Typography.Body
                  style={{ color: "white", marginTop: 8, fontWeight: "700" }}
                >
                  PROTOCOLS
                </Typography.Body>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.emergencyBtnSmall,
                  { backgroundColor: "rgba(255,255,255,0.25)" },
                ]}
                onPress={() => navigation.navigate("OfflineNav")}
                activeOpacity={0.8}
              >
                <Ionicons name="compass" size={28} color="white" />
                <Typography.Body
                  style={{ color: "white", marginTop: 8, fontWeight: "700" }}
                >
                  RESCUE RADAR
                </Typography.Body>
              </TouchableOpacity>
            </View>

            <Button
              title="View Dashboard"
              variant="outline"
              style={{ borderColor: "rgba(255,255,255,0.5)", marginTop: 12 }}
              onPress={() => setIsSnoozed(true)}
              textColor="white"
            />
          </View>
        </View>
      )}

      {}
      {isEmergency && isSnoozed && (
        <TouchableOpacity
          style={[styles.emergencyFab, { bottom: (insets.bottom || 20) + 10 }]}
          onPress={() => setIsSnoozed(false)}
        >
          <Ionicons name="warning" size={24} color="white" />
          <Typography.Body
            style={{ color: "white", marginLeft: 8, fontWeight: "800" }}
          >
            EMERGENCY ACTIVE
          </Typography.Body>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emergencyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.danger,
    zIndex: 1000,
    justifyContent: "space-between",
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 15,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
    color: theme.colors.primary,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  statusCard: {
    marginBottom: 24,
    padding: 20,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTitle: {
    marginLeft: 12,
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "800",
  },
  statusMsg: {
    fontSize: 16,
    fontWeight: "600",
  },
  monitorTag: {
    marginTop: 12,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  readinessCard: {
    marginBottom: 32,
    padding: 20,
  },
  readinessRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  readinessInfo: {
    flex: 1,
    marginLeft: 20,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  statVal: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  miniBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    minHeight: 0,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItemWrapper: {
    width: "48%",
    marginBottom: 12,
  },
  gridItem: {
    alignItems: "center",
    paddingVertical: 24,
    width: "100%",
    backgroundColor: theme.colors.background,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  gridLabel: {
    fontWeight: "700",
    fontSize: 14,
  },
  insightCard: {
    marginTop: 20,
    backgroundColor: theme.colors.surfaceHighlight,
    borderWidth: 0,
    padding: 24,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  insightTitle: {
    marginLeft: 10,
    fontSize: 16,
  },
  insightText: {
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  authBanner: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  toolsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  toolCard: {
    flex: 1,
    padding: 20,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
  },
  toolIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emergencyTop: {
    paddingTop: Constants.statusBarHeight + 60,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyActions: {
    padding: 24,
    paddingBottom: 60,
    gap: 16,
  },
  emergencyRow: {
    flexDirection: "row",
    gap: 16,
  },
  emergencyBtnBig: {
    backgroundColor: "white",
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emergencyBtnSmall: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  emergencyFab: {
    position: "absolute",
    right: 20,
    backgroundColor: theme.colors.danger,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 2000,
  },
});
