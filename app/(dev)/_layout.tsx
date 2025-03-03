import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';

export default function DevLayout() {
  const { isDarkMode } = useThemeStore();
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        headerTitleStyle: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
        headerTintColor: isDarkMode ? '#FFFFFF' : '#007AFF',
        contentStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        }
      }}
    >
      <Stack.Screen 
        name="test-data" 
        options={{ 
          title: 'Test Data',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}