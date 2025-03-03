import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Moon, Sun, Smartphone } from 'lucide-react-native';
import useTheme from '@/hooks/useTheme';
import { ThemePreference } from '@/store/themeStore';
import { useColorScheme } from 'react-native';

interface ThemeOptionProps {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}

const ThemeOption = ({ label, icon, isSelected, onPress }: ThemeOptionProps) => {
  const { colors, brand } = useTheme();
  
  return (
    <Pressable
      style={[
        styles.themeOption,
        {
          backgroundColor: isSelected ? colors.surfaceVariant : colors.surface,
          borderColor: isSelected ? brand.primary : colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.themeOptionContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text
          style={[
            styles.themeOptionLabel,
            { color: colors.text.primary },
          ]}
        >
          {label}
        </Text>
      </View>
      
      {isSelected && (
        <View
          style={[
            styles.selectedIndicator,
            { backgroundColor: brand.primary },
          ]}
        />
      )}
    </Pressable>
  );
};

export default function ThemeSettings() {
  const { preference, setThemePreference, colors, isDarkMode, brand } = useTheme();
  const systemColorScheme = useColorScheme();
  
  const handleThemeChange = (newPreference: ThemePreference) => {
    setThemePreference(newPreference);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Appearance
      </Text>
      
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Choose how Lystly looks to you. Select a theme preference below.
      </Text>
      
      <View style={styles.optionsContainer}>
        <ThemeOption
          label="System"
          icon={
            <Smartphone
              size={24}
              color={preference === 'system' ? brand.primary : colors.icon.primary}
            />
          }
          isSelected={preference === 'system'}
          onPress={() => handleThemeChange('system')}
        />
        
        <ThemeOption
          label="Light"
          icon={
            <Sun
              size={24}
              color={preference === 'light' ? brand.primary : colors.icon.primary}
            />
          }
          isSelected={preference === 'light'}
          onPress={() => handleThemeChange('light')}
        />
        
        <ThemeOption
          label="Dark"
          icon={
            <Moon
              size={24}
              color={preference === 'dark' ? brand.primary : colors.icon.primary}
            />
          }
          isSelected={preference === 'dark'}
          onPress={() => handleThemeChange('dark')}
        />
      </View>
      
      <Text style={[styles.note, { color: colors.text.tertiary }]}>
        {preference === 'system'
          ? `Currently using ${systemColorScheme === 'dark' ? 'dark' : 'light'} theme based on your system settings.`
          : `You've selected ${preference} theme. This will override your system settings.`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  themeOption: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  themeOptionContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomLeftRadius: 12,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
}); 