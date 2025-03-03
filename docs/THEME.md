# Lystly Theme System

This document outlines the theme system used in the Lystly app, including how to use it and how to extend it.

## Overview

Lystly uses a comprehensive theme system that supports:

- Light and dark mode
- System theme preference
- User theme preference
- Persistent theme settings
- Consistent color palette across the app

## Theme Structure

The theme system consists of several key components:

### 1. Color Constants (`constants/colors.ts`)

This file defines all the colors used in the app, organized by:

- Brand colors
- Light mode colors
- Dark mode colors
- Shadows for both modes

### 2. Theme Store (`store/themeStore.ts`)

A Zustand store that manages:

- Current theme state (light/dark)
- User preference (system/light/dark)
- Theme toggling and switching
- System theme synchronization

### 3. Theme Hook (`hooks/useTheme.ts`)

A custom hook that provides:

- Easy access to current theme colors
- Theme state and actions
- Helper functions for getting specific colors

### 4. Theme Settings Component (`components/ThemeSettings.tsx`)

A UI component that allows users to:

- Switch between system, light, and dark themes
- See their current theme preference
- Get visual feedback on the selected theme

## Usage

### Basic Usage

```tsx
import useTheme from '@/hooks/useTheme';

function MyComponent() {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
}
```

### Accessing Specific Colors

```tsx
import useTheme from '@/hooks/useTheme';

function MyComponent() {
  const { getTextColor, getButtonColor, getColor } = useTheme();
  
  return (
    <View style={{ backgroundColor: getColor('background') }}>
      <Text style={{ color: getTextColor('primary') }}>
        Hello World
      </Text>
      <Button 
        color={getButtonColor('primary')}
        title="Click Me"
      />
    </View>
  );
}
```

### Changing Theme

```tsx
import useTheme from '@/hooks/useTheme';

function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme();
  
  return (
    <Button
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      onPress={toggleTheme}
    />
  );
}
```

### Setting Theme Preference

```tsx
import useTheme from '@/hooks/useTheme';

function ThemeSelector() {
  const { setThemePreference, preference } = useTheme();
  
  return (
    <View>
      <Button
        title="System"
        onPress={() => setThemePreference('system')}
        disabled={preference === 'system'}
      />
      <Button
        title="Light"
        onPress={() => setThemePreference('light')}
        disabled={preference === 'light'}
      />
      <Button
        title="Dark"
        onPress={() => setThemePreference('dark')}
        disabled={preference === 'dark'}
      />
    </View>
  );
}
```

## System Theme Handling

The theme system is designed to properly handle system theme changes:

1. When the user selects "System" theme, the app will immediately adopt the current system theme.
2. If the system theme changes while the app is running, the app will automatically update to match.
3. When switching from a manual theme (light/dark) to system theme, the app will immediately adopt the system theme.

### Implementation Details

- The `useSystemTheme` function in the theme store sets the preference to 'system' but doesn't directly access the system theme.
- The `useSystemThemeSync` hook monitors system theme changes and updates the app theme when needed.
- The `setThemePreference` function in the `useTheme` hook ensures immediate theme updates when switching to system theme.

## Extending the Theme

### Adding New Colors

To add new colors to the theme:

1. Add the color to both light and dark objects in `constants/colors.ts`
2. Update the `ThemeColorKey` type to include your new color
3. Use the color in your components via `useTheme()`

### Adding New Color Categories

To add a new category of colors (e.g., for a specific component):

1. Add the new category to both light and dark objects in `constants/colors.ts`
2. Add a getter function in `useTheme()` if needed
3. Use the new category in your components

## Best Practices

1. **Always use theme colors** instead of hardcoded values
2. **Use semantic color names** (e.g., `primary`, `error`) rather than visual names (e.g., `red`, `blue`)
3. **Test both themes** to ensure good contrast and readability
4. **Consider accessibility** when choosing colors
5. **Use the theme hook** rather than accessing the store directly 