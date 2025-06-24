import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemeColors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { useTheme } from '../../../theme/ThemeProvider';

import { GameStatus } from './Team';

type ActionButtonsProps = {
  status: GameStatus;
  onBetPress: () => void;
  onChatPress: () => void;
  eventId?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  gameTime?: Date;
};

type AppStackParamList = {
  Messages: undefined;
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
};

const ActionButtons = ({
  status,
  onChatPress,
  onBetPress,
  eventId,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
  gameTime,
}: ActionButtonsProps) => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const styles = getStyles(theme.themeColors);

  const formatGameDateTime = (date: Date) => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    const formattedDate = date
      .toLocaleDateString('en-US', dateOptions)
      .toUpperCase();

    return {
      gameTime: formattedTime,
      gameDate: formattedDate,
    };
  };

  const getGameType = (gameStatus: GameStatus): string => {
    const normalizedStatus = gameStatus.toLowerCase();

    switch (normalizedStatus) {
      case 'before':
      case 'scheduled':
        return 'Upcoming Game';
      case 'live':
        return 'Live Game';
      case 'final':
        return 'Final';
      default:
        return 'Upcoming Game';
    }
  };

  const handleChatPress = () => {
    onChatPress();

    if (eventId && homeTeamName && awayTeamName) {
      const { gameTime: formattedTime, gameDate: formattedDate } =
        formatGameDateTime(gameTime || new Date());

      navigation.navigate('GameChat', {
        gameId: eventId,
        homeTeam: homeTeamName,
        awayTeam: awayTeamName,
        homeTeamLogo: homeTeamLogo || '',
        awayTeamLogo: awayTeamLogo || '',
        gameTime: formattedTime,
        gameDate: formattedDate,
        gameType: getGameType(status),
      });
    } else {
      navigation.navigate('Messages');
    }
  };

  return (
    <View style={styles.buttonsContainer}>
      {status === 'before' && (
        <TouchableOpacity
          style={[styles.betButton, styles.commonButton]}
          onPress={onBetPress}
        >
          <Text style={[styles.betButtonText, styles.commonButtonText]}>
            Bet on Game
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.chatButton, styles.commonButton]}
        onPress={handleChatPress}
      >
        <Text style={[styles.chatButtonText, styles.commonButtonText]}>
          Game Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (themeColor: ThemeColors) =>
  StyleSheet.create({
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
      gap: 10,
    },
    commonButton: {
      flex: 1,
      flexDirection: 'row',
      verticalAlign: 'middle',
      justifyContent: 'center',
      paddingVertical: 19,
      paddingHorizontal: 20,
      borderRadius: 10,
      borderWidth: 2,
    },
    betButton: {
      backgroundColor: themeColor.btnBG,
    },
    betButtonText: {
      color: themeColor.text,
    },
    chatButton: {
      borderColor: themeColor.btnBG,
    },
    chatButtonText: {
      color: themeColor.btnBG,
    },
    commonButtonText: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontSize: 15,
      textAlign: 'center',
    },
  });

export { ActionButtons };
