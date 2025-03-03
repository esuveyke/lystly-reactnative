import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { Link2, Plus, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import ItemCard from '@/components/ItemCard';
import TabScreen from '@/components/TabScreen';
import SearchBar from '@/components/SearchBar';
import CreateItemSheet from '@/components/CreateItemSheet';
import { Item } from '@/types/item';

export default function HomeScreen() {
  const { items, fetchItems, loading, error } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>(items as Item[]);
  const insets = useSafeAreaInsets();
  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug log to check items and auth state
  useEffect(() => {
    console.log('HomeScreen items:', items.length, 'User:', user?.id || 'Not authenticated', 'Platform:', Platform.OS);
  }, [items, user]);

  // Fetch items on component mount
  useEffect(() => {
    console.log('HomeScreen mounted, fetching items');
    fetchItems().then(() => {
      console.log('Items fetch completed in HomeScreen');
    }).catch(error => {
      console.error('Error fetching items in HomeScreen:', error);
    });
  }, [fetchItems]);

  // Update filtered items when search query or items change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items as Item[]);
    } else {
      const filtered = items.filter(
        item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.type === 'note' && item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase()))
      ) as Item[];
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const handleRefresh = useCallback(async () => {
    console.log('Manual refresh triggered');
    setIsRefreshing(true);
    try {
      await fetchItems();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchItems]);

  const renderItem = ({ item, onPress }) => (
    <Animated.View
      entering={FadeIn.duration(300).delay(100)}
    >
      <ItemCard 
        item={item} 
        onPress={() => onPress(item.id)} 
      />
    </Animated.View>
  );

  // Show error if there is one
  if (error) {
    return (
      <View style={[styles.errorContainer, isDarkMode && styles.errorContainerDark]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <TabScreen
        items={filteredItems}
        renderItem={renderItem}
        emptyStateIcon={<Link2 size={48} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} />}
        emptyStateTitle="Your collection is empty"
        emptyStateDescription="Start building your collection by adding your first link or note"
        showAddButton={true}
        searchBar={<SearchBar value={searchQuery} onChangeText={setSearchQuery} />}
        onAddPress={() => setIsCreateSheetVisible(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <Animated.View 
        style={[styles.fab, { bottom: 20 + insets.bottom }]}
        entering={FadeIn.duration(300).delay(300)}
      >
        <Pressable 
          style={styles.fabButton}
          onPress={() => setIsCreateSheetVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
      
      <CreateItemSheet 
        isVisible={isCreateSheetVisible}
        onClose={() => setIsCreateSheetVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});