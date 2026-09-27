import React from "react";
import { View, ScrollView, StyleSheet, StatusBar, Image } from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Chip";
import { Card } from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

export default function ResourceDetailScreen({ route, navigation }) {
  const { title, type, content, image } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Button
            variant="outline"
            icon={<Ionicons name="arrow-back" size={20} />}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
          <View style={{ marginLeft: 16 }}>
            <Typography.Caption
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              {type}
            </Typography.Caption>
          </View>
        </View>
        {image && <Image source={{ uri: image }} style={styles.heroImage} />}

        <Typography.Header style={styles.title}>{title}</Typography.Header>

        <Card style={styles.contentCard}>
          <Typography.Body>{content}</Typography.Body>
        </Card>

        <Button
          title="Mark as Read"
          style={{ marginTop: 24 }}
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  backBtn: {
    height: 48,
    paddingVertical: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 24,
  },
  scroll: {
    padding: theme.spacing.lg,
  },
  title: {
    marginBottom: 16,
  },
  contentCard: {
    minHeight: 200,
  },
});
