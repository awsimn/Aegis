import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { theme } from "../../styles/theme";
import { Typography } from "../../components/Typography";
import { Card } from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { searchService } from "../../services/SearchService";
import { NAV_TREE, CONTENT_MAP } from "../../data/disasterKnowledge";

const { width } = Dimensions.get("window");

export default function KnowledgeBaseScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  
  useEffect(() => {
    searchService.buildIndex();
  }, []);

  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = searchService.search(query);
      const autoSuggestions = searchService.getSuggestions(query);
      setResults(searchResults);
      setSuggestions(autoSuggestions);
    }, 100); 

    return () => clearTimeout(timer);
  }, [query]);

  const handleSuggestionPress = useCallback((suggestion) => {
    setQuery(suggestion);
  }, []);

  const navigateToGuide = useCallback((entry) => {
    navigation.navigate("GuideDetail", { guide: entry });
  }, [navigation]);

  const navigateToCategory = useCallback((category) => {
    navigation.navigate("KnowledgeCategory", { category });
  }, [navigation]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "#DC2626";
      case "high": return "#F59E0B";
      case "medium": return "#3B82F6";
      default: return theme.colors.text.muted;
    }
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case "before": return "construct-outline";
      case "during": return "warning-outline";
      case "after": return "checkmark-circle-outline";
      default: return "document-outline";
    }
  };

  const getPhaseLabel = (phase) => {
    switch (phase) {
      case "before": return "PREPARATION";
      case "during": return "RESPONSE";
      case "after": return "RECOVERY";
      default: return "GUIDE";
    }
  };

  
  const ResultCard = ({ entry }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigateToGuide(entry)}
    >
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={[styles.phasePill, { backgroundColor: getPriorityColor(entry.priority) + "15" }]}>
            <Ionicons name={getPhaseIcon(entry.phase)} size={12} color={getPriorityColor(entry.priority)} />
            <Typography.Caption style={{ color: getPriorityColor(entry.priority), marginLeft: 4, fontSize: 10 }}>
              {getPhaseLabel(entry.phase)}
            </Typography.Caption>
          </View>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(entry.priority) }]} />
        </View>

        <Typography.SubHeader style={styles.resultTitle} numberOfLines={2}>
          {entry.title}
        </Typography.SubHeader>
        <Typography.Caption style={styles.resultSummary} numberOfLines={2}>
          {entry.summary}
        </Typography.Caption>

        <View style={styles.resultMeta}>
          <View style={styles.resultMetaItem}>
            <Ionicons name="list-outline" size={12} color={theme.colors.text.muted} />
            <Typography.Caption style={{ marginLeft: 4, fontSize: 11 }}>
              {entry.steps?.length || 0} steps
            </Typography.Caption>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {}
      <View style={styles.searchHeader}>
        <Typography.Header style={styles.pageTitle}>Knowledge Base</Typography.Header>
        <Typography.Caption style={{ marginBottom: 16, marginTop: 2 }}>
          {Object.keys(CONTENT_MAP).length} offline guides • Instant search
        </Typography.Caption>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={theme.colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guides... (e.g. CPR, flood, shelter)"
            placeholderTextColor={theme.colors.text.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color={theme.colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>

        {}
        {suggestions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsRow}
          >
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestionChip}
                onPress={() => handleSuggestionPress(s)}
              >
                <Typography.Caption style={{ color: theme.colors.primary, fontSize: 12 }}>
                  {s}
                </Typography.Caption>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {}
        {isSearching && results.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Typography.SubHeader style={styles.sectionTitle}>
                Results ({results.length})
              </Typography.SubHeader>
            </View>
            {results.map((entry) => (
              <ResultCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}

        {isSearching && query.trim().length > 0 && results.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={theme.colors.text.muted} />
            <Typography.SubHeader style={{ marginTop: 16, textAlign: "center" }}>
              No guides found
            </Typography.SubHeader>
            <Typography.Caption style={{ marginTop: 8, textAlign: "center" }}>
              Try a different term or browse categories below.
            </Typography.Caption>
          </View>
        )}

        {}
        {!isSearching && (
          <View>
            <View style={styles.sectionHeader}>
              <Typography.SubHeader style={styles.sectionTitle}>
                Browse by Category
              </Typography.SubHeader>
            </View>

            {NAV_TREE.map((cat) => {
              const totalGuides = cat.sections.reduce((sum, s) => sum + s.ids.length, 0);
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => navigateToCategory(cat)}
                >
                  <Card style={styles.categoryCard}>
                    <View style={[styles.catIconBox, { backgroundColor: cat.color + "15" }]}>
                      <Ionicons name={cat.icon} size={28} color={cat.color} />
                    </View>
                    <View style={styles.catInfo}>
                      <Typography.SubHeader style={{ fontSize: 16 }}>
                        {cat.title}
                      </Typography.SubHeader>
                      <Typography.Caption numberOfLines={1} style={{ marginTop: 2 }}>
                        {cat.description}
                      </Typography.Caption>
                      <View style={styles.catMeta}>
                        <View style={styles.catMetaItem}>
                          <Ionicons name="document-text-outline" size={12} color={theme.colors.text.muted} />
                          <Typography.Caption style={{ marginLeft: 4, fontSize: 11 }}>
                            {totalGuides} guide{totalGuides !== 1 ? "s" : ""}
                          </Typography.Caption>
                        </View>
                        <View style={styles.catMetaItem}>
                          <Ionicons name="layers-outline" size={12} color={theme.colors.text.muted} />
                          <Typography.Caption style={{ marginLeft: 4, fontSize: 11 }}>
                            {cat.sections.length} section{cat.sections.length !== 1 ? "s" : ""}
                          </Typography.Caption>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.muted} />
                  </Card>
                </TouchableOpacity>
              );
            })}

            {}
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline-outline" size={16} color={theme.colors.success} />
              <Typography.Caption style={{ marginLeft: 8, color: theme.colors.success }}>
                All guides available offline
              </Typography.Caption>
            </View>
          </View>
        )}

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
  searchHeader: {
    paddingTop: Constants.statusBarHeight + 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pageTitle: { fontSize: 26 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    height: "100%",
    color: theme.colors.text.primary,
  },
  suggestionsRow: {
    paddingTop: 12,
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
  },
  scroll: { padding: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18 },
  resultCard: {
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  phasePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultTitle: { fontSize: 16, marginBottom: 4 },
  resultSummary: { lineHeight: 18, marginBottom: 10 },
  resultMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
  },
  catIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  catInfo: { flex: 1 },
  catMeta: {
    flexDirection: "row",
    gap: 16,
    marginTop: 6,
  },
  catMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
});
