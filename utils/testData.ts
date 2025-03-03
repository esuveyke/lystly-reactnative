import { supabase } from '@/lib/supabase';
import { Item } from '@/types/item';

/**
 * Creates test users in Supabase Auth
 * Note: This should only be used in development environments
 */
export async function createTestUsers() {
  try {
    // Create test user 1
    const { data: user1, error: error1 } = await supabase.auth.signUp({
      email: 'testuser1@example.com',
      password: 'password123',
    });

    if (error1) {
      console.error('Error creating test user 1:', error1);
    } else {
      console.log('Created test user 1:', user1);
    }

    // Create test user 2
    const { data: user2, error: error2 } = await supabase.auth.signUp({
      email: 'testuser2@example.com',
      password: 'password123',
    });

    if (error2) {
      console.error('Error creating test user 2:', error2);
    } else {
      console.log('Created test user 2:', user2);
    }

    // Create test user 3
    const { data: user3, error: error3 } = await supabase.auth.signUp({
      email: 'testuser3@example.com',
      password: 'password123',
    });

    if (error3) {
      console.error('Error creating test user 3:', error3);
    } else {
      console.log('Created test user 3:', user3);
    }

    return { user1, user2, user3 };
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
}

/**
 * Fetches all items for the current user, including shared items
 */
export async function fetchAllItems(): Promise<Item[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Fetch user's own items
    const { data: ownItems, error: ownItemsError } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (ownItemsError) throw ownItemsError;
    
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
    
    if (sharedItemsError) throw sharedItemsError;
    
    // Process own items
    const processedOwnItems = ownItems.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      url: item.url,
      content: item.content,
      imageUrl: item.image_url,
      createdAt: item.created_at,
      isSaved: item.is_saved,
      isShared: item.is_shared,
    })) as Item[];
    
    // Process shared items
    const processedSharedItems = sharedItems.map(shared => {
      const item = shared.items;
      return {
        id: item.id,
        type: item.type,
        title: item.title,
        url: item.url,
        content: item.content,
        imageUrl: item.image_url,
        createdAt: item.created_at,
        isSaved: item.is_saved,
        isShared: item.is_shared,
        sharedWithMe: true,
        sharedBy: {
          id: shared.shared_by,
          name: 'User', // In a real app, you would fetch the user's name
        },
        sharedAt: shared.shared_at,
      };
    }) as Item[];
    
    // Combine all items
    return [...processedOwnItems, ...processedSharedItems];
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

/**
 * Helper function to log in with test user credentials
 */
export async function loginWithTestUser(email: string) {
  try {
    console.log(`Attempting to login with ${email}`);
    
    // First check if the user exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123',
    });
    
    if (!signInError) {
      console.log('Login successful:', signInData);
      return signInData;
    }
    
    console.log('Login failed, attempting to create user');
    
    // If sign-in fails, create the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: 'password123',
    });
    
    if (signUpError) {
      console.error('Error creating user:', signUpError);
      throw signUpError;
    }
    
    console.log('User created, waiting a moment before signing in');
    
    // Wait a moment for the user to be fully created in Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try signing in again
    const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123',
    });
    
    if (retryError) {
      console.error('Error signing in after user creation:', retryError);
      throw retryError;
    }
    
    console.log('Login successful after user creation:', retryData);
    return retryData;
  } catch (error) {
    console.error('Error in loginWithTestUser:', error);
    throw error;
  }
}