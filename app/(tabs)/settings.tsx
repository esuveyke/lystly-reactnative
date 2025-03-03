import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, ChevronRight, Layers } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import ThemeSettings from '@/components/ThemeSettings';
import useTheme from '@/hooks/useTheme';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { colors } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.screenTitle, { color: colors.text.primary }]}>
        Settings
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          Appearance
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <ThemeSettings />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          Developer Tools
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Pressable
            style={[styles.settingItem, { borderBottomColor: colors.divider }]}
            onPress={() => router.push('/skeleton-example' as any)}
          >
            <View style={styles.settingItemContent}>
              <Layers size={20} color={colors.button.primary} />
              <Text style={[styles.settingItemText, { color: colors.text.primary }]}>
                Skeleton UI Examples
              </Text>
            </View>
            <ChevronRight size={20} color={colors.icon.tertiary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          Account
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Pressable
            style={[styles.settingItem, { borderBottomColor: colors.divider }]}
            onPress={handleLogout}
          >
            <View style={styles.settingItemContent}>
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.settingItemText, { color: colors.error }]}>
                Log Out
              </Text>
            </View>
            <ChevronRight size={20} color={colors.icon.tertiary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
          About
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.settingItem, { borderBottomColor: colors.divider }]}>
            <View style={styles.settingItemContent}>
              <Text style={[styles.settingItemText, { color: colors.text.primary }]}>
                Version
              </Text>
            </View>
            <Text style={[styles.settingItemValue, { color: colors.text.tertiary }]}>
              1.0.0
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.footer, { color: colors.text.tertiary }]}>
        Lystly © {new Date().getFullYear()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingItemValue: {
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
});