import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useThemeStore } from '@/store/themeStore';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) {
  const { isDarkMode } = useThemeStore();
  const opacity = useSharedValue(0.3);
  
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
    };
  });
  
  return (
    <Animated.View
      style={[
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ItemCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width="70%" height={18} style={styles.titleSkeleton} />
      </View>
      <Skeleton width="100%" height={120} borderRadius={8} style={styles.contentSkeleton} />
      <View style={styles.footer}>
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleSkeleton: {
    marginLeft: 12,
  },
  contentSkeleton: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});