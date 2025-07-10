import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import tokenService from '../api/services/token.service';
import { Messages } from '../pages';
import FeedsPage from '../pages/feed';
import GameScoreSumary from '../pages/GameScoreSumary';
import InviteToPlay from '../pages/inviteToPlay';
import Scores from '../pages/scores';
import MLBPage from '../screens/MLBPage';

import { TabBar } from './TabBar';

export type RootStackParamList = {
  ScoresList: {};
  GameScoreSummary: {};
};

export type ScoresNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBar = (props: any) => <TabBar {...props} />;

const ScoresViewStack = () => (
  <Stack.Navigator
    initialRouteName="ScoresList"
    screenOptions={{
      headerShown: false,
      animation: Platform.OS === 'android' ? 'none' : 'fade',
    }}
  >
    <Stack.Screen name={'ScoresList'} component={Scores} />
    <Stack.Screen name={'GameScoreSummary'} component={GameScoreSumary} />
  </Stack.Navigator>
);

const WagerStack = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { userData } = await tokenService.getTokenData();
        setInitialRoute(userData?.id === 22 ? 'MLB' : 'Play');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setInitialRoute('Play');
      }
    };
    fetchUserData();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'android' ? 'none' : 'fade',
      }}
    >
      <Stack.Screen name="MLB" component={MLBPage} />
      <Stack.Screen name="Play" component={InviteToPlay} />
      <Stack.Screen name="InviteToPlay" component={InviteToPlay} />
    </Stack.Navigator>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={CustomTabBar}
    >
      <Tab.Screen name="Feed" component={FeedsPage} />
      <Tab.Screen name="Play" component={WagerStack} />
      <Tab.Screen name="Scores" component={ScoresViewStack} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}
