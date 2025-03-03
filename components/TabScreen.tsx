import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Platform, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { Layout } from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import ItemDetailSheet from '@/components/ItemDetailSheet';
import EmptyState from '@/components/EmptyState';
import PullToRefresh from '@/components/PullToRefresh';
import { CardSkeleton } from '@/components/SkeletonUI';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface TabScreenProps {
  items: any[];
  renderItem: ({ item, onPress }) => React.ReactNode;
  emptyStateIcon: React.ReactNode;
  emptyStateTitle: string;
  emptyStateDescription: string;
  showAddButton?: boolean;
  searchBar?: React.ReactNode;
  onAddPress?: () => void;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

export default function TabScreen({
  items,
  renderItem,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  showAddButton = true,
  searchBar,
  onAddPress,
  onRefresh,
  isRefreshing = false
}: TabScreenProps) {
  const { isDarkMode } = useThemeStore();
  const insets = useSafeAreaInsets();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Debug log to check items
  useEffect(() => {
    console.log('TabScreen items:', items.length, items, 'Platform:', Platform.OS);
  }, [items]);

  const handleItemPress = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsSheetVisible(true);
  };

  const handleCloseSheet = () => {
    setIsSheetVisible(false);
    setSelectedItemId(null);
  };
  
  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsLoading(true);
    
    if (onRefresh) {
      await onRefresh();
    } else {
      // Default refresh behavior if no custom handler provided
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsLoading(false);
  }, [onRefresh, isRefreshing]);
  
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <CardSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <SafeAreaView 
      style={[styles.container, isDarkMode && styles.containerDark]} 
      edges={['right', 'left']}
    >
      {searchBar}
      
      {isLoading ? (
        <View style={styles.listContainer}>
          {renderSkeletons()}
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon={emptyStateIcon}
          title={emptyStateTitle}
          description={emptyStateDescription}
          showAddButton={showAddButton}
          onAddPress={onAddPress}
          onRefresh={onRefresh ? handleRefresh : undefined}
        />
      ) : (
        <AnimatedFlatList
          data={items}
          renderItem={({ item }) => renderItem({ item, onPress: handleItemPress })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            ...styles.listContainer,
            paddingBottom: 100 + insets.bottom
          }}
          refreshControl={
            <PullToRefresh onRefresh={handleRefresh} />
          }
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS !== 'web'}
          layout={Layout.springify()}
          ListEmptyComponent={
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>No items to display</Text>
              <Text style={styles.debugText}>Items count: {items.length}</Text>
              <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
            </View>
          }
        />
      )}
      
      <ItemDetailSheet 
        itemId={selectedItemId}
        isVisible={isSheetVisible}
        onClose={handleCloseSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  listContainer: {
    padding: 16,
  },
  debugContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  debugText: {
    color: '#D32F2F',
    marginBottom: 8,
  },
});