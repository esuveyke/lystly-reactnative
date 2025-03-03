import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Link2, FileText, X } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import LinkForm from '@/components/forms/LinkForm';
import NoteForm from '@/components/forms/NoteForm';
import { Item } from '@/types/item';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AddItemScreen() {
  const router = useRouter();
  const { createItem } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const [itemType, setItemType] = useState<'link' | 'note'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const newItem = {
      type: itemType,
      title: title.trim(),
      isSaved: false,
      isShared: false,
      sharedWithMe: false,
    } as Partial<Item>;

    if (itemType === 'link') {
      newItem.url = url.trim();
    } else if (itemType === 'note') {
      newItem.content = content.trim();
    }

    try {
      await createItem(newItem as Omit<Item, 'id' | 'createdAt'>);
      router.back();
    } catch (error) {
      console.error('Error creating item:', error);
      Alert.alert('Error', 'Failed to create item');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView 
      style={[styles.container, isDarkMode && styles.containerDark]} 
      edges={['bottom']}
    >
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(300)}
      >
        <Pressable onPress={handleCancel} style={styles.cancelButton}>
          <X size={24} color={isDarkMode ? '#FFFFFF' : '#007AFF'} />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>Add New Item</Text>
        <Pressable 
          onPress={handleSave} 
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          disabled={isSubmitting}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <Animated.View 
          style={styles.typeSelector}
          entering={FadeIn.duration(400).delay(100)}
        >
          <AnimatedPressable
            style={[
              styles.typeButton,
              itemType === 'link' && styles.selectedTypeButton,
            ]}
            onPress={() => setItemType('link')}
            entering={FadeIn.duration(300).delay(200)}
          >
            <Link2
              size={24}
              color={itemType === 'link' ? '#FFFFFF' : '#007AFF'}
            />
            <Text
              style={[
                styles.typeButtonText,
                itemType === 'link' && styles.selectedTypeButtonText,
              ]}
            >
              Link
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[
              styles.typeButton,
              itemType === 'note' && styles.selectedTypeButton,
            ]}
            onPress={() => setItemType('note')}
            entering={FadeIn.duration(300).delay(300)}
          >
            <FileText
              size={24}
              color={itemType === 'note' ? '#FFFFFF' : '#FF9500'}
            />
            <Text
              style={[
                styles.typeButtonText,
                itemType === 'note' && styles.selectedTypeButtonText,
              ]}
            >
              Note
            </Text>
          </AnimatedPressable>
        </Animated.View>

        {itemType === 'link' ? (
          <Animated.View
            entering={SlideInRight.duration(300)}
            exiting={SlideOutLeft.duration(300)}
          >
            <LinkForm
              title={title}
              setTitle={setTitle}
              url={url}
              setUrl={setUrl}
            />
          </Animated.View>
        ) : (
          <Animated.View
            entering={SlideInRight.duration(300)}
            exiting={SlideOutLeft.duration(300)}
          >
            <NoteForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
            />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
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
  cancelButton: {
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
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  selectedTypeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
});