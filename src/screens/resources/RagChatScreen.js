import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { supabase } from "../../services/supabase";

const WELCOME_MSG = {
  id: "welcome",
  role: "ai",
  text: "Hello! I'm AEGIS — your AI safety assistant.\n\nI cross-reference verified official disaster manuals to ensure every answer is accurate and safe.\n\nAsk me anything about earthquakes, floods, fires, or general emergency safety.",
  verified: false,
};

export default function RagChatScreen() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    const q = inputText.trim();
    if (!q || loading) return;

    const userMsg = { id: Date.now().toString(), role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("disaster-ai", {
        body: { action: "rag", payload: { question: q } },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "ai",
            text: data.answer || "I couldn't generate an answer.",
            verified: !!data.contextFound,
          },
        ]);
      }
    } catch (err) {
      console.warn("Online RAG failed, falling back to offline search:", err);
      import("../../services/SearchService").then(({ searchService }) => {
        const results = searchService.search(q, 3);
        let fallbackText =
          "I am currently offline. Here is the most relevant information I found in your locally stored emergency manuals:\n\n";

        if (results.length > 0) {
          results.forEach((res, i) => {
            fallbackText += `**${res.title}** (${res.phase.toUpperCase()})\n`;
            if (res.steps?.length) {
              fallbackText += `• ${res.steps[0]}\n`;
              if (res.steps[1]) fallbackText += `• ${res.steps[1]}\n`;
            }
            fallbackText += "\n";
          });
          fallbackText +=
            "Navigate to the Knowledge Base to read the full guides.";

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "ai",
              text: fallbackText.trim(),
              verified: true,
              isError: false,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "ai",
              text: "I am currently offline and couldn't find any local guides matching your question. Please try asking about general topics like 'earthquake', 'flood', or 'first aid'.",
              verified: false,
              isError: true,
            },
          ]);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "position" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={20} color="white" />
        </View>
        <View style={{ flex: 1 }}>
          <Typography.SubHeader style={{ marginBottom: 0, color: "#0F172A" }}>
            AEGIS Assistant
          </Typography.SubHeader>
          <Typography.Caption style={{ color: theme.colors.text.secondary }}>
            RAG-Verified Disaster Intelligence
          </Typography.Caption>
        </View>
      </View>

      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.row,
              msg.role === "user" ? styles.rowUser : styles.rowAi,
            ]}
          >
            {msg.role === "ai" && (
              <View style={styles.avatar}>
                <Ionicons name="shield-checkmark" size={14} color="white" />
              </View>
            )}

            <View
              style={[
                styles.bubble,
                msg.role === "user" ? styles.bubbleUser : styles.bubbleAi,
                msg.isError && styles.bubbleError,
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  msg.role === "user" && { color: "#FFFFFF" },
                ]}
              >
                {msg.text}
              </Text>

              {msg.verified && (
                <View style={styles.badge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={12}
                    color={theme.colors.success}
                  />
                  <Text style={styles.badgeText}>
                    Verified from Knowledge Base
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {loading && (
          <View style={[styles.row, styles.rowAi]}>
            <View style={styles.avatar}>
              <Ionicons name="shield-checkmark" size={14} color="white" />
            </View>
            <View
              style={[styles.bubble, styles.bubbleAi, { paddingVertical: 14 }]}
            >
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask a safety question…"
          placeholderTextColor={theme.colors.text.muted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
          editable={!loading}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!inputText.trim() || loading) && { opacity: 0.4 },
          ]}
          onPress={sendMessage}
          disabled={loading || !inputText.trim()}
        >
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  chatArea: { flex: 1 },
  row: { flexDirection: "row", marginBottom: 14, maxWidth: "100%" },
  rowUser: { justifyContent: "flex-end" },
  rowAi: { justifyContent: "flex-start" },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },

  bubble: { maxWidth: "78%", padding: 12, borderRadius: 16 },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    ...theme.shadows.soft,
  },
  bubbleError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
  },

  msgText: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.text.primary,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.success,
    fontWeight: "700",
    marginLeft: 4,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    maxHeight: 100,
    color: theme.colors.text.primary,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
