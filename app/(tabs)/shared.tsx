import React, { useState, useCallback, useEffect } from 'react';
import { Users } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import ItemCard from '@/components/ItemCard';
import TabScreen from '@/components/TabScreen';
import CreateItemSheet from '@/components/CreateItemSheet';
import { Item } from '@/types/item';

export default function SharedScreen() {
  const { items, fetchItems } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const sharedWithMe = items.filter(item => item.sharedWithMe) as Item[];
  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);

  // Debug log to check items
  useEffect(() => {
    console.log('SharedScreen items:', sharedWithMe.length, sharedWithMe);
  }, [sharedWithMe]);

  const handleRefresh = useCallback(async () => {
    console.log('Shared screen refresh triggered');
    await fetchItems();
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

  return (
    <>
      <TabScreen
        items={sharedWithMe}
        renderItem={renderItem}
        emptyStateIcon={<Users size={48} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} />}
        emptyStateTitle="Nothing shared with you yet"
        emptyStateDescription="When friends share links, notes, or images with you, they'll appear here"
        showAddButton={false}
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