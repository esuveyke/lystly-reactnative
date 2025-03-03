import React, { useState, useCallback, useEffect } from 'react';
import { Bookmark } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import ItemCard from '@/components/ItemCard';
import TabScreen from '@/components/TabScreen';
import CreateItemSheet from '@/components/CreateItemSheet';
import { Item } from '@/types/item';

export default function SavedScreen() {
  const { items, fetchItems } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const savedItems = items.filter(item => item.isSaved) as Item[];
  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);

  // Debug log to check items
  useEffect(() => {
    console.log('SavedScreen items:', savedItems.length, savedItems);
  }, [savedItems]);

  const handleRefresh = useCallback(async () => {
    console.log('Saved screen refresh triggered');
    await fetchItems();
  }, [fetchItems]);

  const renderItem = ({ item, onPress }) => (
    <Animated.View
      entering={FadeIn.duration(300).delay(100)}
    >
      <ItemCard 
        item={item} 
        onPress={() => onPress(item.id)}
        showSavedIcon={true}
      />
    </Animated.View>
  );

  return (
    <>
      <TabScreen
        items={savedItems}
        renderItem={renderItem}
        emptyStateIcon={<Bookmark size={48} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} />}
        emptyStateTitle="No saved items yet"
        emptyStateDescription="Bookmark items you want to keep for quick access"
        showAddButton={true}
        onAddPress={() => setIsCreateSheetVisible(true)}
        onRefresh={handleRefresh}
      />
      
      <CreateItemSheet 
        isVisible={isCreateSheetVisible}
        onClose={() => setIsCreateSheetVisible(false)}
      />
    </>
  );
}