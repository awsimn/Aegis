import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { theme } from "../styles/theme";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 130;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReadinessGauge({ score }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
    extrapolate: "clamp",
  });

  const getColor = (s) => {
    if (s >= 70) return theme.colors.success;
    if (s >= 40) return theme.colors.warning;
    return theme.colors.danger;
  };

  const getLabel = (s) => {
    if (s >= 70) return "Well Prepared";
    if (s >= 40) return "Moderate";
    return "Needs Work";
  };

  const color = getColor(score);

  return (
    <View style={styles.container}>
      <View style={styles.gaugeWrap}>
        <Svg
          width={SIZE}
          height={SIZE}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          {}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#E5E7EB"
            strokeWidth={STROKE}
            fill="none"
          />
          {}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        {}
        <View style={styles.centerLabel}>
          <Text style={[styles.scoreText, { color }]}>
            {Math.round(score)}%
          </Text>
          <Text style={styles.subLabel}>{getLabel(score)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  gaugeWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});
