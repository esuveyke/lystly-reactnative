import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, Platform, Image } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import * as SplashScreenModule from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreenModule.preventAutoHideAsync();

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { theme } = useThemeStore();
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Hide the native splash screen after a short delay
    const hideSplash = async () => {
      try {
        await SplashScreenModule.hideAsync();
      } catch (e) {
        // Ignore errors
        console.log('Error hiding splash screen:', e);
      }
    };
    
    // Start hiding the native splash screen
    hideSplash();
    
    // Start animations
    Animated.sequence([
      // First fade in the logo
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Then scale up the logo
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Wait a bit
      Animated.delay(1500),
      // Fade out everything
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Notify parent that animation is done
      onFinish();
    });
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Use the splash.png image */}
        <Image 
          source={require('../assets/images/splash.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: '#c9d526', // Lime green background from logo
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    maxWidth: 500,
  },
  logoImage: {
    width: width * 0.8,
    height: width * 0.5,
    maxWidth: 500,
    maxHeight: 312,
  },
}); 