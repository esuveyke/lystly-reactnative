import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { user, initialized } = useAuthStore();
  
  // Wait for auth to initialize before redirecting
  if (!initialized) {
    return null;
  }
  
  // Redirect based on authentication status
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}