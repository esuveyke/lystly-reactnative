import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For development, provide default values if environment variables are not set

// In production, you should set these environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lrdfcsoltknmezrmvqxl.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdGJlcWZ5Y2FkYnZqeGx1aWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NzI4NzcsImV4cCI6MjAxNTU0ODg3N30.EXAMPLE_KEY';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a memory storage fallback for server-side rendering
const memoryStorage = {
  storage: new Map<string, string>(),
  getItem: (key: string) => {
    const value = memoryStorage.storage.get(key);
    return value || null;
  },
  setItem: (key: string, value: string) => {
    memoryStorage.storage.set(key, value);
  },
  removeItem: (key: string) => {
    memoryStorage.storage.delete(key);
  }
};

// Create a storage implementation that works in all environments
const createStorageAdapter = () => {
  // Server-side rendering - use memory storage
  if (!isBrowser) {
    return memoryStorage;
  }

  // Browser environment - use localStorage
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        try {
          const value = localStorage.getItem(key);
          return value;
        } catch (error) {
          console.error('Error reading from localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error writing to localStorage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    };
  }

  // Native environment - use AsyncStorage
  return AsyncStorage;
};

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: isBrowser,
      storage: createStorageAdapter(),
    },
    global: {
      // Add additional headers for web requests to avoid CORS issues
      headers: Platform.OS === 'web' ? {
        'X-Client-Info': 'expo-web'
      } : {}
    }
  }
);