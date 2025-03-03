import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Bookmark, Share2, Settings, Plus, RefreshCw } from 'lucide-react-native';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import CreateItemSheet from '@/components/CreateItemSheet';
import { useItemStore } from '@/store/itemStore';

export default function TabLayout() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { fetchItems } = useItemStore();
  const [isCreateSheetVisible, setIsCreateSheetVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddPress = () => {
    setIsCreateSheetVisible(true);
  };

  const handleRefreshPress = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await fetchItems();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: isDarkMode ? '#CCCCCC' : '#666666',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
            height: Platform.OS === 'ios' ? 85 : 70,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          },
          tabBarItemStyle: {
            height: 50,
            paddingVertical: 4,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 2,
            marginBottom: 0,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
          },
          headerTitleStyle: {
            color: isDarkMode ? '#FFFFFF' : '#000000',
          },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            headerTitle: 'My Collection',
            headerRight: () => (
              <View style={styles.headerButtonsContainer}>
                <Pressable 
                  style={styles.headerButton} 
                  onPress={handleRefreshPress}
                >
                  <RefreshCw 
                    color={isDarkMode ? '#FFFFFF' : '#007AFF'} 
                    size={24} 
                    style={isRefreshing ? styles.rotating : undefined}
                  />
                </Pressable>
                <Pressable 
                  style={styles.headerButton} 
                  onPress={handleAddPress}
                >
                  <Plus color={isDarkMode ? '#FFFFFF' : '#007AFF'} size={24} />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} />,
            headerTitle: 'Saved Items',
            headerRight: () => (
              <View style={styles.headerButtonsContainer}>
                <Pressable 
                  style={styles.headerButton} 
                  onPress={handleRefreshPress}
                >
                  <RefreshCw 
                    color={isDarkMode ? '#FFFFFF' : '#007AFF'} 
                    size={24} 
                    style={isRefreshing ? styles.rotating : undefined}
                  />
                </Pressable>
                <Pressable 
                  style={styles.headerButton} 
                  onPress={handleAddPress}
                >
                  <Plus color={isDarkMode ? '#FFFFFF' : '#007AFF'} size={24} />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="shared"
          options={{
            title: 'Shared',
            tabBarIcon: ({ color, size }) => <Share2 color={color} size={size} />,
            headerTitle: 'Shared With Me',
            headerRight: () => (
              <View style={styles.headerButtonsContainer}>
                <Pressable 
                  style={styles.headerButton} 
                  onPress={handleRefreshPress}
                >
                  <RefreshCw 
                    color={isDarkMode ? '#FFFFFF' : '#007AFF'} 
                    size={24} 
                    style={isRefreshing ? styles.rotating : undefined}
                  />
                </Pressable>
                <Pressable 
                  style={styles.headerButton} 
                  onPress={handleAddPress}
                >
                  <Plus color={isDarkMode ? '#FFFFFF' : '#007AFF'} size={24} />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
            headerTitle: 'Settings',
          }}
        />
      </Tabs>

      <CreateItemSheet 
        isVisible={isCreateSheetVisible}
        onClose={() => setIsCreateSheetVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerButtonsContainer: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 12,
    marginRight: 8,
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
});