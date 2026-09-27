import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export const Card = ({ children, style, onPress, variant = "default" }) => {
  const Component = onPress ? TouchableOpacity : View;

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          borderColor: theme.colors.success,
          backgroundColor: theme.colors.successLight,
        };
      case "danger":
        return {
          borderColor: theme.colors.danger,
          backgroundColor: theme.colors.dangerLight,
        };
      case "warning":
        return {
          borderColor: theme.colors.warning,
          backgroundColor: theme.colors.warningLight,
        };
      case "emergency":
        return {
          borderColor: theme.colors.emergency,
          backgroundColor: theme.colors.emergencyLight,
        };
      default:
        return {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        };
    }
  };

  return (
    <Component
      style={[
        {
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginVertical: theme.spacing.sm,
          borderWidth: 1.5,
          ...theme.shadows.soft,
        },
        getVariantStyles(),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </Component>
  );
};
