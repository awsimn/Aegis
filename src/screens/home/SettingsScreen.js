import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { AppContext } from "../../context/AppContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

export default function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { userXP, userLevel, handleLogout, preferences, updatePreferences } = useContext(AppContext);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await handleLogout();
          await signOut();
          navigation.navigate("Main", { screen: "Home" });
        },
      },
    ]);
  };

  const SettingItem = ({
    icon,
    label,
    value,
    type = "chevron",
    onPress,
    color = theme.colors.text.primary,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={type === "switch" ? null : onPress}
      activeOpacity={onPress && type !== "switch" ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Typography.Body style={[styles.settingLabel, { color }]}>
        {label}
      </Typography.Body>
      {type === "chevron" && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.border}
        />
      )}
      {type === "switch" && (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
        />
      )}
      {type === "text" && (
        <Typography.Caption style={{ color: theme.colors.text.muted }}>
          {value}
        </Typography.Caption>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
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
        <Typography.Header style={styles.headerTitle}>
          Settings
        </Typography.Header>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {}
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={theme.colors.primary} />
            </View>
            <View style={styles.profileText}>
              <Typography.SubHeader>
                {user
                  ? user.user_metadata?.username || user.email
                  : "Guest User"}
              </Typography.SubHeader>
              <Typography.Caption>
                Level {userLevel} • {userXP} XP
              </Typography.Caption>
            </View>
          </View>
          {!user && (
            <Button
              title="Sync with Cloud"
              onPress={() => navigation.navigate("Main", { screen: "Forum", params: { screen: "Auth" } })}
              style={{ marginTop: 16 }}
              icon={
                <Ionicons name="cloud-upload-outline" size={20} color="white" />
              }
            />
          )}
        </Card>

        {}
        <Typography.SubHeader style={styles.sectionTitle}>
          Account
        </Typography.SubHeader>
        <Card style={styles.settingsGroup}>
          {user && (
            <SettingItem
              icon="person-outline"
              label="Edit Profile"
              onPress={() => {}}
            />
          )}
          <SettingItem
            icon="notifications-outline"
            label="High Priority Alerts"
            type="switch"
            value={preferences.notifications}
            onPress={(val) => updatePreferences({ notifications: val })}
          />
          <SettingItem
            icon="stats-chart-outline"
            label="My Stats"
            onPress={() => navigation.navigate("StatsScreen")}
          />
        </Card>

        {}
        <Typography.SubHeader style={styles.sectionTitle}>
          App Settings
        </Typography.SubHeader>
        <Card style={styles.settingsGroup}>
          <SettingItem
            icon="flash-outline"
            label="Emergency Vibrations"
            type="switch"
            value={preferences.vibration}
            onPress={(val) => updatePreferences({ vibration: val })}
          />
          <SettingItem
            icon="earth-outline"
            label="Region"
            type="text"
            value="Global"
          />
        </Card>

        {}
        <Typography.SubHeader style={styles.sectionTitle}>
          Support
        </Typography.SubHeader>
        <Card style={styles.settingsGroup}>
          <SettingItem
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => {}}
          />
          <SettingItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => {}}
          />
          <SettingItem
            icon="information-circle-outline"
            label="App Version"
            type="text"
            value="1.0.0"
          />
        </Card>

        {user && (
          <View style={{ marginTop: 24 }}>
            <Button
              title="Sign Out"
              variant="outline"
              onPress={handleSignOut}
              style={styles.signOutBtn}
              icon={
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={theme.colors.danger}
                />
              }
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("DeleteAccountScreen")}
              style={styles.deleteAccountBtn}
            >
              <Typography.Caption style={styles.deleteAccountText}>
                Delete Account
              </Typography.Caption>
            </TouchableOpacity>
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
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
  },
  scroll: {
    padding: 20,
  },
  profileCard: {
    padding: 20,
    marginBottom: 32,
    backgroundColor: "white",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileText: {
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: theme.colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsGroup: {
    padding: 4,
    marginBottom: 24,
    backgroundColor: "white",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
  },
  signOutBtn: {
    borderColor: theme.colors.danger,
    color: theme.colors.danger,
  },
  deleteAccountBtn: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
  },
  deleteAccountText: {
    color: theme.colors.danger,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
