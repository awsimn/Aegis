import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Vibration,
  Platform,
  Linking,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { AppContext } from "../../context/AppContext";
import Constants from "expo-constants";

const SHAKE_THRESHOLD = 1.8;
const SHAKE_WINDOW_MS = 1500;
const SHAKES_REQUIRED = 3;

export default function SOSBeaconScreen({ navigation }) {
  const { userLocation } = useContext(AppContext);

  const [sosActive, setSosActive] = useState(false);
  const [coords, setCoords] = useState(null);
  const [shakeCount, setShakeCount] = useState(0);
  const [listening, setListening] = useState(true);

  const flashAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeTimerRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!listening) return;

    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      if (magnitude > SHAKE_THRESHOLD) {
        setShakeCount((prev) => {
          const next = prev + 1;
          if (next >= SHAKES_REQUIRED) {
            activateSOS();
            return 0;
          }
          return next;
        });

        if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
        shakeTimerRef.current = setTimeout(
          () => setShakeCount(0),
          SHAKE_WINDOW_MS,
        );
      }
    });
    subscriptionRef.current = sub;

    return () => {
      sub.remove();
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, [listening]);

  useEffect(() => {
    if (!sosActive) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => {
      loop.stop();
      pulse.stop();
    };
  }, [sosActive]);

  const activateSOS = async () => {
    setSosActive(true);
    setListening(false);
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCoords(loc.coords);
    } catch {
      if (userLocation) setCoords(userLocation);
    }
  };

  const deactivateSOS = () => {
    setSosActive(false);
    setListening(true);
    setCoords(null);
    Vibration.cancel();
  };

  const callEmergency = () => {
    Linking.openURL("tel:1122");
  };

  const bgColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#DC2626", "#FFFFFF"],
  });

  const textFlash = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#DC2626"],
  });

  if (sosActive) {
    return (
      <Animated.View
        style={[styles.sosContainer, { backgroundColor: bgColor }]}
      >
        <Animated.Text style={[styles.sosTitle, { color: textFlash }]}>
          🆘 SOS ACTIVE
        </Animated.Text>

        {coords && (
          <View style={styles.coordsBox}>
            <Text style={styles.coordsLabel}>YOUR COORDINATES</Text>
            <Text style={styles.coordsText}>
              {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.coordsHint}>Show this to rescue teams</Text>
          </View>
        )}

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.emergencyCallBtn}
            onPress={callEmergency}
          >
            <Ionicons name="call" size={28} color="white" />
            <Text style={styles.emergencyCallText}>Call 1122</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.cancelBtn} onPress={deactivateSOS}>
          <Ionicons name="close-circle" size={20} color="#DC2626" />
          <Text style={styles.cancelText}>Cancel SOS</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const shakeProgress = shakeCount / SHAKES_REQUIRED;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Typography.SubHeader style={{ marginBottom: 0 }}>
          Emergency SOS Beacon
        </Typography.SubHeader>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        {}
        <View style={styles.shakeIndicator}>
          <View
            style={[styles.shakeDot, shakeCount >= 1 && styles.shakeDotActive]}
          />
          <View
            style={[styles.shakeDot, shakeCount >= 2 && styles.shakeDotActive]}
          />
          <View
            style={[styles.shakeDot, shakeCount >= 3 && styles.shakeDotActive]}
          />
        </View>
        <Typography.Caption style={styles.shakeLabel}>
          Shake device {SHAKES_REQUIRED} times or HOLD button to trigger SOS
        </Typography.Caption>

        {}
        <TouchableOpacity
          style={styles.sosButton}
          onLongPress={activateSOS}
          delayLongPress={2000}
          activeOpacity={0.8}
        >
          <View style={styles.sosButtonInner}>
            <Ionicons name="radio" size={48} color="white" />
            <Text style={styles.sosButtonText}>HOLD TILL SOS</Text>
          </View>
        </TouchableOpacity>

        <Typography.Caption style={styles.desc}>
          Activates a visual beacon with your GPS coordinates.{"\n"}
          Shows your exact location to nearby rescue teams.
        </Typography.Caption>

        <TouchableOpacity style={styles.quickCall} onPress={callEmergency}>
          <Ionicons name="call" size={20} color={theme.colors.danger} />
          <Text style={styles.quickCallText}>Quick Dial: 1122</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 14,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: { padding: 4 },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  shakeIndicator: { flexDirection: "row", gap: 10, marginBottom: 8 },
  shakeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  shakeDotActive: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  shakeLabel: {
    marginBottom: 40,
    color: theme.colors.text.muted,
    textAlign: "center",
  },

  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  sosButtonInner: { alignItems: "center" },
  sosButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 8,
  },

  desc: {
    textAlign: "center",
    lineHeight: 20,
    color: theme.colors.text.muted,
    marginBottom: 32,
  },

  quickCall: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FEE2E2",
    backgroundColor: "#FFF5F5",
  },
  quickCallText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.danger,
  },

  sosContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  sosTitle: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 40,
  },
  coordsBox: {
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  coordsLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  coordsText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 1,
  },
  coordsHint: { fontSize: 12, color: "#9CA3AF", marginTop: 8 },

  emergencyCallBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16A34A",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 24,
  },
  emergencyCallText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 12,
  },

  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "white",
    borderRadius: 12,
  },
  cancelText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
});
