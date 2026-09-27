import React from "react";
import { View } from "react-native";
import { Typography } from "./Typography";
import { theme } from "../styles/theme";

export const PageHeader = ({ title, subtitle, style }) => {
  return (
    <View style={[styles.container, style]}>
      {subtitle && (
        <Typography.Caption style={styles.subtitle}>
          {subtitle}
        </Typography.Caption>
      )}
      <Typography.Header style={styles.title}>{title}</Typography.Header>
    </View>
  );
};

const styles = {
  container: {
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.borderLight,
  },
  subtitle: {
    color: theme.colors.primary,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
};
