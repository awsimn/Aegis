import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigation = useNavigation();

  async function handleAuth() {
    setLoading(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, username);

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      if (!isLogin) {
        Alert.alert("Success", "Please check your email for verification!");
        setIsLogin(true);
      } else {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Require Email", "Please enter your email address first.");
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Check Email",
        "If an account exists, you will receive a password reset link.",
      );
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="close" size={28} color="#333" />
      </TouchableOpacity>
      <Text style={styles.title}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {isLogin && (
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        style={styles.switchButton}
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForumHome")}
        style={styles.guestButton}
      >
        <Text style={styles.guestText}>Continue to Forum as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 40,
    textAlign: "left",
    color: "#111827",
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },
  eyeIcon: {
    paddingHorizontal: 16,
    justifyContent: "center",
    height: "100%",
  },
  button: {
    height: 56,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  switchButton: {
    marginTop: 24,
    alignItems: "center",
  },
  switchText: {
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "600",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  guestButton: {
    marginTop: 40,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    borderStyle: "dashed",
    backgroundColor: "#F9FAFB",
  },
  guestText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600",
  },
});
