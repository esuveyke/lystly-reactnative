import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Link2, FileText, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import LinkForm from '@/components/forms/LinkForm';
import NoteForm from '@/components/forms/NoteForm';
import { Item } from '@/types/item';

interface CreateItemSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function CreateItemSheet({ isVisible, onClose }: CreateItemSheetProps) {
  const { createItem } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Form state
  const [itemType, setItemType] = useState<'link' | 'note'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up the snap points (90% of screen height)
  const snapPoints = useMemo(() => ['90%'], []);
  
  // Callbacks for sheet actions
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
      
      // Reset form state after closing
      setTimeout(() => {
        setItemType('link');
        setTitle('');
        setUrl('');
        setContent('');
        setIsSubmitting(false);
      }, 300);
    }
  }, [onClose]);
  
  // Control the sheet visibility
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);
  
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );
  
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (itemType === 'link' && !url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    if (itemType === 'note' && !content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    setIsSubmitting(true);

    const newItem: Partial<Item> = {
      type: itemType,
      title: title.trim(),
      isSaved: false,
      isShared: false,
      sharedWithMe: false,
    };

    if (itemType === 'link') {
      (newItem as any).url = url.trim();
    } else if (itemType === 'note') {
      (newItem as any).content = content.trim();
    }

    try {
      await createItem(newItem as Omit<Item, 'id' | 'createdAt'>);
      onClose();
    } catch (error) {
      console.error('Error creating item:', error);
      Alert.alert('Error', 'Failed to create item');
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: isDarkMode ? '#8E8E93' : '#C7C7CC' }}
      backgroundStyle={{ backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }}
    >
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>Add New Item</Text>
        <Pressable 
          onPress={handleSave} 
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </Pressable>
      </View>
      
      <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.typeSelectorContainer}>
          <View style={[styles.typeSelector, isDarkMode && styles.typeSelectorDark]}>
            <Pressable
              style={[
                styles.typeButton,
                itemType === 'link' && styles.selectedTypeButton,
              ]}
              onPress={() => setItemType('link')}
            >
              <Link2
                size={20}
                color={itemType === 'link' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#007AFF'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  isDarkMode && styles.typeButtonTextDark,
                  itemType === 'link' && styles.selectedTypeButtonText,
                ]}
              >
                Link
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.typeButton,
                itemType === 'note' && styles.selectedTypeButton,
              ]}
              onPress={() => setItemType('note')}
            >
              <FileText
                size={20}
                color={itemType === 'note' ? '#FFFFFF' : isDarkMode ? '#FFFFFF' : '#FF9500'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  isDarkMode && styles.typeButtonTextDark,
                  itemType === 'note' && styles.selectedTypeButtonText,
                ]}
              >
                Note
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.formContainer}>
          {itemType === 'link' ? (
            <LinkForm
              title={title}
              setTitle={setTitle}
              url={url}
              setUrl={setUrl}
            />
          ) : (
            <NoteForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
            />
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerDark: {
    borderBottomColor: '#3A3A3C',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  textDark: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0A0A5',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeSelectorContainer: {
    marginBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  typeSelectorDark: {
    borderColor: '#3A3A3C',
    backgroundColor: '#2C2C2E',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  selectedTypeButton: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  typeButtonTextDark: {
    color: '#FFFFFF',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
  }
});