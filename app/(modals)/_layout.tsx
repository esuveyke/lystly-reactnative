import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';

export default function ModalLayout() {
  const { isDarkMode } = useThemeStore();
  
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
        headerStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        headerTitleStyle: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        }
      }}
    />
  );
}