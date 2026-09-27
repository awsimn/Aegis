import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function DeleteAccountScreen({ navigation }) {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (confirmationText !== "Delete Account") {
      Alert.alert("Error", "Please type 'Delete Account' exactly to confirm.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      "This action is permanent. All your data, levels, and progress will be lost. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete Everything",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const { error } = await supabase.rpc("delete_current_account");

              if (error) throw error;

              await signOut();

              Alert.alert(
                "Account Deleted",
                "Your account has been successfully removed.",
              );
              navigation.replace("Main", { screen: "Home" });
            } catch (error) {
              console.error("Deletion error:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again later.",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
        <Typography.Header style={styles.headerTitle}>
          Delete Account
        </Typography.Header>
      </View>

      <View style={styles.content}>
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={32} color={theme.colors.danger} />
          <Typography.SubHeader style={styles.warningTitle}>
            This action is permanent!
          </Typography.SubHeader>
          <Typography.Body style={styles.warningText}>
            By deleting your account, you will lose all earned XP, levels,
            completed mission data, and community forum posts. This cannot be
            undone.
          </Typography.Body>
        </View>

        <Typography.Body style={styles.instructionText}>
          To confirm, please type "Delete Account" below:
        </Typography.Body>

        <TextInput
          style={styles.input}
          placeholder="Delete Account"
          value={confirmationText}
          onChangeText={setConfirmationText}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title="Permanently Delete My Account"
          onPress={handleDeleteAccount}
          variant="primary"
          style={[
            styles.deleteBtn,
            confirmationText !== "Delete Account" && styles.disabledBtn,
          ]}
          disabled={loading || confirmationText !== "Delete Account"}
          loading={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelLink}
        >
          <Typography.Body style={styles.cancelText}>
            I've changed my mind. Keep my account.
          </Typography.Body>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
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
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  warningBox: {
    backgroundColor: "#FEE2E2",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  warningTitle: {
    color: "#B91C1C",
    marginTop: 12,
    marginBottom: 8,
    fontSize: 18,
  },
  warningText: {
    color: "#7F1D1D",
    textAlign: "center",
    lineHeight: 20,
  },
  instructionText: {
    marginBottom: 16,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "white",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "700",
  },
  deleteBtn: {
    backgroundColor: theme.colors.danger,
    height: 56,
    borderRadius: 12,
  },
  disabledBtn: {
    backgroundColor: theme.colors.text.muted,
    opacity: 0.5,
  },
  cancelLink: {
    marginTop: 24,
    alignItems: "center",
  },
  cancelText: {
    color: theme.colors.text.muted,
    textDecorationLine: "underline",
  },
});
