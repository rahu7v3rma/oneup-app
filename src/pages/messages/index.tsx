import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '@shared/text';
import { SportsTeam } from 'api/types';
import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  AppState,
  AppStateStatus,
} from 'react-native';

import { fetchTeams, fetchUpcomingEvents } from '../../api/match';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { streamChatService } from '../../services/streamChat';
import TopProfileBar from '../../shared/TopProfileBar';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { UserChannel } from '../../types/GameChat';
import { UpcomingGame } from '../../types/match';
import { renderLogo } from '../../utils/logoRenderer';

type Props = Record<string, never>;

const Messages: FunctionComponent<Props> = () => {
  const themeStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // State
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [teams, setTeams] = useState<SportsTeam[]>([]);
  const [userChannels, setUserChannels] = useState<UserChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [channelsRefreshing, setChannelsRefreshing] = useState(false);

  const unreadCountIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const limit = 10;

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const response = await fetchTeams(1, 100);
        setTeams(response.data.list);
      } catch (error) {
        console.error('Error loading teams:', error);
      }
    };

    loadTeams();
  }, []);

  useEffect(() => {
    // NEW: Handler for channel updates (both unread count and last message)
    const handleChannelUpdate = (channelId: string, channel: UserChannel) => {
      setUserChannels((prev) =>
        prev.map((prevChannel) =>
          prevChannel.id === channelId ? channel : prevChannel,
        ),
      );
    };

    streamChatService.onChannelUpdate = handleChannelUpdate;

    return () => {
      streamChatService.onChannelUpdate = undefined;
    };
  }, []);

  const loadUserChannels = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setChannelsRefreshing(true);
      } else {
        setChannelsLoading(true);
      }

      const channels = await streamChatService.getUserChannels(isRefresh);

      if (channels.length > 0) {
        const channelsWithFreshUnreadCounts =
          await streamChatService.refreshAllUnreadCounts();

        setUserChannels(channelsWithFreshUnreadCounts);
      } else {
        setUserChannels(channels);
      }
    } catch (error) {
      console.error('Error loading user channels:', error);
      setUserChannels([]);
    } finally {
      setChannelsLoading(false);
      setChannelsRefreshing(false);
    }
  }, []);

  // NEW: Improved app state handling
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        loadUserChannels(true);
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, [loadUserChannels]);

  // Load user channels on component mount
  useEffect(() => {
    loadUserChannels();
  }, [loadUserChannels]);

  const formatGameDateTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const formattedDate = `${day}/${month}`;

    return {
      gameTime: formattedTime,
      gameDate: formattedDate,
    };
  };

  const loadUpcomingGames = useCallback(
    async (currentPage = 1, isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else if (currentPage === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const eventsResponse = await fetchUpcomingEvents(currentPage, limit);

        // Create team map for quick lookup
        const teamMap = new Map<number, SportsTeam>();
        teams.forEach((team) => {
          teamMap.set(team.api_team_id, team);
        });

        const processedGames = eventsResponse.data.list.map((event: any) => {
          const homeTeam = teamMap.get(event.home_team);
          const awayTeam = teamMap.get(event.away_team);

          return {
            id: event.api_event_id,
            users: event.active_users || 0,
            wagers: event.active_wagers || 0,
            datetime: new Date(event.start_at),
            teams: [
              {
                id: event.home_team,
                name: homeTeam?.short_name || `Team ${event.home_team}`,
                logo: homeTeam?.logo_url,
                record: '',
                points: [
                  event.bet_point_spread.toFixed(1),
                  event.bet_over_under,
                  event.bet_home_team_money_line,
                ],
              },
              {
                id: event.away_team,
                name: awayTeam?.short_name || `Team ${event.away_team}`,
                logo: awayTeam?.logo_url,
                record: '',
                points: [
                  (-event.bet_point_spread).toFixed(1),
                  event.bet_over_under,
                  event.bet_away_team_money_line,
                ],
              },
            ],
          };
        });

        setHasNextPage(eventsResponse.data.has_next);

        if (isRefresh || currentPage === 1) {
          setUpcomingGames(processedGames);
        } else {
          setUpcomingGames((prev) => [...prev, ...processedGames]);
        }

        setPage(currentPage);
      } catch (error) {
        console.error('Error loading upcoming games:', error);
      } finally {
        setRefreshing(false);
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [teams],
  );

  // Initial load
  useEffect(() => {
    if (teams.length > 0) {
      loadUpcomingGames(1);
    }
  }, [teams, loadUpcomingGames]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadUpcomingGames(1, true);
    loadUserChannels(true);
  }, [loadUpcomingGames, loadUserChannels]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasNextPage) {
      loadUpcomingGames(page + 1);
    }
  }, [loadingMore, hasNextPage, page, loadUpcomingGames]);

  const renderUpcomingGame = ({ item }: { item: UpcomingGame }) => (
    <TouchableOpacity
      onPress={() => {
        const { gameTime: formattedTime, gameDate: formattedDate } =
          formatGameDateTime(item.datetime);
        navigation.navigate('GameChat', {
          gameId: item.id.toString(),
          homeTeam: item.teams[0].name,
          awayTeam: item.teams[1].name,
          homeTeamLogo: item.teams[0].logo,
          awayTeamLogo: item.teams[1].logo,
          gameTime: formattedTime,
          gameDate: formattedDate,
          gameType: 'Upcoming Game',
        });
      }}
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
            {renderLogo(team?.logo, styles, 16, 16)}
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
      <Text style={styles.upcomingGamesDateTime}>
        {item?.datetime instanceof Date
          ? formatGameDateTime(item.datetime).gameDate
          : item?.datetime}
      </Text>
    </TouchableOpacity>
  );

  const renderUserChannel = ({ item }: { item: UserChannel }) => {
    const timeAgo = streamChatService.getTimeAgo(item.lastActivity);

    const homeTeam = item.gameData?.homeTeam || '';
    const awayTeam = item.gameData?.awayTeam || '';
    const gameId = item.gameData?.gameId || item.id;

    const { gameTime: time, gameDate: date } = item.gameData?.gameTime
      ? formatGameDateTime(new Date(item.gameData.gameTime))
      : { gameTime: '', gameDate: '' };

    return (
      <TouchableOpacity
        key={item.id}
        style={[themeStyles.mt4, themeStyles.flexRow]}
        onPress={() => {
          streamChatService
            .markChannelAsRead(item.id, item.type)
            .catch((error) => {
              console.error('Failed to mark channel as read:', {
                channelId: item.id,
                error,
              });
            });

          const { gameTime: formattedTime, gameDate: formattedDate } =
            formatGameDateTime(
              item.gameData?.gameTime
                ? new Date(item.gameData.gameTime)
                : new Date(),
            );

          const navigationData = {
            gameId,
            homeTeam,
            awayTeam,
            homeTeamLogo: item.gameData?.homeTeamLogo || '',
            awayTeamLogo: item.gameData?.awayTeamLogo || '',
            gameTime: formattedTime,
            gameDate: formattedDate,
            gameType: item.gameData?.gameType || 'Active Game',
          };
          navigation.navigate('GameChat', navigationData);
        }}
      >
        <View style={[styles.gameChatsTeamBox, themeStyles.pRelative]}>
          {item.gameData?.homeTeamLogo && item.gameData?.awayTeamLogo ? (
            <>
              <View style={styles.gameChatsLogoOne}>
                {renderLogo(item.gameData.homeTeamLogo, styles, 28, 15)}
              </View>
              <View style={styles.diagonalLine} />
              <View style={styles.gameChatsLogoTwo}>
                {renderLogo(item.gameData.awayTeamLogo, styles, 28, 15)}
              </View>
            </>
          ) : (
            <>
              <View style={styles.gameChatsLogoOne}>
                <Text style={styles.teamInitials}>
                  {(homeTeam || '').substring(0, 2).toUpperCase() || 'HM'}
                </Text>
              </View>
              <View style={styles.diagonalLine} />
              <View style={styles.gameChatsLogoTwo}>
                <Text style={styles.teamInitials}>
                  {(awayTeam || '').substring(0, 2).toUpperCase() || 'AW'}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={[themeStyles.flex1, themeStyles.mh3]}>
          <View
            style={[themeStyles.flexRow, themeStyles.justifyContentBetween]}
          >
            <View style={[themeStyles.flexRow, themeStyles.alignItemsCenter]}>
              <Text style={styles.gameChatsTitle}>
                {item.gameData?.gameTitle || item.name}
              </Text>
              {time && date && (
                <Text style={styles.gameChatsDateTime}>
                  {time} • {date}
                </Text>
              )}
            </View>
          </View>
          <Text style={styles.gameChatsWagers}>
            {item.memberCount} members • {item.gameData?.gameType || 'Active'}
          </Text>
          <Text style={styles.gameChatDescription}>
            {item.lastMessage
              ? (() => {
                  const fullText = `${item.lastMessage.user.name}: ${item.lastMessage.text}`;
                  return fullText.length > 80
                    ? fullText.substring(0, 80) + '...'
                    : fullText;
                })()
              : 'No messages yet'}
          </Text>
        </View>

        <View style={[styles.gameChatsThirdCol, themeStyles.alignItemsCenter]}>
          <Text style={styles.gameChatsTime}>{timeAgo}</Text>
          {item.unreadCount > 0 && (
            <View
              style={[
                styles.gameChatsMsgCountCircle,
                themeStyles.mt2,
                themeStyles.alignItemsCenter,
                themeStyles.justifyContentCenter,
              ]}
            >
              <Text style={styles.gameChatsMsgCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderUpcomingGamesSection = () => {
    if (loading) {
      return (
        <View style={styles.upcomingGamesSection}>
          <Text style={[themeStyles.textDefaultCustom]}>Upcoming Games</Text>
          <View style={styles.upcomingGamesLoadingContainer}>
            <ActivityIndicator size="small" />
          </View>
        </View>
      );
    }

    if (upcomingGames.length === 0) {
      return (
        <View style={styles.upcomingGamesSection}>
          <Text style={[themeStyles.textDefaultCustom]}>Upcoming Games</Text>
          <View style={styles.upcomingGamesEmptyContainer}>
            <Text style={styles.upcomingGamesEmptyText}>No upcoming games</Text>
            <Text style={styles.upcomingGamesEmptySubText}>
              Check back later for new games!
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.upcomingGamesSection}>
        <Text style={[themeStyles.textDefaultCustom]}>Upcoming Games</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={upcomingGames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUpcomingGame}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary}
            />
          }
        />
      </View>
    );
  };

  const renderChannelsContent = () => {
    if (channelsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      );
    }

    if (userChannels.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No game chats yet</Text>
          <Text style={styles.emptySubText}>
            Join a game to start chatting with other fans!
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={userChannels}
        keyExtractor={(item) => item.id}
        renderItem={renderUserChannel}
        contentContainerStyle={styles.gameChatsFlatList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={channelsRefreshing}
            onRefresh={() => loadUserChannels(true)}
            tintColor={themeColors.primary}
          />
        }
      />
    );
  };

  useEffect(() => {
    const interval = unreadCountIntervalRef.current;
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <View style={[themeStyles.flex1, themeStyles.appBG]}>
      <TopProfileBar label="Game Chats" showSearchIcon={false} />

      <View style={[themeStyles.ph4, themeStyles.pt8, styles.mainContainer]}>
        {renderUpcomingGamesSection()}

        <View style={styles.gameChatsContainer}>
          <Text style={styles.gameChat}>Your game chats</Text>
          {renderChannelsContent()}
        </View>
      </View>
    </View>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    upcomingGamesSection: {
      marginBottom: 20,
    },
    upcomingGamesLoadingContainer: {
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
    },
    upcomingGamesEmptyContainer: {
      height: 120,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.cardBG,
      borderRadius: 10,
      marginTop: 16,
    },
    upcomingGamesEmptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 8,
    },
    upcomingGamesEmptySubText: {
      fontSize: 14,
      color: themeColors.mutedText,
      textAlign: 'center',
    },
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
    logoPlaceholder: {
      width: 16,
      height: 16,
      backgroundColor: '#ddd',
      borderRadius: 4,
    },
    upcomingGamesHeaderTitleColor: {
      color: themeColors.primary,
    },
    upcomingGamesTeamLogo: {
      width: 16,
      height: 16,
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
      flex: 1,
    },
    gameChatsFlatList: {
      flexGrow: 1,
      paddingBottom: 20,
    },
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    gameChatsLogoTwo: {
      position: 'absolute',
      bottom: 7,
      right: 4,
      width: 28,
      height: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    teamInitials: {
      fontSize: 8,
      fontWeight: 'bold',
      color: themeColors.primary,
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
    gameChat: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 10,
      paddingBottom: 4,
      lineHeight: 10,
    },
    gameChatsTitle: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 12,
      paddingBottom: 4,
      lineHeight: 10,
    },
    gameChatsWagers: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontWeight: '600',
      fontSize: 10,
      lineHeight: 10,
      paddingBottom: 2,
      color: themeColors.primary,
    },
    gameChatDescription: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 10,
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
    footerContainer: {
      width: 50,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.text,
      marginBottom: 8,
    },
    emptySubText: {
      fontSize: 14,
      color: themeColors.mutedText,
      textAlign: 'center',
    },
    gameChatsDateTime: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 10,
      lineHeight: 10,
      marginLeft: 10,
      color: themeColors.mutedText,
    },
    gameChatsLogoPlaceholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gameChatsLogoPlaceholderText: {
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 14,
      color: themeColors.text,
    },
  });
};

export default Messages;
