import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import { Item, LinkItem, NoteItem } from '@/types/item';
import LinkForm from '@/components/forms/LinkForm';
import NoteForm from '@/components/forms/NoteForm';

interface EditItemSheetProps {
  itemId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function EditItemSheet({ itemId, isVisible, onClose }: EditItemSheetProps) {
  const { items, updateItem } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  
  // Find the item by ID
  const item = useMemo(() => {
    return items.find(i => i.id === itemId) as Item | undefined;
  }, [itemId, items]);
  
  // Set up the snap points (80% of screen height)
  const snapPoints = useMemo(() => ['80%'], []);
  
  // Initialize form with item data
  useEffect(() => {
    if (item) {
      setTitle(item.title);
      
      if (item.type === 'link') {
        const linkItem = item as LinkItem;
        setUrl(linkItem.url || '');
        setContent('');
      } else if (item.type === 'note') {
        const noteItem = item as NoteItem;
        setContent(noteItem.content || '');
        setUrl('');
      }
    }
  }, [item]);
  
  // Callbacks for sheet actions
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);
  
  // Control the sheet visibility
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);
  
  const renderBackdrop = useCallback(
    props => (
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
    if (!item) return;
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (item.type === 'link' && !url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    if (item.type === 'note' && !content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    setIsSubmitting(true);

    const updates: Partial<Item> = {
      title: title.trim(),
    };

    if (item.type === 'link') {
      (updates as Partial<LinkItem>).url = url.trim();
    } else if (item.type === 'note') {
      (updates as Partial<NoteItem>).content = content.trim();
    }

    try {
      await updateItem(item.id, updates);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If no item is selected, don't render the sheet
  if (!item) {
    return null;
  }

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
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} color={isDarkMode ? '#FFFFFF' : '#007AFF'} />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
          Edit {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
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
        {item.type === 'link' ? (
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
});