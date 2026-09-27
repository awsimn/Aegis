import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { AppContext } from "../../context/AppContext";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Chip";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { QUIZZES } from "../../data/quizData";
import { supabase } from "../../services/supabase";
import { Alert, ActivityIndicator, TextInput } from "react-native";

import { theme } from "../../styles/theme";

export default function QuizScreen({ navigation }) {
  const { userXP, savedQuizzes, saveQuiz, completedQuizzes } = useContext(AppContext);
  const [aiTopic, setAiTopic] = React.useState("");
  const [aiLoading, setAiLoading] = React.useState(false);

  const handleQuizPress = (quiz) => {
    navigation.navigate("QuizDetail", { quiz });
  };

  const handleGenerateQuiz = async () => {
    if (!aiTopic.trim()) {
      Alert.alert("Topic Required", "Please enter a disaster or safety topic.");
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("disaster-ai", {
        body: {
          action: "quiz",
          payload: { topic: aiTopic },
        },
      });

      if (error) throw error;
      if (data.error) {
        Alert.alert("AI Assistant", data.error);
        return;
      }

      const generatedQuiz = {
        ...data,
        id: `ai_quiz_${Date.now()}`,
        icon: "sparkles",
        isAI: true,
      };

      await saveQuiz(generatedQuiz);
      navigation.navigate("QuizDetail", { quiz: generatedQuiz });
      setAiTopic("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to generate AI quiz. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.header}>
          <View>
            <Typography.Header style={styles.headerTitle}>
              Master Readiness
            </Typography.Header>
            <Typography.Body style={{ color: theme.colors.text.secondary }}>
              Test your knowledge & earn rewards.
            </Typography.Body>
          </View>
          <View
            style={[
              styles.xpBadge,
              {
                backgroundColor: theme.colors.emergencyLight,
                borderColor: theme.colors.emergency,
              },
            ]}
          >
            <Ionicons
              name="extension-puzzle"
              size={18}
              color={theme.colors.emergency}
            />
            <Typography.SubHeader
              style={[styles.xpText, { color: theme.colors.emergency }]}
            >
              {userXP} XP
            </Typography.SubHeader>
          </View>
        </View>

        {}
        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
            <Typography.SubHeader style={styles.aiTitle}>
              AI Smart Quiz
            </Typography.SubHeader>
          </View>
          <Typography.Caption style={styles.aiSubtitle}>
            Test your knowledge on any specific disaster topic.
          </Typography.Caption>
          <View style={styles.aiInputRow}>
            <TextInput
              style={styles.aiInput}
              placeholder="e.g. Tsunami safety, Flash floods..."
              value={aiTopic}
              onChangeText={setAiTopic}
              placeholderTextColor={theme.colors.text.muted}
            />
            <TouchableOpacity
              style={[styles.aiBtn, aiLoading && styles.aiBtnDisabled]}
              onPress={handleGenerateQuiz}
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

        <View style={styles.sectionHeader}>
          <Typography.SubHeader style={{ fontSize: 18 }}>
            Available Quizzes
          </Typography.SubHeader>
          <Typography.Caption>SELECT ONE TO START</Typography.Caption>
        </View>

        {QUIZZES.map((quiz) => (
          <TouchableOpacity
            key={quiz.id}
            onPress={() => handleQuizPress(quiz)}
            activeOpacity={0.8}
          >
            <Card
              style={[
                styles.quizCard,
                { borderColor: theme.colors.borderLight },
              ]}
            >
              <View style={styles.quizInner}>
                <View
                  style={[
                    styles.quizIconBox,
                    { backgroundColor: theme.colors.primaryLight },
                  ]}
                >
                  <Ionicons
                    name={quiz.icon + "-outline"}
                    size={30}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.quizInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Typography.SubHeader style={styles.quizTitle}>
                      {quiz.title}
                    </Typography.SubHeader>
                    {completedQuizzes.includes(quiz.id) && (
                      <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} style={{ marginLeft: 8 }} />
                    )}
                  </View>
                  <Typography.Caption style={styles.quizDesc} numberOfLines={1}>
                    {quiz.description}
                  </Typography.Caption>
                  <View style={styles.quizMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="help-circle"
                        size={14}
                        color={theme.colors.text.muted}
                      />
                      <Typography.Caption style={styles.metaVal}>
                        {quiz.questions.length} Qs
                      </Typography.Caption>
                    </View>
                    <View
                      style={[
                        styles.metaDivider,
                        { backgroundColor: theme.colors.border },
                      ]}
                    />
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="trophy"
                        size={14}
                        color={theme.colors.emergency}
                      />
                      <Typography.Caption style={styles.metaVal}>
                        {quiz.questions.length * 10} XP
                      </Typography.Caption>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.border}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {}
        {savedQuizzes && savedQuizzes.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 40 }]}>
              <Typography.SubHeader style={{ fontSize: 18 }}>
                Your Custom Quizzes
              </Typography.SubHeader>
              <Typography.Caption>AI GENERATED</Typography.Caption>
            </View>

            {savedQuizzes.map((quiz) => (
              <TouchableOpacity
                key={quiz.id}
                onPress={() => handleQuizPress(quiz)}
                activeOpacity={0.8}
              >
                <Card
                  style={[
                    styles.quizCard,
                    {
                      borderColor: theme.colors.primary + "30",
                      backgroundColor: theme.colors.primaryLight,
                    },
                  ]}
                >
                  <View style={styles.quizInner}>
                    <View
                      style={[
                        styles.quizIconBox,
                        { backgroundColor: theme.colors.primaryLight },
                      ]}
                    >
                      <Ionicons
                        name="sparkles-outline"
                        size={30}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.quizInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Typography.SubHeader style={styles.quizTitle}>
                          {quiz.title}
                        </Typography.SubHeader>
                        {completedQuizzes.includes(quiz.id) && (
                          <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} style={{ marginLeft: 8 }} />
                        )}
                      </View>
                      <Typography.Caption
                        style={styles.quizDesc}
                        numberOfLines={1}
                      >
                        {quiz.description || "Generated by AEGIS AI"}
                      </Typography.Caption>
                      <View style={styles.quizMeta}>
                        <View style={styles.metaItem}>
                          <Typography.Caption
                            style={[
                              styles.metaVal,
                              { color: theme.colors.primary },
                            ]}
                          >
                            AI VERIFIED
                          </Typography.Caption>
                        </View>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.border}
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 4,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.emergencyLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.emergency,
  },
  xpText: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.colors.emergency,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 20,
  },
  quizCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  quizInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 17,
    marginBottom: 2,
  },
  quizDesc: {
    marginBottom: 8,
  },
  quizMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaVal: {
    marginLeft: 4,
    fontWeight: "700",
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: theme.colors.border,
    marginHorizontal: 12,
  },
  aiCard: {
    backgroundColor: theme.colors.primaryLight,
    padding: 20,
    marginBottom: 40,
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
});
