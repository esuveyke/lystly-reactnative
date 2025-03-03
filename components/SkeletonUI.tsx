import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useTheme from '@/hooks/useTheme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  shimmerEnabled?: boolean;
}

/**
 * A skeleton placeholder component that adapts to the current theme
 * with appropriate contrast levels for both light and dark modes.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  shimmerEnabled = true,
}) => {
  const { colors, isDarkMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  // Calculate appropriate colors based on the theme
  const baseColor = isDarkMode 
    ? 'rgba(255, 255, 255, 0.05)' // Reduced from 0.08 to 0.05 for dark mode
    : 'rgba(0, 0, 0, 0.08)'; // Very subtle dark color in light mode
    
  const highlightColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.08)' // Reduced from 0.14 to 0.08 for dark mode
    : 'rgba(0, 0, 0, 0.14)'; // Slightly darker for shimmer in light mode

  useEffect(() => {
    if (shimmerEnabled) {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [shimmerEnabled]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {shimmerEnabled && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateX }] },
          ]}
        >
          <LinearGradient
            colors={[
              'transparent',
              highlightColor,
              'transparent',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
};

/**
 * A skeleton placeholder for text content with multiple lines
 */
export const TextSkeleton: React.FC<{
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  style?: ViewStyle;
  lastLineWidth?: DimensionValue;
  shimmerEnabled?: boolean;
}> = ({
  lines = 3,
  lineHeight = 16,
  spacing = 8,
  style,
  lastLineWidth = '70%',
  shimmerEnabled = true,
}) => {
  return (
    <View style={[styles.textContainer, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          style={{ marginBottom: index === lines - 1 ? 0 : spacing }}
          shimmerEnabled={shimmerEnabled}
        />
      ))}
    </View>
  );
};

/**
 * A skeleton placeholder for a list item with an image and text
 */
export const ListItemSkeleton: React.FC<{
  imageSize?: number;
  imageShape?: 'square' | 'circle';
  lines?: number;
  style?: ViewStyle;
  shimmerEnabled?: boolean;
}> = ({
  imageSize = 60,
  imageShape = 'square',
  lines = 2,
  style,
  shimmerEnabled = true,
}) => {
  return (
    <View style={[styles.listItemContainer, style]}>
      <Skeleton
        width={imageSize}
        height={imageSize}
        borderRadius={imageShape === 'circle' ? imageSize / 2 : 8}
        shimmerEnabled={shimmerEnabled}
      />
      <View style={styles.listItemContent}>
        <TextSkeleton
          lines={lines}
          shimmerEnabled={shimmerEnabled}
        />
      </View>
    </View>
  );
};

/**
 * A skeleton placeholder for a card with an image and text
 */
export const CardSkeleton: React.FC<{
  imageHeight?: number;
  lines?: number;
  style?: ViewStyle;
  shimmerEnabled?: boolean;
}> = ({
  imageHeight = 120,
  lines = 2,
  style,
  shimmerEnabled = true,
}) => {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <View style={[
      styles.cardContainer, 
      { 
        backgroundColor: isDarkMode ? colors.surface : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      style
    ]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Skeleton
          width={32}
          height={32}
          borderRadius={16}
          shimmerEnabled={shimmerEnabled}
        />
        <Skeleton
          width="70%"
          height={18}
          style={{ marginLeft: 12 }}
          shimmerEnabled={shimmerEnabled}
        />
      </View>
      
      {/* Content */}
      <Skeleton
        height={imageHeight}
        borderRadius={8}
        style={{ marginBottom: 12 }}
        shimmerEnabled={shimmerEnabled}
      />
      
      {/* Footer */}
      <View style={styles.cardFooter}>
        <Skeleton
          width={80}
          height={12}
          shimmerEnabled={shimmerEnabled}
        />
        <Skeleton
          width={60}
          height={20}
          borderRadius={10}
          shimmerEnabled={shimmerEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    width: '100%',
  },
  listItemContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    padding: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default {
  Skeleton,
  TextSkeleton,
  ListItemSkeleton,
  CardSkeleton,
}; 