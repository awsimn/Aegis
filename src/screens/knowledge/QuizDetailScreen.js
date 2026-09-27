import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { AppContext } from "../../context/AppContext";
import { theme } from "../../styles/theme";
import { Button } from "../../components/Button";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function QuizDetailScreen({ route, navigation }) {
  const { addXP, completeQuiz, completedQuizzes } = useContext(AppContext);

  const { quiz } = route.params;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerProcessed, setIsAnswerProcessed] = useState(false);

  if (!quiz || !quiz.questions) {
    return (
      <View style={styles.container}>
        <Typography.Header>Error loading quiz data.</Typography.Header>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleAnswerOptionClick = (isCorrect, index) => {
    if (isAnswerProcessed) return;

    setSelectedAnswer(index);
    setIsAnswerProcessed(true);

    const isRight = isCorrect;
    if (isRight) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quiz.questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsAnswerProcessed(false);
      } else {
        setShowScore(true);
        const finalScore = score + (isRight ? 1 : 0);
        const xpEarned = finalScore * 10;
        completeQuiz(quiz.id, xpEarned);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswerProcessed(false);
  };

  const handleBack = () => {
    if (!showScore) {
      Alert.alert("Quit Quiz?", "Your progress will be lost.", [
        { text: "Cancel", style: "cancel" },
        { text: "Quit", onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginRight: 32 }}>
          <Typography.Header style={{ textAlign: "center", fontSize: 18 }}>
            {quiz.title}
          </Typography.Header>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {showScore ? (
          <Card style={styles.scoreCardFlat}>
            <View
              style={[
                styles.scoreIconCircleFlat,
                { backgroundColor: theme.colors.primaryDark },
              ]}
            >
              <Ionicons name="trophy" size={50} color="#FFF" />
            </View>

            <Typography.Header
              style={{
                color: theme.colors.text.primary,
                fontSize: 32,
                marginTop: 16,
              }}
            >
              {score} / {quiz.questions.length}
            </Typography.Header>
            <Typography.SubHeader
              style={{ color: theme.colors.text.secondary }}
            >
              Correct Answers
            </Typography.SubHeader>

            <View style={styles.xpBadge}>
              <Typography.Body
                style={{ fontWeight: "bold", color: theme.colors.success }}
              >
                +{score * 10} XP Earned
              </Typography.Body>
            </View>

            <Button
              title="Retake Quiz"
              onPress={resetQuiz}
              variant="outline"
              style={{ marginTop: 24, width: "100%" }}
            />
            <Button
              title="Choose Another Quiz"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 12, width: "100%" }}
            />
          </Card>
        ) : (
          <>
            {}
            <View style={styles.progressContainer}>
              <View style={styles.progressBgFlat}>
                <View
                  style={[
                    styles.progressFillFlat,
                    {
                      width: `${
                        ((currentQuestion + 1) / quiz.questions.length) * 100
                      }%`,
                      backgroundColor: theme.colors.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressTextRow}>
                <Typography.Caption>
                  Question {currentQuestion + 1}
                </Typography.Caption>
                <Typography.Caption>
                  {quiz.questions.length} Total
                </Typography.Caption>
              </View>
            </View>

            <Card style={styles.questionCard}>
              <Typography.SubHeader
                style={{ marginBottom: 32, lineHeight: 30, fontSize: 20 }}
              >
                {quiz.questions[currentQuestion].questionText}
              </Typography.SubHeader>

              {quiz.questions[currentQuestion].answerOptions.map(
                (option, index) => {
                  let optionStyle = styles.optionBtn;
                  let textStyle = styles.optionText;
                  let iconName = "ellipse-outline";
                  let iconColor = theme.colors.text.secondary;

                  if (selectedAnswer === index) {
                    optionStyle = option.isCorrect
                      ? [styles.optionBtn, styles.correctOption]
                      : [styles.optionBtn, styles.wrongOption];
                    textStyle = option.isCorrect
                      ? [styles.optionText, styles.correctText]
                      : [styles.optionText, styles.wrongText];
                    iconName = option.isCorrect
                      ? "checkmark-circle"
                      : "close-circle";
                    iconColor = option.isCorrect
                      ? theme.colors.success
                      : theme.colors.error;
                  } else if (isAnswerProcessed && option.isCorrect) {
                    optionStyle = [styles.optionBtn, styles.correctOption];
                    textStyle = [styles.optionText, styles.correctText];
                    iconName = "checkmark-circle";
                    iconColor = theme.colors.success;
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      style={optionStyle}
                      onPress={() =>
                        handleAnswerOptionClick(option.isCorrect, index)
                      }
                      disabled={isAnswerProcessed}
                    >
                      <Ionicons
                        name={iconName}
                        size={24}
                        color={iconColor}
                        style={{ marginRight: 16 }}
                      />
                      <Typography.Body style={textStyle}>
                        {option.answerText}
                      </Typography.Body>
                    </TouchableOpacity>
                  );
                },
              )}
            </Card>
          </>
        )}
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  scroll: {
    padding: theme.spacing.lg,
  },
  scoreCardFlat: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
  },
  scoreIconCircleFlat: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  xpBadge: {
    marginTop: 12,
    backgroundColor: theme.colors.successLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.success + "40",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBgFlat: {
    height: 12,
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  progressFillFlat: {
    height: "100%",
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  questionCard: {
    padding: 24,
    borderRadius: theme.borderRadius.md,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
  },
  correctOption: {
    backgroundColor: "#F0FDF4",
    borderColor: theme.colors.success,
  },
  wrongOption: {
    backgroundColor: "#FEF2F2",
    borderColor: theme.colors.error,
  },
  optionText: {
    flex: 1,
  },
  correctText: {
    color: theme.colors.success,
    fontWeight: "bold",
  },
  wrongText: {
    color: theme.colors.error,
    fontWeight: "bold",
  },
});
