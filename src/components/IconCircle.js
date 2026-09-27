import React from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const IconCircle = ({
  icon,
  color,
  size = 28,
  containerSize = 60,
  backgroundColor,
  style,
}) => {
  const bgColor = backgroundColor || (color ? color + "20" : "#F3F4F6");

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
