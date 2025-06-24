// navigations/SettingNav.js
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';

import { AddBank, Wallet } from '../../pages';
import { CardDetailsPreview } from '../../pages/cardDetails';
import AddMoneyScreen from '../../screens/AddMoney';
import TransferMoneyScreen from '../../screens/TranserMoney';
import { PaymentSheetPreview } from '../../shared/PaymentSheet';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Wallet: { token: string };
  CardDetailsPreview: {};
  AddBank: {};
  PaymentSheetPreview: {};
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Wallet"
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'none' : 'fade',
      }}
    >
      <Stack.Screen initialParams={{}} name="Wallet" component={Wallet} />
      <Stack.Screen initialParams={{}} name="AddBank" component={AddBank} />
      <Stack.Screen
        initialParams={{}}
        name="TransferMoneyScreen"
        component={TransferMoneyScreen}
      />
      <Stack.Screen
        initialParams={{}}
        name="AddMoneyScreen"
        component={AddMoneyScreen}
      />
      <Stack.Screen
        initialParams={{}}
        name="CardDetails"
        component={CardDetailsPreview}
      />
      <Stack.Screen
        initialParams={{}}
        name="PaymentSheet"
        component={PaymentSheetPreview}
      />
    </Stack.Navigator>
  );
};

export default SettingNav;
