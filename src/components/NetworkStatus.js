import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AppContext } from "../context/AppContext";
import { theme } from "../styles/theme";

export default function NetworkStatus() {
  const { isConnected } = useContext(AppContext);

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ⚠️ You are currently offline. Some features may be limited.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: "600",
  },
});
