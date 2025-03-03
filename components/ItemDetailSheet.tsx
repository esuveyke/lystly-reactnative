import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Share, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, Share2, Trash2, ExternalLink, CreditCard as Edit, Link2, FileText, Users, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import { Item, LinkItem, NoteItem } from '@/types/item';
import EditItemSheet from './EditItemSheet';
import DeleteConfirmationSheet from './DeleteConfirmationSheet';

interface ItemDetailSheetProps {
  itemId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function ItemDetailSheet({ itemId, isVisible, onClose }: ItemDetailSheetProps) {
  const router = useRouter();
  const { items, updateItem, deleteItem } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const insets = useSafeAreaInsets();
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // State for nested sheets
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);
  const [isDeleteSheetVisible, setIsDeleteSheetVisible] = useState(false);
  
  // Find the item by ID
  const item = useMemo(() => {
    return items.find(i => i.id === itemId) as Item | undefined;
  }, [itemId, items]);
  
  // Set up the snap points (80% of screen height)
  const snapPoints = useMemo(() => ['80%'], []);
  
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
  
  // Item actions
  const handleToggleSave = () => {
    if (item) {
      updateItem(item.id, { isSaved: !item.isSaved });
    }
  };

  const handleShare = async () => {
    if (!item) return;
    
    try {
      let shareContent: any = {
        title: item.title,
      };
      
      if (item.type === 'link') {
        const linkItem = item as LinkItem;
        shareContent.message = `Check out this link: ${linkItem.url}`;
        shareContent.url = linkItem.url;
      } else if (item.type === 'note') {
        const noteItem = item as NoteItem;
        shareContent.message = `${item.title}\n\n${noteItem.content}`;
      }
      
      await Share.share(shareContent);
    } catch (error) {
      Alert.alert('Error', 'Could not share this item');
    }
  };

  const handleShareWithFriends = () => {
    if (!item) return;
    
    Alert.alert(
      "Share with Friends",
      "Select friends to share this item with",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Share", 
          onPress: () => {
            updateItem(item.id, { isShared: true });
            Alert.alert("Success", "Item shared successfully");
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    setIsEditSheetVisible(true);
  };

  const handleDelete = () => {
    setIsDeleteSheetVisible(true);
  };

  const handleOpenLink = () => {
    if (item?.type === 'link') {
      const linkItem = item as LinkItem;
      if (linkItem.url) {
        Alert.alert("Open Link", `Opening: ${linkItem.url}`);
      }
    }
  };
  
  const getItemIcon = () => {
    if (!item) return <Link2 size={24} color="#007AFF" />;
    
    switch (item.type) {
      case 'link':
        return <Link2 size={24} color="#007AFF" />;
      case 'note':
        return <FileText size={24} color="#FF9500" />;
      default:
        return <Link2 size={24} color="#007AFF" />;
    }
  };
  
  // If no item is selected, don't render the sheet
  if (!item) {
    return null;
  }

  return (
    <>
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
            <X size={24} color={isDarkMode ? '#FFFFFF' : '#007AFF'} />
          </Pressable>
          <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={24} color="#FF3B30" />
          </Pressable>
        </View>
        
        <BottomSheetScrollView 
          contentContainerStyle={{ 
            paddingBottom: 100 + insets.bottom,
            paddingHorizontal: 16
          }}
        >
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, isDarkMode && styles.iconContainerDark]}>
              {getItemIcon()}
            </View>
            <Text style={[styles.title, isDarkMode && styles.textDark]}>{item.title}</Text>
          </View>

          {item.type === 'link' && (
            <View style={styles.linkContainer}>
              <Text style={[styles.url, isDarkMode && styles.urlDark]}>
                {(item as LinkItem).url}
              </Text>
              {(item as LinkItem).imageUrl && (
                <Image source={{ uri: (item as LinkItem).imageUrl }} style={styles.previewImage} />
              )}
              <Pressable style={styles.openLinkButton} onPress={handleOpenLink}>
                <ExternalLink size={20} color="#FFFFFF" />
                <Text style={styles.openLinkText}>Open Link</Text>
              </Pressable>
            </View>
          )}

          {item.type === 'note' && (
            <View style={[styles.noteContainer, isDarkMode && styles.noteContainerDark]}>
              <Text style={[styles.noteContent, isDarkMode && styles.noteContentDark]}>
                {(item as NoteItem).content}
              </Text>
            </View>
          )}

          <View style={[styles.metaContainer, isDarkMode && styles.metaContainerDark]}>
            <Text style={[styles.dateText, isDarkMode && styles.dateTextDark]}>
              Added on {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            {item.isShared && (
              <View style={styles.sharedBadge}>
                <Text style={styles.sharedText}>Shared</Text>
              </View>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <Pressable 
              style={[
                styles.actionButton, 
                isDarkMode && styles.actionButtonDark,
                item.isSaved && styles.activeActionButton
              ]} 
              onPress={handleToggleSave}
            >
              <Bookmark 
                size={20} 
                color={item.isSaved ? "#FFFFFF" : isDarkMode ? "#FFFFFF" : "#007AFF"} 
                fill={item.isSaved ? "#FFFFFF" : "none"} 
              />
              <Text 
                style={[
                  styles.actionButtonText, 
                  isDarkMode && styles.actionButtonTextDark,
                  item.isSaved && styles.activeActionButtonText
                ]}
              >
                {item.isSaved ? "Saved" : "Save"}
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]} 
              onPress={handleShare}
            >
              <Share2 size={20} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
              <Text style={[styles.actionButtonText, isDarkMode && styles.actionButtonTextDark]}>Share</Text>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]} 
              onPress={handleShareWithFriends}
            >
              <Users size={20} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
              <Text style={[styles.actionButtonText, isDarkMode && styles.actionButtonTextDark]}>Friends</Text>
            </Pressable>

            <Pressable 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]} 
              onPress={handleEdit}
            >
              <Edit size={20} color={isDarkMode ? "#FFFFFF" : "#007AFF"} />
              <Text style={[styles.actionButtonText, isDarkMode && styles.actionButtonTextDark]}>Edit</Text>
            </Pressable>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      
      {/* Edit Item Sheet */}
      <EditItemSheet 
        itemId={itemId}
        isVisible={isEditSheetVisible}
        onClose={() => setIsEditSheetVisible(false)}
      />
      
      {/* Delete Confirmation Sheet */}
      <DeleteConfirmationSheet 
        itemId={itemId}
        isVisible={isDeleteSheetVisible}
        onClose={() => setIsDeleteSheetVisible(false)}
        onDeleted={onClose}
      />
    </>
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
  deleteButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerDark: {
    backgroundColor: '#3A3A3C',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
  },
  linkContainer: {
    marginBottom: 20,
  },
  url: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 12,
  },
  urlDark: {
    color: '#0A84FF',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  openLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  openLinkText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  noteContainer: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  noteContentDark: {
    color: '#EBEBF5',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  metaContainerDark: {
    borderTopColor: '#3A3A3C',
  },
  dateText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  dateTextDark: {
    color: '#A0A0A5',
  },
  sharedBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sharedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonDark: {
    borderColor: '#0A84FF',
  },
  activeActionButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  actionButtonTextDark: {
    color: '#FFFFFF',
  },
  activeActionButtonText: {
    color: '#FFFFFF',
  },
});