import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { theme } from "../../styles/theme";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

export default function ResourceScreen({ navigation }) {
  const categories = [
    {
      id: "guide",
      label: "Emergency Guides",
      icon: "book-outline",
      color: theme.colors.primary,
      navigateTo: "GuideMenu",
    },
    {
      id: "contacts",
      label: "Vital Contacts",
      icon: "call-outline",
      color: theme.colors.success,
      navigateTo: "VitalContacts",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography.Header style={styles.headerTitle}>
            Resource Hub
          </Typography.Header>
          <Typography.Body style={{ color: theme.colors.text.secondary }}>
            Essential tools and knowledge for disaster readiness.
          </Typography.Body>
        </View>

        <View style={styles.grid}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => {
                if (item.navigateTo) {
                  navigation.navigate(item.navigateTo);
                } else {
                  navigation.navigate("ResourceDetail", {
                    ...item.detail,
                    image: "https://i.imgur.com/8Qe2J5M.png",
                  });
                }
              }}
              activeOpacity={0.8}
            >
              <Card style={styles.cardContent}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <Ionicons name={item.icon} size={32} color={item.color} />
                </View>
                <Typography.SubHeader style={styles.itemLabel}>
                  {item.label}
                </Typography.SubHeader>
                <View style={[styles.itemBadge, { backgroundColor: item.color + '10' }]}>
                  <Typography.Caption
                    style={{ color: item.color, fontWeight: '700' }}
                  >
                    {item.navigateTo ? "BROWSE" : "VIEW INFO"}
                  </Typography.Caption>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Typography.SubHeader style={styles.sectionTitle}>
          Stay Informed
        </Typography.SubHeader>

        {}
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("NewsScreen")}>
          <Card
            style={[
              styles.featuredCard,
              {
                borderColor: "#9333EA" + "30",
                marginBottom: 16,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.featuredIcon,
                  { backgroundColor: "#9333EA" + "15" },
                ]}
              >
                <Ionicons name="radio-outline" size={28} color="#9333EA" />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Typography.SubHeader style={{ fontSize: 16 }}>
                  Live Disaster News Feed
                </Typography.SubHeader>
                <Typography.Caption>REAL-TIME ALERTS & UPDATES</Typography.Caption>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text.muted}
              />
            </View>
          </Card>
        </TouchableOpacity>

        {}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.getParent()?.navigate("KnowledgeBase")}
        >
          <Card
            style={[
              styles.featuredCard,
              {
                borderColor: "#10B981" + "30",
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[
                  styles.featuredIcon,
                  { backgroundColor: "#10B981" + "15" },
                ]}
              >
                <Ionicons name="search-outline" size={28} color="#10B981" />
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Typography.SubHeader style={{ fontSize: 16 }}>
                  Disaster Knowledge Base
                </Typography.SubHeader>
                <Typography.Caption>
                  RAPID ACCESS • OFFLINE-FIRST
                </Typography.Caption>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text.muted}
              />
            </View>
          </Card>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 24,
    paddingTop: Constants.statusBarHeight + 20,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  gridItem: {
    width: "47.5%",
    marginBottom: 8,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  itemLabel: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 8,
  },
  itemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
    fontSize: 18,
  },
  featuredCard: {
    padding: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  featuredIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
});
