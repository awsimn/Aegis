import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";

import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";

export default function CreatePostScreen({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  }

  async function handleCreatePost() {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Missing Fields", "Title and content are required.");
      return;
    }

    if (!user) return;

    setLoading(true);
    let imageUrl = null;

    try {
      if (imageBase64) {
        const fileName = `${user.id}/${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("forum-images")
          .upload(fileName, decode(imageBase64), {
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("forum-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("forum_posts").insert({
        category_id: categoryId,
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl,
      });

      if (error) throw error;

      Alert.alert("Success", "Post shared with community!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Typography.Header style={styles.headerTitle}>
            Create Post
          </Typography.Header>
        </View>

        <View style={styles.form}>
          <View style={styles.categoryBadge}>
            <Typography.Caption style={{ color: theme.colors.primary }}>
              FORUM: {categoryName}
            </Typography.Caption>
          </View>

          <Typography.SubHeader style={styles.label}>
            Post Title
          </Typography.SubHeader>
          <TextInput
            style={styles.inputTitle}
            placeholder="What's happening?"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            placeholderTextColor={theme.colors.text.muted}
          />

          <Typography.SubHeader style={styles.label}>
            Content
          </Typography.SubHeader>
          <TextInput
            style={styles.inputContent}
            placeholder="Provide details or ask a question..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor={theme.colors.text.muted}
          />

          {}
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <TouchableOpacity
                onPress={() => {
                  setImage(null);
                  setImageBase64(null);
                }}
                style={styles.removeImageButton}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={theme.colors.danger}
                />
              </TouchableOpacity>
            </View>
          )}

          {}
          <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
            <Ionicons
              name="image-outline"
              size={22}
              color={theme.colors.primary}
            />
            <Typography.Body style={styles.attachText}>
              {image ? "Change Photo" : "Add Photo"}
            </Typography.Body>
          </TouchableOpacity>

          <Button
            title="Publish Post"
            onPress={handleCreatePost}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
  },
  form: {
    paddingHorizontal: 24,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
    color: theme.colors.text.secondary,
  },
  inputTitle: {
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    fontSize: 16,
    fontWeight: "700",
    backgroundColor: theme.colors.surfaceHighlight,
    marginBottom: 16,
  },
  inputContent: {
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    padding: 14,
    fontSize: 16,
    height: 180,
    marginBottom: 20,
    backgroundColor: theme.colors.surfaceHighlight,
  },
  imagePreviewContainer: {
    position: "relative",
    marginBottom: 20,
    width: "100%",
    height: 220,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryLight,
    alignSelf: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  attachText: {
    color: theme.colors.primary,
    marginLeft: 10,
    fontWeight: "700",
  },
  submitBtn: {
    marginTop: 10,
  },
});
