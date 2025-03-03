import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
}

export default function LoadingIndicator({ size = 'large' }: LoadingIndicatorProps) {
  return (
    <View style={[styles.container, size === 'small' ? styles.small : styles.large]}>
      <ActivityIndicator 
        size={size} 
        color="#007AFF" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    width: 40,
    height: 40,
  },
  large: {
    width: 100,
    height: 100,
  },
});