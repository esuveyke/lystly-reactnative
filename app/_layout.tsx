import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useColorScheme, Platform } from 'react-native';
import { useThemeStore, useSystemThemeSync } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useItemStore } from '@/store/itemStore';
import SplashScreen from '@/components/SplashScreen';
import * as SplashScreenModule from 'expo-splash-screen';
import useTheme from '@/hooks/useTheme';

// Keep the splash screen visible while we fetch resources
SplashScreenModule.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { updateThemeFromSystem, theme, preference } = useThemeStore();
  const { initialize, initialized, user } = useAuthStore();
  const { fetchItems } = useItemStore();
  const [appIsReady, setAppIsReady] = useState(false);
  const { colors } = useTheme();
  
  // Sync with system theme changes
  useSystemThemeSync();

  // Load resources and initialize app
  useEffect(() => {
    async function prepare() {
      try {
        // Initialize theme based on system preference
        if (colorScheme && preference === 'system') {
          updateThemeFromSystem(colorScheme);
        }

        // Skip initialization during server-side rendering
        if (isBrowser) {
          console.log('Initializing auth state from root layout');
          await initialize();
        }

        // Artificially delay for a smoother splash screen experience
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, [colorScheme, updateThemeFromSystem, initialize, preference]);

  // Callback for when splash screen animation finishes
  const onSplashScreenFinish = useCallback(() => {
    if (isBrowser && window.frameworkReady) {
      window.frameworkReady();
    }
  }, []);

  // Fetch items when user is authenticated
  useEffect(() => {
    if (user && isBrowser && appIsReady) {
      console.log('User authenticated, fetching items from root layout. User ID:', user.id, 'Email:', user.email);
      fetchItems().then(() => {
        console.log('Initial items fetch completed from root layout');
      }).catch(error => {
        console.error('Error in initial items fetch from root layout:', error);
      });
    } else if (appIsReady) {
      console.log('No user in root layout, skipping items fetch');
    }
  }, [user, fetchItems, appIsReady]);

  // Add a debug log for web platform
  useEffect(() => {
    if (Platform.OS === 'web' && isBrowser && appIsReady) {
      console.log('Running on web platform, user state:', user ? `Authenticated as ${user.email}` : 'Not authenticated');
    }
  }, [user, appIsReady]);

  // Determine the initial route based on authentication status
  const initialRoute = user ? '(tabs)' : '(auth)';

  // Show splash screen while initializing
  if (!appIsReady) {
    return <SplashScreen onFinish={onSplashScreenFinish} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            title: 'Lystly'
          }}
        >
          <Stack.Screen name={initialRoute} options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});