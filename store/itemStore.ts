import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { Item, LinkItem, NoteItem } from '@/types/item';
import { handleApiError } from '@/utils/errorHandling';
import { Platform } from 'react-native';

interface ItemStore {
  items: Item[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchItems: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  createItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<Item | null>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  shareItem: (itemId: string, userId: string) => Promise<void>;
}

// Sample data for offline development
const sampleItems: Item[] = [
  {
    id: '1',
    type: 'link',
    title: 'React Native Documentation',
    url: 'https://reactnative.dev/docs/getting-started',
    imageUrl: 'https://reactnative.dev/img/header_logo.svg',
    createdAt: '2023-06-15T10:30:00Z',
    isSaved: true,
    isShared: false,
    sharedWithMe: false,
  },
  {
    id: '2',
    type: 'note',
    title: 'Project Ideas',
    content: 'Build a mobile app for tracking daily habits and goals. Include features like reminders, progress tracking, and data visualization.',
    createdAt: '2023-06-20T14:45:00Z',
    isSaved: false,
    isShared: true,
    sharedWithMe: false,
  },
  {
    id: '4',
    type: 'link',
    title: 'JavaScript Best Practices',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    createdAt: '2023-07-02T16:20:00Z',
    isSaved: false,
    isShared: false,
    sharedWithMe: false,
  },
  {
    id: '5',
    type: 'note',
    title: 'Meeting Notes',
    content: 'Discussed project timeline and deliverables. Key points: 1) Launch MVP by end of month, 2) Focus on core features first, 3) Schedule weekly progress reviews.',
    createdAt: '2023-07-10T11:00:00Z',
    isSaved: true,
    isShared: true,
    sharedWithMe: false,
  },
  {
    id: '6',
    type: 'link',
    title: 'UI Design Trends 2023',
    url: 'https://uxdesign.cc/ui-design-trends-for-2023-a-definitive-guide-68bcc1d55235',
    imageUrl: 'https://miro.medium.com/max/1400/0*7KFOZKmEUIppOQxH',
    createdAt: '2023-07-15T08:45:00Z',
    isSaved: false,
    isShared: false,
    sharedWithMe: true,
    sharedBy: {
      id: 'user1',
      name: 'Alex Johnson'
    },
    sharedAt: '2023-07-16T10:30:00Z'
  }
];

// Helper function to convert database item to app item
const mapDbItemToAppItem = (dbItem: any, sharedInfo?: any): Item => {
  const baseItem = {
    id: dbItem.id,
    type: dbItem.type as 'link' | 'note',
    title: dbItem.title,
    createdAt: dbItem.created_at,
    isSaved: dbItem.is_saved,
    isShared: dbItem.is_shared,
    sharedWithMe: false,
  };

  if (sharedInfo) {
    Object.assign(baseItem, {
      sharedWithMe: true,
      sharedBy: {
        id: sharedInfo.shared_by,
        name: sharedInfo.shared_by_name || 'User', // Fallback name
      },
      sharedAt: sharedInfo.shared_at,
    });
  }

  if (dbItem.type === 'link') {
    return {
      ...baseItem,
      type: 'link',
      url: dbItem.url || '',
      imageUrl: dbItem.image_url,
    } as LinkItem;
  } else {
    return {
      ...baseItem,
      type: 'note',
      content: dbItem.content || '',
    } as NoteItem;
  }
};

// Helper function to convert app item to database item
const mapAppItemToDbItem = (item: Partial<Item>, userId: string) => {
  return {
    user_id: userId,
    type: item.type,
    title: item.title,
    url: item.type === 'link' ? (item as LinkItem).url : null,
    content: item.type === 'note' ? (item as NoteItem).content : null,
    image_url: item.type === 'link' ? (item as LinkItem).imageUrl : null,
    is_saved: item.isSaved !== undefined ? item.isSaved : false,
    is_shared: item.isShared !== undefined ? item.isShared : false,
  };
};

export const useItemStore = create<ItemStore>((set, get) => ({
  items: [], // Start with empty array
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  
  fetchItems: async () => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      console.log('fetchItems: No authenticated user found');
      set({ error: 'User not authenticated' });
      return;
    }
    
    set({ loading: true, error: null, page: 1, hasMore: true });
    
    try {
      console.log('Fetching items for user:', user.id, 'Platform:', Platform.OS);
      
      // Fetch user's own items
      const { data: ownItems, error: ownItemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (ownItemsError) {
        console.error('Error fetching own items:', ownItemsError);
        throw ownItemsError;
      }
      
      console.log('Fetched own items:', ownItems?.length || 0);
      
      // Fetch items shared with the user
      const { data: sharedItems, error: sharedItemsError } = await supabase
        .from('shared_items')
        .select(`
          id,
          item_id,
          shared_by,
          shared_at,
          items:item_id(*)
        `)
        .eq('shared_with', user.id)
        .order('shared_at', { ascending: false });
      
      if (sharedItemsError) {
        console.error('Error fetching shared items:', sharedItemsError);
        throw sharedItemsError;
      }
      
      console.log('Fetched shared items:', sharedItems?.length || 0);
      
      // Process own items
      const processedOwnItems = ownItems?.map(item => mapDbItemToAppItem(item)) || [];
      
      // Process shared items
      const processedSharedItems = sharedItems?.map(shared => {
        const sharedInfo = {
          shared_by: shared.shared_by,
          shared_at: shared.shared_at,
        };
        return mapDbItemToAppItem(shared.items, sharedInfo);
      }) || [];
      
      // Combine all items
      const allItems = [...processedOwnItems, ...processedSharedItems];
      
      console.log('Total items after processing:', allItems.length);
      
      // If we're on web and have no items, but we have a user, try a workaround
      if (Platform.OS === 'web' && allItems.length === 0 && user) {
        console.log('Web platform with no items but authenticated user - trying workaround');
        
        // Try to refresh the session
        const { data } = await supabase.auth.refreshSession();
        if (data.session) {
          console.log('Session refreshed successfully, retrying fetch');
          
          // Retry fetching items after session refresh
          const { data: retryItems } = await supabase
            .from('items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (retryItems && retryItems.length > 0) {
            const retryProcessedItems = retryItems.map(item => mapDbItemToAppItem(item));
            console.log('Retry successful, got items:', retryProcessedItems.length);
            set({ 
              items: retryProcessedItems, 
              loading: false,
              hasMore: retryItems.length === 10
            });
            return;
          } else {
            console.log('Retry failed, still no items');
          }
        }
      }
      
      set({ 
        items: allItems, 
        loading: false,
        hasMore: (ownItems?.length === 10 || sharedItems?.length === 10)
      });
    } catch (error) {
      console.error('Error fetching items:', error);
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      
      // For development only - remove in production
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using sample data as fallback');
        set({ items: sampleItems });
      }
    }
  },
  
  fetchNextPage: async () => {
    const { loading, hasMore, page, items } = get();
    const user = useAuthStore.getState().user;
    
    if (loading || !hasMore || !user) return;
    
    set({ loading: true });
    
    try {
      const nextPage = page + 1;
      const limit = 10;
      const offset = (nextPage - 1) * limit;
      
      // Fetch next page of user's own items
      const { data: ownItems, error: ownItemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (ownItemsError) throw ownItemsError;
      
      // Fetch next page of shared items
      const { data: sharedItems, error: sharedItemsError } = await supabase
        .from('shared_items')
        .select(`
          id,
          item_id,
          shared_by,
          shared_at,
          items:item_id(*)
        `)
        .eq('shared_with', user.id)
        .order('shared_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (sharedItemsError) throw sharedItemsError;
      
      // Process items
      const processedOwnItems = ownItems.map(item => mapDbItemToAppItem(item));
      
      const processedSharedItems = sharedItems.map(shared => {
        const sharedInfo = {
          shared_by: shared.shared_by,
          shared_at: shared.shared_at,
        };
        return mapDbItemToAppItem(shared.items, sharedInfo);
      });
      
      const newItems = [...processedOwnItems, ...processedSharedItems];
      
      set({
        items: [...items, ...newItems],
        page: nextPage,
        hasMore: newItems.length === limit,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching more items:', error);
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  },
  
  createItem: async (newItem) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      set({ error: 'User not authenticated' });
      return null;
    }
    
    set({ loading: true, error: null });
    
    try {
      const dbItem = mapAppItemToDbItem(newItem, user.id);
      
      console.log('Creating new item:', dbItem);
      
      const { data, error } = await supabase
        .from('items')
        .insert(dbItem)
        .select()
        .single();
      
      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }
      
      console.log('Item created successfully:', data);
      
      const processedItem = mapDbItemToAppItem(data);
      
      set(state => ({
        items: [processedItem, ...state.items],
        loading: false
      }));
      
      return processedItem;
    } catch (error) {
      console.error('Error adding item:', error);
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      
      // Add to local state anyway for better UX
      const tempItem = {
        ...newItem,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        sharedWithMe: false,
      } as Item;
      
      set(state => ({
        items: [tempItem, ...state.items]
      }));
      
      return tempItem;
    }
  },
  
  updateItem: async (id, updates) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      // Convert app item updates to db format
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.isSaved !== undefined) dbUpdates.is_saved = updates.isSaved;
      if (updates.isShared !== undefined) dbUpdates.is_shared = updates.isShared;
      
      if (updates.type === 'link') {
        if ((updates as LinkItem).url !== undefined) dbUpdates.url = (updates as LinkItem).url;
        if ((updates as LinkItem).imageUrl !== undefined) dbUpdates.image_url = (updates as LinkItem).imageUrl;
      } else if (updates.type === 'note') {
        if ((updates as NoteItem).content !== undefined) dbUpdates.content = (updates as NoteItem).content;
      }
      
      dbUpdates.updated_at = new Date().toISOString();
      
      console.log('Updating item:', id, dbUpdates);
      
      const { error } = await supabase
        .from('items')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }
      
      console.log('Item updated successfully');
      
      // Update local state
      set(state => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating item:', error);
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      
      // Update local state anyway for better UX
      set(state => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      }));
    }
  },
  
  deleteItem: async (id) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      console.log('Deleting item:', id);
      
      // First delete any shares for this item
      await supabase
        .from('shared_items')
        .delete()
        .eq('item_id', id)
        .eq('shared_by', user.id);
      
      // Then delete the item itself
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }
      
      console.log('Item deleted successfully');
      
      // Update local state
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error removing item:', error);
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
      
      // Update local state anyway for better UX
      set(state => ({
        items: state.items.filter(item => item.id !== id)
      }));
    }
  },
  
  shareItem: async (itemId, userId) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      set({ error: 'User not authenticated' });
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      console.log('Sharing item:', itemId, 'with user:', userId);
      
      // Create a share record
      const { error } = await supabase
        .from('shared_items')
        .insert({
          item_id: itemId,
          shared_by: user.id,
          shared_with: userId
        });
      
      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }
      
      // Update the item's isShared status
      await supabase
        .from('items')
        .update({ is_shared: true })
        .eq('id', itemId)
        .eq('user_id', user.id);
      
      console.log('Item shared successfully');
      
      // Update local state
      set(state => ({
        items: state.items.map(item => 
          item.id === itemId ? { ...item, isShared: true } : item
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error sharing item:', error);
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, loading: false });
    }
  }
}));