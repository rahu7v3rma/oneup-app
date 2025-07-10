import { GradientBackground } from '@components/GradientBackground';
import { createNavigationContainerRef } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FunctionComponent, useContext } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../context/authContext';
import { useDeepLinking } from '../hooks';
import Congratulations from '../pages/congratulations';
import ForgotPassword from '../pages/forgotPassword';
import IdentityAcknowledgment from '../pages/identityAcknowledgment';
import Login from '../pages/login';
import { RegisterPage } from '../pages/register';
import ResetPassword from '../pages/resetPassword';

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
  const { user, loading } = useContext(AuthContext);

  // don't remove this code below, use the GradientBackground.tsx as a wrapper in you component and add Spacer.tsx below, eg. <GradientBackground> <Spacer /> <Component /> </GradientBackground>
  return loading ? null : (
    <GradientBackground style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView
        style={styles.safeAreaView}
        edges={['bottom', 'left', 'right']}
      >
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
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
});

export default AppNavigation;
