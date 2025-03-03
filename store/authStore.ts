import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Platform } from 'react-native';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });
      
      console.log('Initializing auth state...');
      
      // Skip session check during server-side rendering
      if (!isBrowser) {
        console.log('Server environment detected, skipping auth initialization');
        set({ initialized: true, loading: false });
        return;
      }
      
      // Check for an existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Session check result:', session ? 'Session found' : 'No session found');
      
      if (session) {
        console.log('Setting user from session:', session.user.id);
        set({ 
          session,
          user: session.user,
        });
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, session ? 'Session exists' : 'No session');
        set({ 
          session,
          user: session?.user || null,
        });
      });
      
      // On web, we need to ensure the auth state is properly initialized
      if (Platform.OS === 'web') {
        try {
          // Force a refresh of the auth state
          const { data, error } = await supabase.auth.refreshSession();
          if (data.session) {
            console.log('Web session refresh successful:', data.session.user.id);
            set({ 
              session: data.session,
              user: data.session.user,
            });
          } else if (error) {
            console.log('Web session refresh error:', error.message);
          }
        } catch (refreshError) {
          console.error('Error refreshing session:', refreshError);
        }
      }
      
      set({ initialized: true });
      console.log('Auth initialization complete');
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Still mark as initialized to prevent blocking the app
      set({ initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Disable email confirmation to make testing easier
          emailRedirectTo: isBrowser ? window.location.origin : undefined,
          data: {
            email: email
          }
        }
      });
      
      if (data.session) {
        set({ 
          session: data.session,
          user: data.session.user,
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (data.session) {
        console.log('Sign in successful, user ID:', data.session.user.id);
        set({ 
          session: data.session,
          user: data.session.user,
        });
      } else {
        console.log('Sign in failed:', error?.message);
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    
    try {
      await supabase.auth.signOut();
      set({ 
        session: null,
        user: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ loading: false });
    }
  },
}));