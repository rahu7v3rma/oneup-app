import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '@shared/text';
import { FunctionComponent } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import TopProfileBar from '../../components/TopProfileBar';
import { gameChats, upcomingGames } from '../../constants';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { GameChat, UpcomingGame } from '../../types/match';

type Props = Record<string, never>;

const Messages: FunctionComponent<Props> = () => {
  const themeStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const renderUpcomingGame = ({ item }: { item: UpcomingGame }) => (
    <View
      style={[
        styles.upcomingGamesContainer,
        themeStyles.mt4,
        themeStyles.mr3,
        themeStyles.br10,
      ]}
    >
      <View style={[themeStyles.flexRow, themeStyles.justifyContentBetween]}>
        <Text style={styles.upcomingGamesHeaderTitle}>{item?.users} Users</Text>
        <Text
          style={[
            styles.upcomingGamesHeaderTitle,
            styles.upcomingGamesHeaderTitleColor,
          ]}
        >
          {item?.wagers} Wagers
        </Text>
      </View>

      {item?.teams.map((team) => (
        <View
          key={team?.id}
          style={[
            themeStyles.flexRow,
            themeStyles.justifyContentBetween,
            team?.id > 0 && themeStyles.mt1,
          ]}
        >
          <View style={[themeStyles.flexRow, themeStyles.alignItemsCenter]}>
            <View style={styles.upcomingGamesTeamLogo}>
              <Image source={team?.logo} />
            </View>
            <Text style={styles.upcomingGamesTeam}>{team?.name}</Text>
            <Text style={styles.upcomingGamesMatches}>{team?.record}</Text>
          </View>
          <View style={themeStyles.flexRow}>
            {team?.points.map((point, idx) => (
              <View
                key={idx}
                style={[
                  styles.upcomingGamesPointsBox,
                  themeStyles.appBG,
                  themeStyles.alignItemsCenter,
                  themeStyles.justifyContentCenter,
                  idx === 1 && themeStyles.mh1,
                ]}
              >
                <Text style={styles.upcomingGamesPoint}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      <Text style={styles.upcomingGamesDateTime}>{item?.datetime}</Text>
    </View>
  );

  const renderGameChat = ({ item }: { item: GameChat }) => (
    <TouchableOpacity
      key={item?.id}
      style={[themeStyles.mt4, themeStyles.flexRow]}
      onPress={() =>
        navigation.navigate('GameChat', { gameId: item.id.toString() })
      }
    >
      <View style={[styles.gameChatsTeamBox, themeStyles.pRelative]}>
        <Image source={item?.team1Logo} style={styles.gameChatsLogoOne} />
        <View style={styles.diagonalLine} />
        <Image source={item?.team2Logo} style={styles.gameChatsLogoTwo} />
      </View>
      <View style={[themeStyles.flex1, themeStyles.mh3]}>
        <Text style={styles.gameChatsTitle}>{item?.title}</Text>
        <Text style={styles.gameChatsWagers}>{item?.activeWagers}</Text>
        <Text style={styles.gameChatDescription}>{item?.lastMessage}</Text>
      </View>
      <View style={[styles.gameChatsThirdCol, themeStyles.alignItemsCenter]}>
        <Text style={styles.gameChatsTime}>{item?.timeAgo}</Text>
        {item?.unreadMessages ? (
          <View
            style={[
              styles.gameChatsMsgCountCircle,
              themeStyles.mt3,
              themeStyles.alignItemsCenter,
              themeStyles.justifyContentCenter,
            ]}
          >
            <Text style={styles.gameChatsMsgCount}>{item?.unreadMessages}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[themeStyles.flex1, themeStyles.appBG]}>
      <TopProfileBar label="Game Chats" showSearchIcon={false} />
      <View style={[themeStyles.ph4, themeStyles.pt8]}>
        <Text style={[themeStyles.textDefaultCustom]}>Upcoming Games</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={upcomingGames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUpcomingGame}
        />
        <View style={[styles.gameChatsContainer]}>
          <Text>Your game chats</Text>
          <FlatList
            data={gameChats}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGameChat}
            contentContainerStyle={styles.gameChatsFlatList}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    upcomingGamesContainer: {
      backgroundColor: themeColors.cardBG,
      width: 225,
      height: 98,
      padding: 10,
    },
    upcomingGamesHeaderTitle: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontSize: 8,
      lineHeight: 14,
      fontWeight: '600',
    },
    upcomingGamesHeaderTitleColor: {
      color: themeColors.primary,
    },
    upcomingGamesTeamLogo: {
      width: 16,
    },
    upcomingGamesTeam: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 10,
      lineHeight: 14,
      width: 40,
      textAlign: 'center',
    },
    upcomingGamesMatches: {
      fontFamily: Fonts.WorkSansBold,
      fontWeight: '700',
      fontSize: 6,
      lineHeight: 14,
      color: themeColors.mutedText,
      width: 20,
    },
    upcomingGamesPointsBox: {
      width: 34,
      height: 21,
      borderRadius: 3,
    },
    upcomingGamesPoint: {
      fontFamily: Fonts.WorkSansMedium,
      fontWeight: '500',
      fontSize: 6,
      lineHeight: 14,
    },
    upcomingGamesDateTime: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 6,
      lineHeight: 14,
    },
    gameChatsContainer: {
      marginTop: 50,
    },
    gameChatsFlatList: { paddingBottom: 150 },
    gameChatsTeamBox: {
      width: 56,
      height: 56,
      borderRadius: 4,
      backgroundColor: themeColors.cardBG,
      overflow: 'hidden',
    },
    gameChatsLogoOne: {
      position: 'absolute',
      top: 7,
      left: 4,
      width: 28,
      height: 15,
    },
    gameChatsLogoTwo: {
      position: 'absolute',
      bottom: 7,
      right: 4,
      width: 28,
      height: 17,
    },
    diagonalLine: {
      position: 'absolute',
      width: 57.57,
      height: 1,
      backgroundColor: themeColors.primary,
      top: 28,
      right: -1,
      transform: [{ rotate: '-45deg' }],
    },
    gameChatsTitle: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 10,
      lineHeight: 10,
    },
    gameChatsWagers: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontWeight: '600',
      fontSize: 10,
      lineHeight: 10,
      color: themeColors.primary,
    },
    gameChatDescription: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
      color: '#ADB5BD',
    },
    gameChatsThirdCol: {
      width: 55,
    },
    gameChatsTime: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontWeight: '600',
      fontSize: 10,
      lineHeight: 16,
      color: '#A4A4A4',
    },
    gameChatsMsgCountCircle: {
      width: 22,
      height: 20,
      borderRadius: 40,
      backgroundColor: themeColors.primary,
    },
    gameChatsMsgCount: {
      fontFamily: Fonts.WorkSansBold,
      fontWeight: '700',
      fontSize: 9,
      lineHeight: 16,
    },
  });
};

export default Messages;
