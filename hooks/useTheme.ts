import { useMemo } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { colors, getThemeColors, ThemeColorKey } from '@/constants/colors';
import { useColorScheme } from 'react-native';

/**
 * Custom hook to access theme colors and functions
 * 
 * Usage:
 * const { colors, isDarkMode, toggleTheme, setThemePreference } = useTheme();
 * 
 * // Access colors
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text.primary }}>Hello World</Text>
 * </View>
 */
export function useTheme() {
  const { 
    isDarkMode, 
    theme, 
    preference,
    toggleTheme,
    useSystemTheme,
    useLightTheme,
    useDarkTheme,
    updateThemeFromSystem
  } = useThemeStore();
  
  // Get the system color scheme
  const systemColorScheme = useColorScheme();

  // Memoize the theme colors to prevent unnecessary re-renders
  const themeColors = useMemo(() => {
    return getThemeColors(isDarkMode);
  }, [isDarkMode]);

  // Memoize the brand colors
  const brandColors = useMemo(() => {
    return colors.brand;
  }, []);

  // Helper function to set theme preference
  const setThemePreference = (pref: 'system' | 'light' | 'dark') => {
    switch (pref) {
      case 'system':
        useSystemTheme();
        // Immediately update the theme based on system preference
        if (systemColorScheme) {
          updateThemeFromSystem(systemColorScheme);
        }
        break;
      case 'light':
        useLightTheme();
        break;
      case 'dark':
        useDarkTheme();
        break;
    }
  };

  return {
    // Theme state
    isDarkMode,
    theme,
    preference,
    
    // Theme colors
    colors: themeColors,
    brand: brandColors,
    
    // Theme actions
    toggleTheme,
    setThemePreference,
    
    // Convenience getters
    getColor: (key: ThemeColorKey) => themeColors[key],
    getTextColor: (variant: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse') => 
      themeColors.text[variant],
    getButtonColor: (variant: 'primary' | 'secondary' | 'disabled' | 'danger') => 
      themeColors.button[variant],
    getShadow: (size: 'small' | 'medium' | 'large') => 
      themeColors.shadows[size],
  };
}

export default useTheme; 