import { createNavigationContainerRef } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FunctionComponent, useContext } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { AuthContext } from '../context/authContext';
import { useDeepLinking } from '../hooks';
import Congratulations from '../pages/congratulations';
import ForgotPassword from '../pages/forgotPassword';
import IdentityAcknowledgment from '../pages/identityAcknowledgment';
import Login from '../pages/login';
import { RegisterPage } from '../pages/register';
import ResetPassword from '../pages/resetPassword';
import { useTheme } from '../theme/ThemeProvider';

import AppNavigator from './AppNavigator';

export type RootStackParamList = {
  ResetPassword: { token: string };
  ForgotPassword: {};
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator();

type Props = Record<string, never>;

const AppNavigation: FunctionComponent<Props> = ({}: Props) => {
  useDeepLinking();
  const { themeColors } = useTheme();
  const { user, loading } = useContext(AuthContext);

  return loading ? null : (
    <View style={[styles.container, { backgroundColor: themeColors.appBG }]}>
      <StatusBar backgroundColor={themeColors.appBG} />
      <SafeAreaView style={styles.safeAreaView}>
        <Stack.Navigator
          initialRouteName={user ? 'AppNavigator' : 'Login'}
          screenOptions={{
            headerShown: false,
            animation: Platform.OS === 'android' ? 'none' : 'fade',
          }}
        >
          <Stack.Screen initialParams={{}} name="Login" component={Login} />
          <Stack.Screen
            initialParams={{ token: 'token' }}
            name="ResetPassword"
            component={ResetPassword}
          />
          <Stack.Screen
            initialParams={{}}
            name="ForgotPassword"
            component={ForgotPassword}
          />
          <Stack.Screen
            initialParams={{}}
            name="CreateAccount"
            component={RegisterPage}
          />
          <Stack.Screen
            initialParams={{}}
            name="IdentityAcknowledgements"
            component={IdentityAcknowledgment}
          />
          <Stack.Screen
            initialParams={{}}
            name="Congratulation"
            component={Congratulations}
          />
          <Stack.Screen
            initialParams={{}}
            name="AppNavigator"
            component={AppNavigator}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? undefined : 40,
  },
  safeAreaView: {
    flex: 1,
  },
});

export default AppNavigation;
