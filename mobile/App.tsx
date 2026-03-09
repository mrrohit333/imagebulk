import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/theme';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.darkBg}
            translucent={false}
          />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <Toast />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
