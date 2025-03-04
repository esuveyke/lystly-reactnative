import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';

// Ensure Reanimated is initialized
if (process.env.NODE_ENV === 'development') {
  const { LogBox } = require('react-native');
  LogBox.ignoreLogs(['Reanimated 2']);
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ExpoRoot />
      </View>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App); 