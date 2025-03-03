import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export function useAuth() {
  const { signIn, signUp, loading, user } = useAuthStore();
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSignIn = async (email: string, password: string) => {
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    
    setError('');
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message || 'Failed to sign in');
      return false;
    }
    
    return true;
  };
  
  const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    
    if (!password) {
      setError('Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    setError('');
    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message || 'Failed to sign up');
      return false;
    }
    
    return true;
  };
  
  const redirectIfAuthenticated = () => {
    if (user) {
      router.replace('/(tabs)');
    }
  };
  
  return {
    handleSignIn,
    handleSignUp,
    redirectIfAuthenticated,
    error,
    setError,
    loading,
    user
  };
}