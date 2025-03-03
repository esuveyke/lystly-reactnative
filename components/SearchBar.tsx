import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search your collection..." 
}: SearchBarProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
      <Search size={20} color={isDarkMode ? '#A0A0A5' : '#8E8E93'} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#A0A0A5' : '#8E8E93'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
});