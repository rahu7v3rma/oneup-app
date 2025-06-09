import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { Messages } from '../pages';
import FeedsPage from '../pages/feed';
import GameScoreSumary from '../pages/GameScoreSumary';
import Scores from '../pages/scores';
import WagersScreen from '../screens/WagersScreen';

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
export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={CustomTabBar}
    >
      <Tab.Screen name="Feed" component={FeedsPage} />
      <Tab.Screen name="Wagers" component={WagersScreen} />
      <Tab.Screen name="Scores" component={ScoresViewStack} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}
