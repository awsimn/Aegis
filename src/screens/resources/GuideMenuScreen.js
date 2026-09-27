import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { theme } from '../../styles/theme';
import { Card } from '../../components/Card';
import { Typography } from '../../components/Typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NAV_TREE } from '../../data/disasterKnowledge';
import Constants from 'expo-constants';

export default function GuideMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Typography.Header style={styles.headerTitle}>Emergency Guides</Typography.Header>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography.Body style={styles.subtitle}>
          Select a disaster type below to access critical operating procedures, preparation steps, and safety protocols.
        </Typography.Body>

        <View style={styles.grid}>
          {NAV_TREE.map((disaster) => (
            <TouchableOpacity 
              key={disaster.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('GuideDetail', { disasterId: disaster.id })}
              style={styles.gridItem}
            >
              <Card style={[styles.card, theme.shadows.soft]}>
                <View style={[styles.iconContainer, { backgroundColor: disaster.color + '10' }]}>
                  <Ionicons name={disaster.icon} size={32} color={disaster.color} />
                </View>
                <View style={styles.cardContent}>
                  <Typography.SubHeader style={styles.cardTitle}>{disaster.title}</Typography.SubHeader>
                  <Typography.Caption style={styles.cardDescription}>{disaster.description}</Typography.Caption>
                </View>
                <View style={styles.actionIcon}>
                  <Ionicons name="arrow-forward" size={18} color={theme.colors.text.muted} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight + 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.surface,
  },
  backButton: { 
    marginRight: 16,
    padding: 8,
    marginLeft: -8,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceHighlight,
  },
  headerTitle: { fontSize: 24, color: theme.colors.text.primary, marginBottom: 0 },
  scroll: { padding: 24 },
  subtitle: { color: theme.colors.text.secondary, marginBottom: 28, lineHeight: 22 },
  grid: { gap: 16 },
  gridItem: { width: '100%' },
  card: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  cardContent: { flex: 1, paddingRight: 16 },
  cardTitle: { fontSize: 18, marginBottom: 4, color: theme.colors.text.primary },
  cardDescription: { color: theme.colors.text.secondary, fontSize: 13, lineHeight: 18 },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
