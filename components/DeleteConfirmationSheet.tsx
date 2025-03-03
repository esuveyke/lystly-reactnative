import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Trash2, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import { Item } from '@/types/item';

interface DeleteConfirmationSheetProps {
  itemId: string | null;
  isVisible: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function DeleteConfirmationSheet({ 
  itemId, 
  isVisible, 
  onClose,
  onDeleted
}: DeleteConfirmationSheetProps) {
  const { items, deleteItem } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Find the item by ID
  const item = useMemo(() => {
    return items.find(i => i.id === itemId) as Item | undefined;
  }, [itemId, items]);
  
  // Set up the snap points (40% of screen height)
  const snapPoints = useMemo(() => ['40%'], []);
  
  // Callbacks for sheet actions
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
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
  
  const handleDelete = async () => {
    if (!item) return;
    
    setIsDeleting(true);
    
    try {
      await deleteItem(item.id);
      if (onDeleted) {
        onDeleted();
      }
      onClose();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
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
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={40} color="#FF3B30" />
        </View>
        
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          Delete {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
        
        <Text style={[styles.message, isDarkMode && styles.messageDark]}>
          Are you sure you want to delete "{item.title}"? This action cannot be undone.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, styles.cancelButton, isDarkMode && styles.cancelButtonDark]} 
            onPress={onClose}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText, isDarkMode && styles.cancelButtonTextDark]}>
              Cancel
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.deleteButton, isDeleting && styles.deleteButtonDisabled]} 
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Trash2 size={16} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  messageDark: {
    color: '#A0A0A5',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonDark: {
    backgroundColor: '#3A3A3C',
  },
  cancelButtonText: {
    color: '#000000',
  },
  cancelButtonTextDark: {
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonDisabled: {
    backgroundColor: '#FF9490',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginRight: 8,
  },
});