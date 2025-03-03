import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createTestUsers, loginWithTestUser } from '@/utils/testData';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

export default function TestDataScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const { user, initialize } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      setMessage(`Currently logged in as: ${user.email}`);
    }
  }, [user]);

  const handleCreateTestUsers = async () => {
    setLoading(true);
    setMessage('Creating test users...');
    
    try {
      await createTestUsers();
      setMessage('Test users created successfully!\n\nEmails:\n- testuser1@example.com\n- testuser2@example.com\n- testuser3@example.com\n\nPassword for all: password123\n\nSample data has been automatically added to these accounts.');
      Alert.alert('Success', 'Test users created successfully!');
    } catch (error) {
      console.error('Error creating test users:', error);
      setMessage(`Error creating test users: ${error.message}`);
      Alert.alert('Error', `Failed to create test users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithTestUser = async (email: string) => {
    setLoading(true);
    setMessage(`Logging in with ${email}...`);
    
    try {
      await loginWithTestUser(email);
      
      // Re-initialize auth state to ensure we have the latest user data
      await initialize();
      
      setMessage(`Logged in successfully with ${email}`);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage(`Error logging in: ${error.message}`);
      Alert.alert('Error', `Failed to log in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>Test Data Management</Text>
        
        {user && (
          <View style={[styles.userInfoContainer, isDarkMode && styles.userInfoContainerDark]}>
            <Text style={[styles.userInfoText, isDarkMode && styles.userInfoTextDark]}>
              Currently logged in as: {user.email}
            </Text>
          </View>
        )}
        
        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Create Test Users</Text>
          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
            This will create three test users with sample data in your Supabase database. Sample data will be automatically added to each user account.
          </Text>
          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleCreateTestUsers}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Test Users</Text>
            )}
          </Pressable>
        </View>
        
        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Login with Test User</Text>
          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
            Select a test user to log in with:
          </Text>
          
          <View style={styles.buttonGroup}>
            <Pressable 
              style={[styles.button, styles.userButton, loading && styles.buttonDisabled]} 
              onPress={() => handleLoginWithTestUser('testuser1@example.com')}
              disabled={loading}
            >
              <Text style={styles.buttonText}>User 1</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.userButton, loading && styles.buttonDisabled]} 
              onPress={() => handleLoginWithTestUser('testuser2@example.com')}
              disabled={loading}
            >
              <Text style={styles.buttonText}>User 2</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.userButton, loading && styles.buttonDisabled]} 
              onPress={() => handleLoginWithTestUser('testuser3@example.com')}
              disabled={loading}
            >
              <Text style={styles.buttonText}>User 3</Text>
            </Pressable>
          </View>
        </View>
        
        {message ? (
          <View style={[styles.messageContainer, isDarkMode && styles.messageContainerDark]}>
            <Text style={[styles.messageText, isDarkMode && styles.messageTextDark]}>{message}</Text>
          </View>
        ) : null}
        
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  userInfoContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoContainerDark: {
    backgroundColor: '#1A3A5A',
  },
  userInfoText: {
    fontSize: 14,
    color: '#0D47A1',
  },
  userInfoTextDark: {
    color: '#90CAF9',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
  },
  sectionDark: {
    backgroundColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000000',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  descriptionDark: {
    color: '#A0A0A5',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  messageContainer: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageContainerDark: {
    backgroundColor: '#2C2C2E',
  },
  messageText: {
    fontSize: 14,
    color: '#333333',
  },
  messageTextDark: {
    color: '#FFFFFF',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});