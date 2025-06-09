import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import BootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import 'react-native-url-polyfill/auto';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AuthProvider } from './src/context/authContext';
import linking from './src/linking';
import AppNavigation, { navigationRef } from './src/navigation';
import store, { persistor } from './src/store';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { ThemeStylesProvider } from './src/theme/ThemeStylesProvider';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <ThemeStylesProvider>
            <AuthProvider>
              <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onReady={() => {
                  BootSplash.hide();
                }}
              >
                <AppNavigation />
                <Toast />
              </NavigationContainer>
            </AuthProvider>
          </ThemeStylesProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
