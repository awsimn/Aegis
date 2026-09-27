import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { supabase } from "../../services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";

import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";

export default function ForumPostScreen({ route, navigation }) {
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchPostDetails();
  }, []);

  async function fetchPostDetails() {
    try {
      const { data: postData, error: postError } = await supabase
        .from("forum_posts")
        .select(`*, profiles:author_id (username, xp, level)`)
        .eq("id", postId)
        .single();

      if (postError) throw postError;
      
      let userVote = 0;
      if (user) {
        const { data: vote } = await supabase.from("forum_votes").select("vote_type").eq("post_id", postId).eq("user_id", user.id).maybeSingle();
        if (vote) userVote = vote.vote_type;
      }
      
      setPost({ ...postData, user_vote: userVote });

      fetchReplies();
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReplies() {
    const { data: repliesData, error: repliesError } = await supabase
      .from("forum_replies")
      .select(`*, profiles:author_id (username, xp, level)`)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error(repliesError);
      return;
    }
    
    let enrichedReplies = repliesData;
    if (user && repliesData.length > 0) {
      const { data: votes } = await supabase.from("forum_votes").select("reply_id, vote_type").in("reply_id", repliesData.map(r => r.id)).eq("user_id", user.id);
      if (votes) {
        const voteMap = {};
        votes.forEach(v => { voteMap[v.reply_id] = v.vote_type; });
        enrichedReplies = repliesData.map(r => ({ ...r, user_vote: voteMap[r.id] || 0 }));
      }
    }
    
    setReplies(enrichedReplies);
  }

  const handleVote = async (targetType, targetId, voteType, currentVote) => {
    if (!user) {
      Alert.alert("Login Required", "You must be logged in to vote.");
      return;
    }

    try {
      
      if (targetType === 'post') {
        const diff = (currentVote === voteType ? -voteType : voteType - currentVote);
        setPost(prev => ({ ...prev, user_vote: currentVote === voteType ? 0 : voteType, score: (prev.score || 0) + diff }));
      } else {
        const diff = (currentVote === voteType ? -voteType : voteType - currentVote);
        setReplies(prev => prev.map(r => r.id === targetId ? ({ ...r, user_vote: currentVote === voteType ? 0 : voteType, score: (r.score || 0) + diff }) : r));
      }

      if (currentVote === voteType) {
        
        const query = supabase.from("forum_votes").delete().eq("user_id", user.id);
        if (targetType === 'post') await query.eq("post_id", targetId);
        else await query.eq("reply_id", targetId);
      } else {
        
        const payload = { user_id: user.id, vote_type: voteType };
        if (targetType === 'post') payload.post_id = targetId;
        else payload.reply_id = targetId;
        
        await supabase.from("forum_votes").upsert(payload, { onConflict: `user_id, ${targetType}_id` });
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      
    }
  }

  async function handleSendReply() {
    if (!user) {
      Alert.alert("Login Required", "You must be logged in to reply.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("Auth") },
      ]);
      return;
    }

    if (!replyContent.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase.from("forum_replies").insert({
        post_id: postId,
        author_id: user.id,
        content: replyContent.trim(),
      });

      if (error) throw error;

      setReplyContent("");
      fetchReplies();
    } catch (error) {
      Alert.alert("Error", "Failed to send reply. Please try again.");
      console.error(error);
    } finally {
      setSending(false);
    }
  }

  const renderReply = ({ item }) => (
    <Card style={styles.replyCard}>
      <View style={styles.replyHeader}>
        <TouchableOpacity 
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate("StatsScreen", { userId: item.author_id, username: item.profiles?.username })}
        >
          <Typography.Body style={styles.replyAuthor}>
            @{item.profiles?.username || "Unknown"}
          </Typography.Body>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>
              Lvl {item.profiles?.level || 1}
            </Text>
          </View>
        </TouchableOpacity>
        <Typography.Caption style={styles.replyDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Typography.Caption>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View style={styles.voteSidebar}>
          <TouchableOpacity onPress={() => handleVote('reply', item.id, 1, item.user_vote || 0)}>
            <Ionicons name="arrow-up-circle" size={24} color={(item.user_vote || 0) === 1 ? theme.colors.primary : theme.colors.text.muted} />
          </TouchableOpacity>
          <Text style={styles.voteScoreText}>{item.score || 0}</Text>
          <TouchableOpacity onPress={() => handleVote('reply', item.id, -1, item.user_vote || 0)}>
            <Ionicons name="arrow-down-circle" size={24} color={(item.user_vote || 0) === -1 ? theme.colors.danger : theme.colors.text.muted} />
          </TouchableOpacity>
        </View>
        <Typography.Body style={styles.replyContent}>
          {item.content}
        </Typography.Body>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          Discussion
        </Typography.Header>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "position" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <FlatList
          data={replies}
          renderItem={renderReply}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          inverted={false}
          ListHeaderComponent={
            post ? (
              <View style={styles.postContainer}>
                <View style={styles.postHeaderRow}>
                  <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={() => navigation.navigate("StatsScreen", { userId: post.author_id, username: post.profiles?.username })}
                  >
                    <Typography.Body style={styles.postAuthor}>
                      @{post.profiles?.username || "Unknown"}
                    </Typography.Body>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>
                        Lvl {post.profiles?.level || 1}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Typography.Caption style={styles.postDate}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </Typography.Caption>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.voteSidebar, { marginRight: 16 }]}>
                    <TouchableOpacity onPress={() => handleVote('post', post.id, 1, post.user_vote || 0)}>
                      <Ionicons name="arrow-up-circle" size={28} color={(post.user_vote || 0) === 1 ? theme.colors.primary : theme.colors.text.muted} />
                    </TouchableOpacity>
                    <Text style={[styles.voteScoreText, { fontSize: 16 }]}>{post.score || 0}</Text>
                    <TouchableOpacity onPress={() => handleVote('post', post.id, -1, post.user_vote || 0)}>
                      <Ionicons name="arrow-down-circle" size={28} color={(post.user_vote || 0) === -1 ? theme.colors.danger : theme.colors.text.muted} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography.Header style={styles.postTitle}>
                      {post.title}
                    </Typography.Header>
                    {post.image_url && (
                      <Image
                        source={{ uri: post.image_url }}
                        style={styles.postImage}
                      />
                    )}
                    <Typography.Body style={styles.postContent}>
                      {post.content}
                    </Typography.Body>
                  </View>
                </View>
                <View style={styles.divider} />
                <Typography.Caption style={styles.repliesLabel}>
                  REPLIES
                </Typography.Caption>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <Typography.Body style={styles.emptyText}>
              No replies yet.
            </Typography.Body>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a reply..."
            value={replyContent}
            onChangeText={setReplyContent}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !replyContent.trim() && styles.disabledSend,
            ]}
            onPress={handleSendReply}
            disabled={!replyContent.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 10,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexGrow: 1,
  },
  postContainer: {
    paddingBottom: 24,
  },
  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  postDate: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  postImage: {
    width: "100%",
    height: 240,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 16,
    resizeMode: "cover",
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: 24,
  },
  repliesLabel: {
    fontWeight: "800",
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  replyCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  replyDate: {
    fontSize: 12,
  },
  replyContent: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    backgroundColor: theme.colors.surfaceHighlight,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  disabledSend: {
    backgroundColor: theme.colors.text.muted,
    opacity: 0.5,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.text.muted,
    marginTop: 20,
  },
  levelBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  levelText: {
    fontSize: 10,
    color: "#B45309",
    fontWeight: "800",
  },
  voteSidebar: {
    alignItems: "center",
    marginRight: 10,
  },
  voteScoreText: {
    fontWeight: "800",
    fontSize: 13,
    color: theme.colors.text.primary,
    marginVertical: 4,
  },
});
