import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export const Chip = ({ label, color, style }) => (
  <View
    style={[
      styles.chip,
      { backgroundColor: color ? color + "20" : theme.colors.primaryLight },
      style,
    ]}
  >
    <Text style={[styles.chipText, { color: color || theme.colors.primary }]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    alignSelf: "flex-start",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
