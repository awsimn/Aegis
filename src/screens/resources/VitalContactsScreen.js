import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

const CONTACT_CATEGORIES = [
  {
    title: "Global Emergency",
    color: "#EF4444",
    contacts: [
      { name: "Police", number: "110", icon: "shield" },
      { name: "Ambulance", number: "118", icon: "medical" },
      { name: "Fire Department", number: "113", icon: "flame" },
      { name: "Search & Rescue", number: "115", icon: "search" },
    ],
  },
  {
    title: "Specialized Services",
    color: "#F59E0B",
    contacts: [
      { name: "Natural Disaster Hotline", number: "129", icon: "alert-circle" },
      { name: "Poison Control", number: "1500422", icon: "skull" },
      { name: "Electricity Emergency", number: "123", icon: "flash" },
      { name: "Water Emergency", number: "144", icon: "water" },
    ],
  },
  {
    title: "Health & Crisis",
    color: "#10B981",
    contacts: [
      { name: "Mental Health Support", number: "119", icon: "heart" },
      { name: "COVID-19 Hotline", number: "119", icon: "bandage" },
      { name: "Domestic Violence Support", number: "129", icon: "hand-left" },
    ],
  },
];

export default function VitalContactsScreen({ navigation }) {
  const handleCall = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open dialer:", err);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Typography.Header style={styles.headerTitle}>Vital Contacts</Typography.Header>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography.Body style={styles.introText}>
          Immediate access to verified emergency services and specialized disaster relief hotlines.
        </Typography.Body>

        {}
        <View style={styles.quickGrid}>
          {CONTACT_CATEGORIES[0].contacts.slice(0, 3).map((contact) => (
            <TouchableOpacity 
              key={contact.name} 
              style={[styles.quickCard, { borderColor: CONTACT_CATEGORIES[0].color + '40' }]}
              onPress={() => handleCall(contact.number)}
            >
              <View style={[styles.quickIconBox, { backgroundColor: CONTACT_CATEGORIES[0].color + '10' }]}>
                <Ionicons name={contact.icon} size={28} color={CONTACT_CATEGORIES[0].color} />
              </View>
              <Typography.SubHeader style={styles.quickName}>{contact.name}</Typography.SubHeader>
              <Typography.Header style={[styles.quickNumber, { color: CONTACT_CATEGORIES[0].color }]}>
                {contact.number}
              </Typography.Header>
            </TouchableOpacity>
          ))}
        </View>

        {}
        {CONTACT_CATEGORIES.map((category) => (
          <View key={category.title} style={styles.section}>
            <Typography.SubHeader style={[styles.sectionTitle, { color: category.color }]}>
              {category.title}
            </Typography.SubHeader>
            <Card style={styles.listCard}>
              {category.contacts.map((contact, index) => (
                <View key={contact.name}>
                  <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => handleCall(contact.number)}
                  >
                    <View style={[styles.contactIconBox, { backgroundColor: category.color + '10' }]}>
                      <Ionicons name={contact.icon} size={20} color={category.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Typography.Body style={styles.contactName}>{contact.name}</Typography.Body>
                      <Typography.Caption style={styles.contactNumberLabel}>{contact.number}</Typography.Caption>
                    </View>
                    <View style={styles.callIconBox}>
                      <Ionicons name="call" size={18} color="white" />
                    </View>
                  </TouchableOpacity>
                  {index < category.contacts.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.footer}>
          <Ionicons name="information-circle" size={16} color={theme.colors.text.muted} />
          <Typography.Caption style={styles.footerText}>
            These numbers are standard for most regions. Always check local authorities for area-specific emergency codes.
          </Typography.Caption>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceHighlight,
  },
  headerTitle: { marginLeft: 16, fontSize: 20 },
  scroll: { padding: 20 },
  introText: {
    color: theme.colors.text.secondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  quickCard: {
    width: "31%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickName: { fontSize: 10, color: theme.colors.text.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  quickNumber: { fontSize: 22, fontWeight: "900" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: "800",
  },
  listCard: { padding: 0, overflow: "hidden" },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  contactIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactName: { fontSize: 16, fontWeight: "600", color: theme.colors.text.primary },
  contactNumberLabel: { color: theme.colors.text.muted, marginTop: 2 },
  callIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: theme.colors.borderLight, marginHorizontal: 16 },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: theme.colors.surfaceHighlight,
    borderRadius: 12,
    alignItems: "center",
  },
  footerText: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.text.muted,
    lineHeight: 16,
  },
});
