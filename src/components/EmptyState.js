import React from "react";
import { View, StyleSheet } from "react-native";
import { Typography } from "./Typography";
import { theme } from "../styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

export const EmptyState = ({
  title = "Nothing here yet",
  message = "Check back later for updates.",
  icon = "file-tray-outline",
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={48} color={theme.colors.text.muted} />
      </View>
      <Typography.SubHeader style={styles.title}>{title}</Typography.SubHeader>
      <Typography.Body style={styles.message}>{message}</Typography.Body>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surfaceHighlight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    color: theme.colors.text.secondary,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    color: theme.colors.text.muted,
    textAlign: "center",
  },
});
