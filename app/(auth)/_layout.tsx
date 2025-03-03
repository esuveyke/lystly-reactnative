import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';

export default function AuthLayout() {
  const { isDarkMode } = useThemeStore();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        }
      }}
    />
  );
}