import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { Chat, OverlayProvider } from 'stream-chat-react-native';

import { chatClient } from '../lib/streamClient';
import GameChatScreen from '../pages/messages/GameChatScreen';
import PostDetails from '../pages/postDetails';
import { useTheme } from '../theme/ThemeProvider';

import SettingNav from './settingNav/SettingNav';
import TabNavigator from './TabNavigator';
import WalletNav from './walletNav/WalletNav';

export type AppStackParamList = {
  Home: undefined;
  GameChat: {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    gameTime: string;
    gameDate: string;
    gameType: string;
  };
  PostDetails: undefined;
  Messages: undefined;
  SetttingsNav: undefined;
  WalletNav: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  const { themeColors } = useTheme();

  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <StatusBar backgroundColor={themeColors.appBG} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="GameChat" component={GameChatScreen} />
          <Stack.Screen name="PostDetails" component={PostDetails} />
          <Stack.Screen name="SetttingsNav" component={SettingNav} />
          <Stack.Screen name="WalletNav" component={WalletNav} />
        </Stack.Navigator>
      </Chat>
    </OverlayProvider>
  );
}
