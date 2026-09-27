import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const Grid = ({ children, gap = 12, style }) => {
  return <View style={[styles.grid, { gap }, style]}>{children}</View>;
};

export const GridItem = ({ children, columns = 2, gap = 12, style }) => {
  const itemWidth = (width - 48 - gap * (columns - 1)) / columns;

  return (
    <View style={[{ width: itemWidth, marginBottom: gap }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
