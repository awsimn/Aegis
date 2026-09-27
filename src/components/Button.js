import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { theme } from "../styles/theme";

export const Button = ({
  title,
  onPress,
  variant = "primary",
  style,
  loading,
  icon,
  textColor,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "success":
        return theme.colors.success;
      case "danger":
        return theme.colors.danger;
      case "warning":
        return theme.colors.warning;
      case "emergency":
        return theme.colors.emergency;
      case "secondary":
        return theme.colors.primaryLight;
      case "dark":
        return theme.colors.primaryDark;
      case "outline":
        return "transparent";
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (textColor) return textColor;
    if (variant === "outline" || variant === "secondary") {
      return theme.colors.primary;
    }
    return theme.colors.text.inverse;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === "outline" && styles.buttonOutline,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.buttonText, { color: getTextColor() }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  buttonOutline: {
    borderColor: theme.colors.primary,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  buttonText: {
    ...theme.typography.button,
  },
});
