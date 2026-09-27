import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Magnetometer } from "expo-sensors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../../styles/theme";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CompassMapScreen({ navigation }) {
  const [subscription, setSubscription] = useState(null);
  const [magnetometer, setMagnetometer] = useState(0);
  const insets = useSafeAreaInsets();
  const [safeZones, setSafeZones] = useState([
    { id: 1, title: "Evacuation Center Alpha", lat: 37.7858, lng: -122.4064 },
    { id: 2, title: "Medical Relief Tent", lat: 37.7694, lng: -122.433 },
  ]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const currentRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      setMapRegion(currentRegion);

      setSafeZones([
        {
          id: 1,
          title: "Evacuation Center Alpha",
          lat: location.coords.latitude + 0.005,
          lng: location.coords.longitude + 0.005,
        },
        {
          id: 2,
          title: "Medical Relief Center",
          lat: location.coords.latitude - 0.003,
          lng: location.coords.longitude - 0.006,
        },
      ]);
    })();

    _toggle();
    return () => _unsubscribe();
  }, []);

  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        let angle = 0;
        if (data) {
          let { x, y } = data;
          if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
          } else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
          }
        }
        setMagnetometer(Math.round(angle));
      }),
    );
    Magnetometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Offline Navigation</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title="Your Location"
            pinColor={theme.colors.primary}
          />
          {safeZones.map((zone) => (
            <Marker
              key={zone.id}
              coordinate={{ latitude: zone.lat, longitude: zone.lng }}
              title={zone.title}
              pinColor="green"
            />
          ))}
          {safeZones.map((zone) => {
            const dist = Math.sqrt(
              Math.pow(mapRegion.latitude - zone.lat, 2) +
                Math.pow(mapRegion.longitude - zone.lng, 2),
            );
            if (dist < 0.1) {
              return (
                <Polyline
                  key={`line-${zone.id}`}
                  coordinates={[
                    {
                      latitude: mapRegion.latitude,
                      longitude: mapRegion.longitude,
                    },
                    { latitude: zone.lat, longitude: zone.lng },
                  ]}
                  strokeColor={theme.colors.primary}
                  strokeWidth={3}
                  lineDashPattern={[5, 5]}
                />
              );
            }
            return null;
          })}
        </MapView>
      </View>

      <View style={styles.compassPanel}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingBottom: 40 + insets.bottom,
          }}
        >
          <Text style={styles.panelTitle}>Magnetic Heading</Text>
          <Text style={styles.headingText}>{magnetometer}°</Text>
          <View style={styles.compassCircle}>
            <Ionicons
              name="navigate"
              size={80}
              color={theme.colors.emergency}
              style={{ transform: [{ rotate: `${360 - magnetometer}deg` }] }}
            />
          </View>
          <Text style={styles.infoText}>
            Use this offline compass tool to maintain your bearing if the city
            grid loses power and GPS fails.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 15,
  },
  mapContainer: {
    height: Dimensions.get("window").height * 0.35,
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  compassPanel: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  panelTitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headingText: {
    fontSize: 48,
    fontWeight: "900",
    color: theme.colors.primary,
    marginVertical: 10,
  },
  compassCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: theme.colors.surfaceHighlight,
  },
  infoText: {
    textAlign: "center",
    lineHeight: 22,
    color: theme.colors.text.secondary,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
