import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Share, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Bookmark, Share2, Trash2, ExternalLink, CreditCard as Edit, Link2, FileText, Users } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useItemStore } from '@/store/itemStore';
import { useThemeStore } from '@/store/themeStore';
import { Item, LinkItem, NoteItem } from '@/types/item';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { items, updateItem, deleteItem } = useItemStore();
  const { isDarkMode } = useThemeStore();
  const [item, setItem] = useState<Item | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const foundItem = items.find(i => i.id === id) as Item | undefined;
    setItem(foundItem || null);
  }, [id, items]);

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]} edges={['top', 'right', 'left']}>
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFFFFF' : '#007AFF'} />
          </Pressable>
          <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>Item Not Found</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, isDarkMode && styles.textDark]}>The requested item could not be found.</Text>
          <Pressable 
            style={styles.goBackButton}
            onPress={() => router.back()}
          >
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getItemIcon = () => {
    switch (item.type) {
      case 'link':
        return <Link2 size={24} color="#007AFF" />;
      case 'note':
        return <FileText size={24} color="#FF9500" />;
      default:
        return <Link2 size={24} color="#007AFF" />;
    }
  };

  const handleToggleSave = () => {
    updateItem(item.id, { isSaved: !item.isSaved });
  };

  const handleShare = async () => {
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
    // In a real app, this would open a modal to select friends
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
            // Simulate sharing with a friend
            updateItem(item.id, { isShared: true });
            Alert.alert("Success", "Item shared successfully");
          }
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteItem(item.id);
            router.back();
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    // In a real app, this would navigate to an edit screen
    Alert.alert("Edit", "Edit functionality would be implemented here");
  };

  const handleOpenLink = () => {
    if (item.type === 'link') {
      const linkItem = item as LinkItem;
      if (linkItem.url) {
        // In a real app, this would open the URL in a browser
        Alert.alert("Open Link", `Opening: ${linkItem.url}`);
      }
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }}>
        <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFFFFF' : '#007AFF'} />
          </Pressable>
          <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={24} color="#FF3B30" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content}
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
            <Text style={[styles.url, isDarkMode && styles.urlDark]}>{(item as LinkItem).url}</Text>
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
            <Text style={[
              styles.actionButtonText,
              isDarkMode && styles.actionButtonTextDark,
              item.isSaved && styles.activeActionButtonText
            ]}>
              {item.isSaved ? 'Saved' : 'Save'}
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
      </ScrollView>
    </View>
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
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
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
  imageContainer: {
    marginBottom: 20,
  },
  fullImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  goBackButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});