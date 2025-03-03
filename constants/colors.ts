// Brand colors
const brand = {
  primary: '#c9d526', // Lime green
  primaryDark: '#d4de4b', // Slightly lighter lime for dark mode
  secondary: '#007AFF', // Blue
  secondaryDark: '#0A84FF', // Brighter blue for dark mode
  accent: '#FF9500', // Orange
  accentDark: '#FF9F0A', // Brighter orange for dark mode
};

// Neutral colors
const light = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  surfaceVariant: '#E5E5EA',
  border: '#E5E5EA',
  divider: '#D1D1D6',
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  icon: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  button: {
    primary: brand.primary,
    secondary: brand.secondary,
    disabled: '#A0A0A5',
    danger: '#FF3B30',
  },
  input: {
    background: '#FFFFFF',
    border: '#E5E5EA',
    placeholder: '#8E8E93',
  },
  success: '#34C759',
  warning: '#FFCC00',
  error: '#FF3B30',
  info: '#5AC8FA',
};

// Dark mode colors with improved contrast
const dark = {
  background: '#121212', // Darker than before for better contrast
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  border: '#3A3A3C',
  divider: '#38383A',
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#EBEBF599', // With opacity
    disabled: '#EBEBF54D', // With opacity
    inverse: '#000000',
  },
  icon: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#EBEBF599', // With opacity
    disabled: '#EBEBF54D', // With opacity
    inverse: '#000000',
  },
  button: {
    primary: brand.primaryDark,
    secondary: brand.secondaryDark,
    disabled: '#636366',
    danger: '#FF453A',
  },
  input: {
    background: '#2C2C2E',
    border: '#3A3A3C',
    placeholder: '#A0A0A5',
  },
  success: '#30D158',
  warning: '#FFD60A',
  error: '#FF453A',
  info: '#64D2FF',
};

// Elevation shadows for light mode
const lightShadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Elevation shadows for dark mode (slightly more subtle)
const darkShadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Define theme color keys for type safety
export type ThemeColorKey = 
  | 'background' 
  | 'surface' 
  | 'surfaceVariant' 
  | 'border' 
  | 'divider'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

// Export the theme object
export const colors = {
  brand,
  light: {
    ...light,
    shadows: lightShadows,
  },
  dark: {
    ...dark,
    shadows: darkShadows,
  },
};

// Helper function to get the current theme colors
export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? colors.dark : colors.light;
};

// Export individual color getters for convenience
export const getColor = (colorName: ThemeColorKey, isDarkMode: boolean) => {
  const theme = getThemeColors(isDarkMode);
  return theme[colorName];
};

export const getTextColor = (variant: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse', isDarkMode: boolean) => {
  const theme = getThemeColors(isDarkMode);
  return theme.text[variant];
};

export const getButtonColor = (variant: 'primary' | 'secondary' | 'disabled' | 'danger', isDarkMode: boolean) => {
  const theme = getThemeColors(isDarkMode);
  return theme.button[variant];
};

export default colors; 