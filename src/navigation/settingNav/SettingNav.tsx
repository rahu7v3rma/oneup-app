// navigations/SettingNav.js
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';

import Account from '../../pages/account';
import ChangePassword from '../../pages/changePassword';
import { SettingsPage } from '../../pages/settingPage';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Account: undefined;
  SettingPage: undefined;
  ChangePassword: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsMain"
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'none' : 'fade',
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsPage}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ title: 'Account' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: 'ChangePassword' }}
      />
    </Stack.Navigator>
  );
};

export default SettingNav;
