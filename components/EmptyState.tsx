import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Plus, RefreshCw } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  showAddButton?: boolean;
  onAddPress?: () => void;
  onRefresh?: () => void;
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  showAddButton = true,
  onAddPress,
  onRefresh
}: EmptyStateProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500&auto=format&fit=crop' }} 
          style={styles.emptyStateImage} 
          resizeMode="contain"
        />
      </View>
      
      <Text style={[styles.title, isDarkMode && styles.titleDark]}>
        {title}
      </Text>
      
      <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
        {description}
      </Text>
      
      <View style={styles.buttonContainer}>
        {onRefresh && (
          <Pressable 
            style={[styles.button, styles.refreshButton]}
            onPress={onRefresh}
          >
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Refresh</Text>
          </Pressable>
        )}
        
        {showAddButton && (
          <Pressable 
            style={[styles.button, styles.addButton]}
            onPress={onAddPress}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Add New Item</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3C3C43',
    textAlign: 'center',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  descriptionDark: {
    color: '#A0A0A5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  refreshButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});