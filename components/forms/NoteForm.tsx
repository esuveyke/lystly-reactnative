import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface NoteFormProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
}

export default function NoteForm({ title, setTitle, content, setContent }: NoteFormProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>Title</Text>
        <View style={[styles.inputContainer, isDarkMode && styles.inputContainerDark]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a title"
            placeholderTextColor={isDarkMode ? '#A0A0A5' : '#8E8E93'}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>Content</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer, isDarkMode && styles.inputContainerDark]}>
          <TextInput
            style={[styles.input, styles.textArea, isDarkMode && styles.inputDark]}
            value={content}
            onChangeText={setContent}
            placeholder="Enter your note here"
            placeholderTextColor={isDarkMode ? '#A0A0A5' : '#8E8E93'}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000000',
  },
  labelDark: {
    color: '#FFFFFF',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  inputContainerDark: {
    borderColor: '#3A3A3C',
    backgroundColor: '#2C2C2E',
  },
  textAreaContainer: {
    height: 120,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    height: 48,
    width: '100%',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});