import { create } from 'zustand';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

// Define theme types
export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  // The user's preference (system, light, or dark)
  preference: ThemePreference;
  
  // The actual theme being used (light or dark)
  theme: ColorSchemeName;
  
  // Convenience boolean for dark mode
  isDarkMode: boolean;
}

interface ThemeActions {
  // Set theme to system preference
  useSystemTheme: () => void;
  
  // Set theme to light mode
  useLightTheme: () => void;
  
  // Set theme to dark mode
  useDarkTheme: () => void;
  
  // Toggle between light and dark (ignores system)
  toggleTheme: () => void;
  
  // Update the actual theme based on system changes
  updateThemeFromSystem: (systemTheme: ColorSchemeName) => void;
  
  // Set theme directly (used internally)
  setTheme: (theme: ColorSchemeName) => void;
}

// Combine state and actions
interface ThemeStore extends ThemeState, ThemeActions {}

// Create the store with persistence
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      preference: 'system',
      theme: 'light',
      isDarkMode: false,
      
      // Actions
      useSystemTheme: () => {
        // Don't try to get the system theme here
        // Just set the preference to 'system'
        set({ 
          preference: 'system',
        });
        
        // The actual theme will be updated by the useSystemThemeSync hook
      },
      
      useLightTheme: () => {
        set({ 
          preference: 'light',
          theme: 'light',
          isDarkMode: false
        });
      },
      
      useDarkTheme: () => {
        set({ 
          preference: 'dark',
          theme: 'dark',
          isDarkMode: true
        });
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        set({ 
          preference: newTheme as ThemePreference,
          theme: newTheme,
          isDarkMode: newTheme === 'dark'
        });
      },
      
      updateThemeFromSystem: (systemTheme) => {
        // Only update if the preference is set to system
        if (get().preference === 'system') {
          set({ 
            theme: systemTheme || 'light',
            isDarkMode: systemTheme === 'dark'
          });
        }
      },
      
      setTheme: (theme) => {
        set({ 
          theme,
          isDarkMode: theme === 'dark'
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to sync with system theme changes
export const useSystemThemeSync = () => {
  const systemTheme = useColorScheme();
  const { preference, updateThemeFromSystem } = useThemeStore();
  
  // Update the theme when system theme changes or when preference changes to 'system'
  React.useEffect(() => {
    if (preference === 'system') {
      updateThemeFromSystem(systemTheme);
    }
  }, [systemTheme, preference, updateThemeFromSystem]);
};