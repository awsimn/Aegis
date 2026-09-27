import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Animated,
} from "react-native";
import { theme } from "../../styles/theme";
import { Card } from "../../components/Card";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import * as rssParser from "react-native-rss-parser";


const FEED_SOURCES = [
  {
    id: "reliefweb",
    name: "ReliefWeb",
    url: "https://reliefweb.int/updates/rss.xml?primary_country=&search=disaster",
    icon: "globe-outline",
    color: "#0072BC",
    description: "UN humanitarian updates",
  },
  {
    id: "gdacs",
    name: "GDACS",
    url: "https://www.gdacs.org/xml/rss.xml",
    icon: "alert-circle-outline",
    color: "#E74C3C",
    description: "Global disaster alerts",
  },
  {
    id: "usgs",
    name: "USGS Earthquakes",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.atom",
    icon: "pulse-outline",
    color: "#2ECC71",
    description: "Significant earthquakes",
  },
];


function getCategoryMeta(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("earthquake") || text.includes("seismic")) {
    return { icon: "pulse-outline", color: "#E74C3C", label: "Earthquake" };
  }
  if (text.includes("flood") || text.includes("flooding")) {
    return { icon: "water-outline", color: "#3498DB", label: "Flood" };
  }
  if (
    text.includes("cyclone") ||
    text.includes("hurricane") ||
    text.includes("typhoon") ||
    text.includes("storm") ||
    text.includes("tropical")
  ) {
    return { icon: "thunderstorm-outline", color: "#9B59B6", label: "Storm" };
  }
  if (text.includes("volcano") || text.includes("eruption")) {
    return { icon: "flame-outline", color: "#E67E22", label: "Volcano" };
  }
  if (text.includes("tsunami")) {
    return { icon: "boat-outline", color: "#1ABC9C", label: "Tsunami" };
  }
  if (
    text.includes("wildfire") ||
    text.includes("fire") ||
    text.includes("blaze")
  ) {
    return { icon: "flame-outline", color: "#F39C12", label: "Wildfire" };
  }
  if (text.includes("drought")) {
    return { icon: "sunny-outline", color: "#D4A017", label: "Drought" };
  }
  if (text.includes("landslide") || text.includes("mudslide")) {
    return { icon: "trail-sign-outline", color: "#795548", label: "Landslide" };
  }
  return { icon: "warning-outline", color: theme.colors.emergency, label: "Alert" };
}


function timeAgo(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}


function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export default function NewsScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [fadeAnim] = useState(new Animated.Value(0));

  const fetchFeeds = useCallback(async () => {
    try {
      setError(null);
      const allArticles = [];

      const feedPromises = FEED_SOURCES.map(async (source) => {
        try {
          const response = await fetch(source.url, {
            headers: {
              Accept:
                "application/rss+xml, application/xml, application/atom+xml, text/xml",
            },
          });
          const text = await response.text();
          const feed = await rssParser.parse(text);

          return feed.items.map((item) => ({
            id: `${source.id}-${item.id || item.links?.[0]?.url || item.title}`,
            title: stripHtml(item.title) || "Untitled",
            description: stripHtml(item.description || item.content)?.slice(
              0,
              200
            ),
            link: item.links?.[0]?.url || "",
            date: item.published || "",
            source: source.name,
            sourceColor: source.color,
            sourceIcon: source.icon,
            ...getCategoryMeta(
              item.title || "",
              item.description || item.content || ""
            ),
          }));
        } catch (err) {
          console.warn(`Failed to fetch ${source.name}:`, err.message);
          return [];
        }
      });

      const results = await Promise.all(feedPromises);
      results.forEach((items) => allArticles.push(...items));

      
      allArticles.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateB - dateA;
      });

      setArticles(allArticles);

      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError("Unable to load news. Pull down to retry.");
      console.error("Feed fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fadeAnim.setValue(0);
    fetchFeeds();
  }, [fetchFeeds]);

  const openArticle = (url) => {
    if (url) Linking.openURL(url);
  };

  
  const categoryFilters = [
    { id: "all", label: "All", icon: "apps-outline" },
    ...Array.from(
      new Map(
        articles.map((a) => [a.label, { id: a.label, label: a.label, icon: a.icon }])
      ).values()
    ).slice(0, 6),
  ];

  const filteredArticles =
    activeFilter === "all"
      ? articles
      : articles.filter((a) => a.label === activeFilter);

  

  const renderSourceBadges = () => (
    <View style={styles.sourceBadgeRow}>
      {FEED_SOURCES.map((s) => (
        <View key={s.id} style={styles.sourceBadge}>
          <Ionicons name={s.icon} size={14} color={s.color} />
          <Typography.Caption style={[styles.sourceBadgeText, { color: s.color }]}>
            {s.name}
          </Typography.Caption>
        </View>
      ))}
    </View>
  );

  const renderFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRow}
    >
      {categoryFilters.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={f.icon}
              size={14}
              color={isActive ? "#FFF" : theme.colors.text.secondary}
            />
            <Typography.Caption
              style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Typography.Caption>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderArticle = (article, index) => {
    const isFirst = index === 0;

    if (isFirst) {
      
      return (
        <TouchableOpacity
          key={article.id}
          onPress={() => openArticle(article.link)}
          activeOpacity={0.85}
          style={styles.heroCardWrapper}
        >
          <Card style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View
                style={[
                  styles.heroCategoryBadge,
                  { backgroundColor: article.color + "18" },
                ]}
              >
                <Ionicons name={article.icon} size={16} color={article.color} />
                <Typography.Caption
                  style={{ color: article.color, marginLeft: 6, fontWeight: "700" }}
                >
                  {article.label}
                </Typography.Caption>
              </View>
              <Typography.Caption style={styles.heroTime}>
                {timeAgo(article.date)}
              </Typography.Caption>
            </View>

            <Typography.SubHeader style={styles.heroTitle} numberOfLines={3}>
              {article.title}
            </Typography.SubHeader>

            {article.description ? (
              <Typography.Body
                style={styles.heroDescription}
                numberOfLines={3}
              >
                {article.description}
              </Typography.Body>
            ) : null}

            <View style={styles.heroFooter}>
              <View style={styles.sourceTag}>
                <Ionicons
                  name={article.sourceIcon}
                  size={12}
                  color={article.sourceColor}
                />
                <Typography.Caption style={{ marginLeft: 4, fontWeight: "600" }}>
                  {article.source}
                </Typography.Caption>
              </View>
              <View style={styles.readMore}>
                <Typography.Caption
                  style={{ color: theme.colors.primary, fontWeight: "700" }}
                >
                  Read Full Story
                </Typography.Caption>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={theme.colors.primary}
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      );
    }

    
    return (
      <TouchableOpacity
        key={article.id}
        onPress={() => openArticle(article.link)}
        activeOpacity={0.85}
        style={styles.articleCardWrapper}
      >
        <Card style={styles.articleCard}>
          <View style={styles.articleRow}>
            <View
              style={[
                styles.articleIconCircle,
                { backgroundColor: article.color + "15" },
              ]}
            >
              <Ionicons name={article.icon} size={22} color={article.color} />
            </View>

            <View style={styles.articleContent}>
              <View style={styles.articleMeta}>
                <Typography.Caption
                  style={[styles.articleSource, { color: article.sourceColor }]}
                >
                  {article.source}
                </Typography.Caption>
                <Typography.Caption style={styles.articleTime}>
                  {timeAgo(article.date)}
                </Typography.Caption>
              </View>

              <Typography.Body
                style={styles.articleTitle}
                numberOfLines={2}
              >
                {article.title}
              </Typography.Body>

              <View
                style={[
                  styles.articleCategoryTag,
                  { backgroundColor: article.color + "12" },
                ]}
              >
                <Typography.Caption
                  style={{
                    color: article.color,
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {article.label}
                </Typography.Caption>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.text.muted}
              style={{ marginLeft: 4 }}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {}
        <View style={styles.headerRow}>
          <Button
            variant="outline"
            icon={<Ionicons name="arrow-back" size={20} />}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Typography.Header style={styles.headerTitle}>
              Disaster News
            </Typography.Header>
            <Typography.Caption style={{ color: theme.colors.text.secondary }}>
              Live updates from trusted sources
            </Typography.Caption>
          </View>
        </View>

        {}
        {renderSourceBadges()}

        {}
        {articles.length > 0 && renderFilters()}

        {}
        {loading && (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Typography.Body
              style={{ marginTop: 16, color: theme.colors.text.secondary }}
            >
              Fetching latest updates...
            </Typography.Body>
          </View>
        )}

        {}
        {error && !loading && (
          <View style={styles.centerState}>
            <Ionicons
              name="cloud-offline-outline"
              size={48}
              color={theme.colors.text.muted}
            />
            <Typography.Body
              style={{ marginTop: 16, color: theme.colors.text.secondary, textAlign: "center" }}
            >
              {error}
            </Typography.Body>
            <Button
              title="Retry"
              onPress={onRefresh}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {}
        {!loading && !error && filteredArticles.length === 0 && (
          <View style={styles.centerState}>
            <Ionicons
              name="newspaper-outline"
              size={48}
              color={theme.colors.text.muted}
            />
            <Typography.Body
              style={{ marginTop: 16, color: theme.colors.text.secondary, textAlign: "center" }}
            >
              {activeFilter !== "all"
                ? `No ${activeFilter} news at this time.`
                : "No news articles found."}
            </Typography.Body>
          </View>
        )}

        {}
        {!loading && !error && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {filteredArticles.length > 0 && (
              <Typography.Caption style={styles.resultCount}>
                {filteredArticles.length} article
                {filteredArticles.length !== 1 ? "s" : ""}
                {activeFilter !== "all" ? ` • ${activeFilter}` : ""}
              </Typography.Caption>
            )}
            {filteredArticles.map((article, index) =>
              renderArticle(article, index)
            )}
          </Animated.View>
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
  scroll: {
    padding: 24,
    paddingTop: Constants.statusBarHeight + 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    height: 48,
    paddingVertical: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 2,
  },

  
  sourceBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  sourceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceHighlight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  sourceBadgeText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: "700",
  },

  
  filterRow: {
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceHighlight,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: "#FFF",
  },

  
  heroCardWrapper: {
    marginBottom: 12,
  },
  heroCard: {
    padding: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + "25",
    backgroundColor: theme.colors.primaryLight,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heroCategoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroTime: {
    color: theme.colors.text.muted,
  },
  heroTitle: {
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 8,
  },
  heroDescription: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceTag: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMore: {
    flexDirection: "row",
    alignItems: "center",
  },

  
  articleCardWrapper: {
    marginBottom: 4,
  },
  articleCard: {
    padding: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.borderLight,
  },
  articleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  articleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  articleContent: {
    flex: 1,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  articleSource: {
    fontWeight: "700",
    fontSize: 11,
  },
  articleTime: {
    color: theme.colors.text.muted,
    fontSize: 11,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  articleCategoryTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  
  centerState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  resultCount: {
    color: theme.colors.text.muted,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
  },
});
