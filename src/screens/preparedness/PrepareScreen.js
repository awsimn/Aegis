import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { theme } from "../../styles/theme";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { PREP_DATA } from "../../data/prepData";
import { supabase } from "../../services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { AppContext } from "../../context/AppContext";

const { width } = Dimensions.get("window");

export default function PrepareScreen({ navigation }) {
  const { savedChecklists, completedTasks } = React.useContext(AppContext);
  const generalPrep = PREP_DATA.find((d) => d.id === "general");
  const disasters = PREP_DATA.filter((d) => d.id !== "general");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState("");

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      Alert.alert("Topic Required", "Please enter a disaster or safety topic.");
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("disaster-ai", {
        body: {
          action: "checklist",
          payload: { topic: aiTopic },
        },
      });

      if (error) throw error;
      if (data.error) {
        Alert.alert("AI Assistant", data.error);
        return;
      }

      
      const topicId = aiTopic
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "_");
      navigation.navigate("Checklist", {
        checklist: { ...data, id: `ai_${topicId}` },
        categoryGradient: [theme.colors.primary, theme.colors.primaryDark],
      });
      setAiTopic("");
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Failed to generate AI checklist. Please try again.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const categoryConfigs = {
    earthquake: { color: "#475569", icon: "earth-outline" },
    flood: { color: "#0066FF", icon: "water-outline" },
    fire: { color: "#EF4444", icon: "flame-outline" },
    storm: { color: "#FF9900", icon: "thunderstorm-outline" },
    drought: { color: "#F59E0B", icon: "sunny-outline" },
    epidemic: { color: "#7C3AED", icon: "medical-outline" },
    general: { color: "#10B981", icon: "medkit-outline" },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Typography.Header style={styles.pageTitle}>
          Preparedness Hub
        </Typography.Header>
        <Typography.Body style={styles.pageSubtitle}>
          Expert guides and checklists to help you and your family stay safe.
        </Typography.Body>

        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
            <Typography.SubHeader style={styles.aiTitle}>
              AI Smart Checklist
            </Typography.SubHeader>
          </View>
          <Typography.Caption style={styles.aiSubtitle}>
            Generate a custom safety guide for any situation.
          </Typography.Caption>
          <View style={styles.aiInputRow}>
            <TextInput
              style={styles.aiInput}
              placeholder="e.g. Hiking safety, Chemical spill..."
              value={aiTopic}
              onChangeText={setAiTopic}
              placeholderTextColor={theme.colors.text.muted}
            />
            <TouchableOpacity
              style={[styles.aiBtn, aiLoading && styles.aiBtnDisabled]}
              onPress={handleGenerateAI}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Ionicons name="arrow-forward" size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </Card>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("PrepCategory", { category: generalPrep })
          }
          style={styles.heroWrapper}
        >
          <Card variant="success" style={styles.heroCard}>
            <View style={styles.heroTextContent}>
              <Typography.SubHeader style={styles.heroTitle}>
                {generalPrep.title}
              </Typography.SubHeader>
              <Typography.Body style={styles.heroDesc}>
                {generalPrep.description}
              </Typography.Body>
              <View style={styles.heroBadge}>
                <Typography.Caption style={{ color: theme.colors.success }}>
                  RECOMMENDED START
                </Typography.Caption>
              </View>
            </View>
            <View
              style={[
                styles.heroIconCircle,
                { backgroundColor: theme.colors.success },
              ]}
            >
              <Ionicons
                name={categoryConfigs.general.icon}
                size={32}
                color="white"
              />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Rpg")}
          style={{ marginBottom: 32 }}
        >
          <Card style={styles.rpgCard}>
            <View style={styles.rpgContent}>
              <View style={styles.rpgIconBox}>
                <Ionicons name="game-controller" size={32} color="white" />
              </View>
              <View style={styles.rpgText}>
                <Typography.SubHeader style={{ color: "white" }}>
                  Disaster Simulator RPG
                </Typography.SubHeader>
                <Typography.Body
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}
                >
                  Practice survival scenarios in a safe environment.
                </Typography.Body>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </Card>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Typography.SubHeader style={styles.sectionTitle}>
            Disaster Scenarios
          </Typography.SubHeader>
          <Typography.Caption>Select a category</Typography.Caption>
        </View>

        <View style={styles.grid}>
          {disasters.map((item) => {
            const config = categoryConfigs[item.id] || categoryConfigs.general;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItemWrapper}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("PrepCategory", { category: item })
                }
              >
                <Card style={styles.gridCard}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: config.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={config.icon}
                      size={32}
                      color={config.color}
                    />
                  </View>
                  <Typography.SubHeader style={styles.itemTitle}>
                    {item.title}
                  </Typography.SubHeader>
                  <View style={styles.itemMeta}>
                    <Ionicons
                      name="list"
                      size={14}
                      color={theme.colors.text.muted}
                    />
                    <Typography.Caption style={styles.itemCount}>
                      {item.checklists.length} Guides
                    </Typography.Caption>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {savedChecklists.length > 0 ? (
          <View style={{ marginTop: 40, marginBottom: 8 }}>
            <View style={styles.sectionHeader}>
              <Typography.SubHeader style={styles.sectionTitle}>
                Personal Guides
              </Typography.SubHeader>
              <Typography.Caption>Saved AI Guides</Typography.Caption>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedScroll}
            >
              {savedChecklists.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.savedCardWrapper}
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate("Checklist", {
                      checklist: item,
                      categoryGradient: [
                        theme.colors.primary,
                        theme.colors.primaryDark,
                      ],
                    })
                  }}
                >
                  <Card style={styles.savedCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={styles.savedIconBox}>
                        <Ionicons
                          name="sparkles-outline"
                          size={24}
                          color={theme.colors.primary}
                        />
                      </View>
                      {completedTasks.includes(item.id) && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                      )}
                    </View>
                    <View>
                      <Typography.SubHeader
                        style={styles.savedTitle}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Typography.SubHeader>
                      <Typography.Caption
                        style={{ color: theme.colors.text.muted, marginTop: 4 }}
                      >
                        AI CUSTOM GUIDE
                      </Typography.Caption>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}



        <View style={{ height: 120 }} />
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
    padding: theme.spacing.lg,
    paddingTop: Constants.statusBarHeight + 20,
  },
  pageTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  pageSubtitle: {
    color: theme.colors.text.secondary,
    marginBottom: 32,
    fontSize: 16,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    marginBottom: 40,
    borderWidth: 2,
  },
  heroTextContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  heroBadge: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: "flex-start",
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  gridItemWrapper: {
    width: (width - 48 - 16) / 2,
    marginBottom: 8,
  },
  gridCard: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    minHeight: 180,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCount: {
    marginLeft: 6,
  },

  aiCard: {
    backgroundColor: theme.colors.primaryLight,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + "20",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  aiTitle: {
    marginLeft: 10,
    fontSize: 18,
    color: theme.colors.primary,
  },
  aiSubtitle: {
    marginBottom: 16,
    color: theme.colors.text.secondary,
  },
  aiInputRow: {
    flexDirection: "row",
    gap: 12,
  },
  aiInput: {
    flex: 1,
    height: 48,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  aiBtn: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBtnDisabled: {
    backgroundColor: theme.colors.text.muted,
  },
  savedScroll: {
    paddingRight: 20,
  },
  savedCardWrapper: {
    width: 160,
    marginRight: 16,
  },
  savedCard: {
    padding: 16,
    height: 160,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "space-between",
  },
  savedIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  savedTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  rpgCard: {
    backgroundColor: theme.colors.emergency,
    borderWidth: 0,
    padding: 20,
  },
  rpgContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rpgIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  rpgText: {
    flex: 1,
  },
});
