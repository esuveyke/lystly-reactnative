import React, { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
}

export default function PullToRefresh({ onRefresh }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode } = useThemeStore();
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);
  
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={isDarkMode ? '#FFFFFF' : '#007AFF'}
      colors={['#007AFF']}
      progressBackgroundColor={isDarkMode ? '#1C1C1E' : '#FFFFFF'}
    />
  );
}