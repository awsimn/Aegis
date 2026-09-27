import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { theme } from '../../styles/theme';
import { Typography } from '../../components/Typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NAV_TREE, CONTENT_MAP } from '../../data/disasterKnowledge';
import Constants from 'expo-constants';

function getPhaseConfig(phase) {
  switch(phase) {
    case 'before': return { color: theme.colors.primary, label: 'PREPARATION', icon: 'shield-checkmark' };
    case 'during': return { color: theme.colors.danger, label: 'DURING EVENT', icon: 'alert-circle' };
    case 'after': return { color: theme.colors.success, label: 'RECOVERY', icon: 'medical' };
    default: return { color: theme.colors.text.secondary, label: 'INFO', icon: 'information-circle' };
  }
}

export default function GuideDetailScreen({ route, navigation }) {
  const { disasterId } = route.params;
  const disaster = NAV_TREE.find(d => d.id === disasterId);

  if (!disaster) {
    return (
      <View style={styles.container}>
        <Typography.Body>Guide not found.</Typography.Body>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Typography.Caption style={styles.headerPreTitle}>EMERGENCY GUIDE</Typography.Caption>
          <Typography.Header style={styles.headerTitle}>{disaster.title}</Typography.Header>
        </View>
        <Ionicons name={disaster.icon} size={36} color={disaster.color} style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {disaster.sections.map((section, sIndex) => {
          const phaseConfig = getPhaseConfig(section.phase);
          
          return (
            <View key={sIndex} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={[styles.phaseIndicator, { backgroundColor: phaseConfig.color + '15' }]}>
                  <Ionicons name={phaseConfig.icon} size={14} color={phaseConfig.color} style={{ marginRight: 6 }} />
                  <Typography.Caption style={[styles.phaseText, { color: phaseConfig.color }]}>
                    {phaseConfig.label}
                  </Typography.Caption>
                </View>
                <Typography.SubHeader style={styles.sectionTitle}>{section.label}</Typography.SubHeader>
              </View>

              {section.ids.map(id => {
                const content = CONTENT_MAP[id];
                if (!content) return null;

                return (
                  <View key={id} style={styles.contentGroup}>
                    <Typography.Body style={styles.contentSummary}>{content.summary}</Typography.Body>
                    
                    {content.steps && content.steps.length > 0 && (
                      <View style={styles.stepsContainer}>
                        {content.steps.map((step, idx) => (
                          <View key={idx} style={styles.stepItem}>
                            <View style={styles.stepNumberBadge}>
                              <Typography.Caption style={styles.stepNumberText}>{idx + 1}</Typography.Caption>
                            </View>
                            <Typography.Body style={styles.stepText}>{step}</Typography.Body>
                          </View>
                        ))}
                      </View>
                    )}

                    {content.warnings && content.warnings.length > 0 && (
                      <View style={styles.warningsContainer}>
                        <View style={styles.warningHeader}>
                          <Ionicons name="warning" size={20} color={theme.colors.danger} />
                          <Typography.SubHeader style={styles.warningTitle}>CRITICAL WARNINGS</Typography.SubHeader>
                        </View>
                        <View style={styles.warningContent}>
                          {content.warnings.map((warn, idx) => (
                            <View key={idx} style={styles.warningItem}>
                              <View style={styles.warningBullet} />
                              <Typography.Body style={styles.warningText}>{warn}</Typography.Body>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
              
              {sIndex < disaster.sections.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
        <View style={{height: 60}} />
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
  headerTextContainer: { flex: 1 },
  headerPreTitle: { color: theme.colors.text.muted, marginBottom: 2, fontSize: 11, letterSpacing: 1, fontWeight: '700' },
  headerTitle: { fontSize: 24, color: theme.colors.text.primary, marginBottom: 0 },
  headerIcon: { opacity: 0.12, position: 'absolute', right: 24, top: Constants.statusBarHeight + 12 },
  scroll: { padding: 24 },
  sectionContainer: { marginBottom: 16 },
  sectionHeader: { marginBottom: 20 },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  phaseText: { fontWeight: '800', letterSpacing: 0.5, fontSize: 12 },
  sectionTitle: { fontSize: 22, color: theme.colors.text.primary, letterSpacing: -0.2 },
  contentGroup: { marginBottom: 24 },
  contentSummary: { color: theme.colors.text.secondary, fontSize: 16, lineHeight: 24, marginBottom: 16 },
  stepsContainer: { paddingLeft: 4 },
  stepItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start', paddingRight: 8 },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surfaceHighlightDark || '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  stepNumberText: { color: theme.colors.text.secondary, fontWeight: '700', fontSize: 13 },
  stepText: { flex: 1, color: theme.colors.text.primary, fontSize: 15, lineHeight: 24 },
  warningsContainer: {
    marginTop: 20,
    backgroundColor: theme.colors.dangerLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5', 
    overflow: 'hidden',
  },
  warningHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  warningTitle: { color: theme.colors.danger, fontWeight: '800', marginLeft: 8, fontSize: 14, letterSpacing: 0.5 },
  warningContent: { padding: 16, paddingTop: 14, gap: 12 },
  warningItem: { flexDirection: 'row', alignItems: 'flex-start' },
  warningBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.danger,
    marginTop: 8,
    marginRight: 12,
  },
  warningText: { flex: 1, color: '#991B1B', fontSize: 14, lineHeight: 21, fontWeight: '500' },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: 24,
    width: '100%',
  },
});
