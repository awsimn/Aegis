import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { AppContext } from "../../context/AppContext";
import { theme } from "../../styles/theme";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Chip";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";

const { width } = Dimensions.get("window");

export default function AlertScreen() {
  const { alertStatus, toggleAlert, simulateEvent, userLocation, activeEvent } =
    useContext(AppContext);

  const isEmergency = alertStatus === "EMERGENCY";
  const isWarning = alertStatus === "WARNING";
  const isSafeEvent = activeEvent && alertStatus === "NORMAL";

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (userLocation) {
      setMapRegion((prev) => ({
        ...prev,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }));
    }
    if (activeEvent) {
      setMapRegion({
        latitude: activeEvent.latitude,
        longitude: activeEvent.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      });
    }
  }, [userLocation, activeEvent]);

  const handleSafe = () => {
    toggleAlert("NORMAL");
  };

  const currentStatusMsg = isEmergency
    ? "Drop, Cover, and Hold On! Follow safety protocols."
    : isWarning
      ? "Potential hazard nearby. Stay tuned for updates."
      : "No active threats detected in your sector.";

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
              Live Alerts
            </Typography.Header>
            <Typography.Caption>REAL-TIME MONITORING ACTIVE</Typography.Caption>
          </View>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isEmergency
                  ? theme.colors.danger
                  : isWarning
                    ? theme.colors.emergency
                    : theme.colors.success,
              },
            ]}
          />
        </View>

        {}
        <Card
          variant={isEmergency ? "danger" : isWarning ? "warning" : "success"}
          style={styles.statusCard}
        >
          <View style={styles.statusHeader}>
            <Ionicons
              name={
                isEmergency
                  ? "warning"
                  : isWarning
                    ? "alert-circle"
                    : "shield-checkmark"
              }
              size={22}
              color={
                isEmergency
                  ? theme.colors.danger
                  : isWarning
                    ? theme.colors.emergency
                    : theme.colors.success
              }
            />
            <Typography.SubHeader
              style={[
                styles.statusText,
                {
                  color: isEmergency
                    ? theme.colors.danger
                    : isWarning
                      ? theme.colors.emergency
                      : theme.colors.success,
                },
              ]}
            >
              {isEmergency
                ? "EMERGENCY"
                : isWarning
                  ? "WARNING"
                  : "SYSTEMS NORMAL"}
            </Typography.SubHeader>
          </View>
          <Typography.Body style={styles.statusMsg}>
            {activeEvent ? activeEvent.description : currentStatusMsg}
          </Typography.Body>
          {isEmergency && (
            <Button
              title="I AM SAFE"
              variant="primary"
              style={{ marginTop: 16, backgroundColor: theme.colors.danger }}
              onPress={handleSafe}
            />
          )}
        </Card>

        {}
        <View style={styles.mapWrapper}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
          >
            {activeEvent && (
              <>
                <Marker
                  coordinate={{
                    latitude: activeEvent.latitude,
                    longitude: activeEvent.longitude,
                  }}
                  title={activeEvent.title}
                  pinColor={
                    isEmergency ? theme.colors.danger : theme.colors.emergency
                  }
                />
                <Circle
                  center={{
                    latitude: activeEvent.latitude,
                    longitude: activeEvent.longitude,
                  }}
                  radius={activeEvent.radius}
                  fillColor={
                    isEmergency
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(255, 153, 0, 0.2)"
                  }
                  strokeColor={
                    isEmergency ? theme.colors.danger : theme.colors.emergency
                  }
                />
              </>
            )}
          </MapView>
        </View>

        <View style={styles.simHeader}>
          <Typography.SubHeader style={{ fontSize: 16 }}>
            Simulation Controls
          </Typography.SubHeader>
          <Ionicons
            name="flask-outline"
            size={18}
            color={theme.colors.text.muted}
          />
        </View>

        <View style={styles.buttonGrid}>
          <Button
            title="Trigger Quake"
            variant="outline"
            style={styles.gridBtn}
            onPress={() => simulateEvent("NEAR", "EARTHQUAKE")}
          />
          <Button
            title="Trigger Flood"
            variant="outline"
            style={styles.gridBtn}
            onPress={() => simulateEvent("NEAR", "FLOOD")}
          />
          <Button
            title="Trigger Drought"
            variant="outline"
            style={styles.gridBtn}
            onPress={() => simulateEvent("NEAR", "DROUGHT")}
          />
          <Button
            title="Trigger Epidemic"
            variant="outline"
            style={styles.gridBtn}
            onPress={() => simulateEvent("NEAR", "EPIDEMIC")}
          />
          <Button
            title="Distant Event"
            variant="outline"
            style={styles.gridBtn}
            onPress={() => simulateEvent("FAR", "EARTHQUAKE")}
          />
          <Button
            title="Reset All"
            variant="secondary"
            style={styles.gridBtn}
            onPress={handleSafe}
          />
        </View>

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
    alignItems: "center",
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusCard: {
    padding: 20,
    marginBottom: 32,
    borderWidth: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "900",
  },
  statusMsg: {
    fontSize: 16,
    fontWeight: "600",
  },
  mapWrapper: {
    height: 300,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 40,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  simHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    opacity: 0.6,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridBtn: {
    width: (width - 48 - 12) / 2,
    paddingVertical: 10,
  },
});
