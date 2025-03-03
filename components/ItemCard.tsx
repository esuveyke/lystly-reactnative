import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Link2, FileText, ExternalLink, Bookmark } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';
import { Item } from '@/types/item';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  showSavedIcon?: boolean;
}

export default function ItemCard({ item, onPress, showSavedIcon = false }: ItemCardProps) {
  const { isDarkMode } = useThemeStore();
  const scale = useSharedValue(1);
  
  const getItemIcon = (type: 'link' | 'note') => {
    switch (type) {
      case 'link':
        return <Link2 size={20} color="#007AFF" />;
      case 'note':
        return <FileText size={20} color="#FF9500" />;
      default:
        return <Link2 size={20} color="#007AFF" />;
    }
  };
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyles}>
      <Pressable
        style={[styles.itemCard, isDarkMode && styles.itemCardDark]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.itemHeader}>
          <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
            {getItemIcon(item.type)}
          </View>
          <Text style={[styles.itemTitle, isDarkMode && styles.textDark]} numberOfLines={1}>
            {item.title}
          </Text>
          {showSavedIcon && item.isSaved && (
            <Bookmark size={20} color="#007AFF" fill="#007AFF" />
          )}
        </View>
        
        {item.type === 'link' && (
          <View style={styles.linkPreview}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.previewImage} />
            ) : (
              <View style={[styles.noPreview, isDarkMode && styles.noPreviewDark]}>
                <ExternalLink size={24} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} />
              </View>
            )}
            <Text style={[styles.linkUrl, isDarkMode && styles.linkUrlDark]} numberOfLines={1}>
              {item.url}
            </Text>
          </View>
        )}
        
        {item.type === 'note' && (
          <Text style={[styles.notePreview, isDarkMode && styles.notePreviewDark]} numberOfLines={2}>
            {item.content}
          </Text>
        )}
        
        <View style={styles.itemFooter}>
          <Text style={[styles.dateText, isDarkMode && styles.dateTextDark]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.isShared && (
            <View style={styles.sharedBadge}>
              <Text style={styles.sharedText}>Shared</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemCardDark: {
    backgroundColor: '#2C2C2E',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDark: {
    backgroundColor: '#3A3A3C',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  textDark: {
    color: '#FFFFFF',
  },
  linkPreview: {
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  noPreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  noPreviewDark: {
    backgroundColor: '#3A3A3C',
  },
  linkUrl: {
    fontSize: 14,
    color: '#8E8E93',
  },
  linkUrlDark: {
    color: '#A0A0A5',
  },
  notePreview: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 12,
    lineHeight: 20,
  },
  notePreviewDark: {
    color: '#EBEBF5',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  dateTextDark: {
    color: '#A0A0A5',
  },
  sharedBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sharedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});