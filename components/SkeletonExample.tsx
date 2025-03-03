import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { Skeleton, TextSkeleton, ListItemSkeleton, CardSkeleton } from './SkeletonUI';

/**
 * Example component demonstrating various skeleton UI patterns
 * This can be used as a reference for implementing skeletons in your app
 */
export default function SkeletonExample() {
  const { colors } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Basic Skeleton
      </Text>
      <View style={styles.demoSection}>
        <Skeleton width={100} height={20} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Text Skeleton
      </Text>
      <View style={styles.demoSection}>
        <TextSkeleton lines={3} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        List Item Skeletons
      </Text>
      <View style={[styles.demoSection, { backgroundColor: colors.surface }]}>
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Card Skeletons
      </Text>
      <View style={styles.demoSection}>
        <CardSkeleton />
        <CardSkeleton lines={2} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Profile Skeleton
      </Text>
      <View style={[styles.demoSection, styles.profileSection, { backgroundColor: colors.surface }]}>
        <Skeleton 
          width={80} 
          height={80} 
          borderRadius={40} 
        />
        <View style={styles.profileInfo}>
          <TextSkeleton lines={2} spacing={12} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Custom Skeleton Layout
      </Text>
      <View style={[styles.demoSection, { backgroundColor: colors.surface, padding: 16 }]}>
        {/* Header */}
        <View style={styles.customHeader}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={styles.headerText}>
            <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
            <Skeleton width={80} height={12} />
          </View>
        </View>
        
        {/* Content */}
        <Skeleton width="100%" height={200} style={{ marginVertical: 16 }} />
        
        {/* Footer */}
        <View style={styles.customFooter}>
          <Skeleton width={80} height={32} borderRadius={16} />
          <Skeleton width={80} height={32} borderRadius={16} />
          <Skeleton width={80} height={32} borderRadius={16} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  demoSection: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  customFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}); 