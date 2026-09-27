import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { theme } from "../styles/theme";
import Constants from "expo-constants";

export const ScreenWrapper = ({
  children,
  style,
  scroll = false,
  contentContainerStyle,
  ...props
}) => {
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? {
        contentContainerStyle: [styles.scrollContent, contentContainerStyle],
        showsVerticalScrollIndicator: false,
        ...props,
      }
    : { ...props };

  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
        translucent
      />
      <Container
        style={scroll ? styles.scroll : styles.content}
        {...containerProps}
      >
        {children}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: Constants.statusBarHeight + theme.spacing.lg,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: Constants.statusBarHeight + theme.spacing.lg,
  },
});
