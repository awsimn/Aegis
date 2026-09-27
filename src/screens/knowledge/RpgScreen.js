import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { supabase } from "../../services/supabase";
import { theme } from "../../styles/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppContext } from "../../context/AppContext";

const DISASTERS = [
  {
    id: "earthquake",
    name: "Tectonic Event (7.8 Mag)",
    color: "#E53E3E",
    icon: "earth",
    desc: "Violent shaking, falling debris, power grids down.",
  },
  {
    id: "flood",
    name: "Flash Flood",
    color: "#3182CE",
    icon: "water",
    desc: "Rapidly rising waters breaking through residential zones.",
  },
  {
    id: "fire",
    name: "Wildfire Evacuation",
    color: "#DD6B20",
    icon: "flame",
    desc: "Thick smoke and fast approaching flames. Immediate action required.",
  },
  {
    id: "storm",
    name: "Severe Storm/Tornado",
    color: "#718096",
    icon: "thunderstorm",
    desc: "Winds peaking at 120mph. Structures are failing around you.",
  },
  {
    id: "drought",
    name: "Extreme Drought",
    color: "#D69E2E",
    icon: "sunny",
    desc: "Zero water pressure. 45°C heat. Resources are dangerously low.",
  },
  {
    id: "epidemic",
    name: "Viral Outbreak",
    color: "#9F7AEA",
    icon: "medical",
    desc: "A highly contagious virus is spreading. Total lockdown in effect.",
  },
];

export default function RpgScreen({ navigation }) {
  const { addXP, completedTasks, updateRpgScore } = useContext(AppContext);

  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const [narrative, setNarrative] = useState("");
  const [displayedNarrative, setDisplayedNarrative] = useState("");
  const [choices, setChoices] = useState([]);
  const [history, setHistory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [health, setHealth] = useState(100);
  const [morale, setMorale] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getInventoryStr = () => {
    let items = [];
    if (completedTasks.includes("gen_basic"))
      items.push(
        "Water, First Aid Kit, Flashlight, Emergency Whistle, Radio, Dust Mask",
      );
    if (completedTasks.includes("gen_plan"))
      items.push("Family Comm Plan, Contact Info");
    if (completedTasks.includes("eq_home"))
      items.push("Secured Furniture, Latched Cabinets");
    if (completedTasks.includes("fl_prevent"))
      items.push("Sump Pump, Sandbags");
    if (completedTasks.includes("fi_defense"))
      items.push("Defensible Space, Garden Hoses");
    if (completedTasks.includes("st_home"))
      items.push("Storm Shutters, Plywood covers");
    if (completedTasks.includes("ep_hygiene"))
      items.push("N95 Masks, Sanitizer, Disinfectants");
    if (completedTasks.includes("ep_isolation"))
      items.push("2-week Med Supply, Thermometer");

    if (completedTasks.includes("kit") && !completedTasks.includes("gen_basic"))
      items.push("Water, First Aid Kit, Flashlight");

    if (items.length === 0) return "Nothing. Bare hands.";
    return items.join(", ");
  };

  const startGame = async (disaster) => {
    setSelectedDisaster(disaster);
    setGameStarted(true);
    setIsLoading(true);
    setHealth(100);
    setMorale(100);
    setIsGameOver(false);

    const initialPrompt = `A sudden ${disaster.name} starts playing out. ${disaster.desc} What is the very first thing the player experiences right now? Make it scary and sudden. Offer two immediate reaction choices.`;

    await fetchNextScenario(
      initialPrompt,
      `Starting ${disaster.name}`,
      "A sudden onset.",
      disaster,
    );
  };

  const fetchNextScenario = async (
    scenario,
    actionHistoryText,
    baseNarrative,
    forcedDisaster = null,
  ) => {
    setIsLoading(true);
    fadeAnim.setValue(0);

    try {
      const activeDisaster = forcedDisaster || selectedDisaster;
      const { data, error } = await supabase.functions.invoke("disaster-ai", {
        body: {
          action: "rpg",
          payload: {
            disasterType: activeDisaster?.name || "Unknown Disaster",
            scenario: scenario,
            history: history + `\n${actionHistoryText}`,
            inventory: getInventoryStr(),
            health: health,
            morale: morale,
          },
        },
      });

      if (error) {
        throw error;
      }

      const newHealth = Math.max(
        0,
        Math.min(100, health + (data.healthDelta || 0)),
      );
      const newMorale = Math.max(
        0,
        Math.min(100, morale + (data.moraleDelta || 0)),
      );

      setHealth(newHealth);
      setMorale(newMorale);

      if (data.xpReward && data.xpReward > 0) {
        addXP(data.xpReward);
      }

      setNarrative(data.narrative);
      setChoices(data.choices || []);
      setHistory(
        (prev) =>
          prev +
          `\nUser Action: ${actionHistoryText} -> Result: ${data.narrative}`,
      );

      if (data.isGameOver || newHealth <= 0) {
        setIsGameOver(true);
        if (activeDisaster) {
          const finalScore = newHealth <= 0 ? 0 : newHealth + newMorale;
          updateRpgScore(activeDisaster.id, finalScore);
        }
      }

      setDisplayedNarrative(data.narrative);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the AI Game Master.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!gameStarted) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Mission Selector</Text>
          <Text style={styles.subtitle}>
            Test your preparation in simulation.
          </Text>
        </View>

        {DISASTERS.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.disasterCard, { borderLeftColor: d.color }]}
            onPress={() => startGame(d)}
            activeOpacity={0.8}
          >
            <Ionicons name={d.icon} size={32} color={d.color} />
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.disasterName}>{d.name}</Text>
              <Text style={styles.disasterDesc}>{d.desc}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={theme.colors.text.muted}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setGameStarted(false)}>
          <Ionicons name="close" size={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.smallTitle}>{selectedDisaster?.name}</Text>
        <Ionicons
          name={selectedDisaster?.icon}
          size={24}
          color={selectedDisaster?.color}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Ionicons
            name="heart"
            size={16}
            color="#E53E3E"
            style={{ width: 20 }}
          />
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                { width: `${health}%`, backgroundColor: "#E53E3E" },
              ]}
            />
          </View>
          <Text style={styles.statText}>{health}/100</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons
            name="sunny"
            size={16}
            color="#D69E2E"
            style={{ width: 20 }}
          />
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                { width: `${morale}%`, backgroundColor: "#D69E2E" },
              ]}
            />
          </View>
          <Text style={styles.statText}>{morale}/100</Text>
        </View>
      </View>

      <View
        style={[styles.storyCard, { borderLeftColor: selectedDisaster?.color }]}
      >
        <Animated.Text style={[styles.narrativeText, { opacity: fadeAnim }]}>
          {displayedNarrative}
        </Animated.Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={selectedDisaster?.color} />
          <Text style={styles.loaderText}>Game Master is thinking...</Text>
        </View>
      ) : isGameOver ? (
        <View style={styles.gameOverContainer}>
          <Ionicons
            name={health <= 0 ? "skull" : "flag"}
            size={48}
            color={theme.colors.text.primary}
          />
          <Text style={styles.gameOverTitle}>
            {health <= 0 ? "SURVIVAL FAILED" : "SCENARIO COMPLETE"}
          </Text>
          <Text style={styles.gameOverSub}>
            You finished with {health}% Health and {morale}% Morale.
          </Text>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary, marginTop: 20 },
            ]}
            onPress={() => setGameStarted(false)}
          >
            <Text style={styles.actionButtonText}>Return to HQ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.choicesContainer}>
          {choices.map((choice) => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceButton,
                { backgroundColor: theme.colors.surfaceHighlight },
              ]}
              onPress={() =>
                fetchNextScenario(
                  `User attempts to: ${choice.text}. Judge if this was smart and output consequences.`,
                  choice.text,
                )
              }
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
              <Text style={styles.hintText}>{choice.hint}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 5,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    marginTop: 5,
  },
  disasterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  disasterName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
  },
  disasterDesc: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 15,
  },
  smallTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A5568",
  },
  statsContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#EDF2F7",
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  statText: {
    width: 45,
    fontSize: 12,
    fontWeight: "bold",
    color: "#718096",
    textAlign: "right",
  },
  storyCard: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    minHeight: 150,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
    borderLeftWidth: 5,
  },
  narrativeText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#2D3748",
    fontWeight: "500",
  },
  choicesContainer: {
    gap: 15,
  },
  choiceButton: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  choiceText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  hintText: {
    color: "#718096",
    fontSize: 13,
    marginTop: 5,
    fontStyle: "italic",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loaderText: {
    marginTop: 15,
    color: "#4A5568",
    fontWeight: "600",
  },
  gameOverContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFF",
    borderRadius: 16,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 10,
  },
  gameOverSub: {
    color: "#718096",
    fontSize: 16,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
