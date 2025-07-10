import CardBgGradient from '@components/CardBgGradient';
import { GradientBackground } from '@components/GradientBackground';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Spacer from '@shared/Spacer';
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
import GameChatHeader from '../../components/GameChat/components/GameChatHeader';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { streamChatService } from '../../services/streamChat';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { UserChannel } from '../../types/GameChat';
import { UpcomingGame } from '../../types/match';
import { renderLogo } from '../../utils/logoRenderer';

type Props = Record<string, never>;

const ItemSeparator = () => <View style={itemSeparatorStyles.container} />;

const itemSeparatorStyles = StyleSheet.create({
  container: {
    width: 12,
  },
});

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

  const renderUpcomingGame = ({ item }: { item: UpcomingGame }) => {
    const { gameTime: formattedTime, gameDate: formattedDate } =
      formatGameDateTime(item.datetime);
    // Example odds, replace with real data if available
    const homeOdds = item.teams[0]?.points;
    const awayOdds = item.teams[1]?.points;
    return (
      <TouchableOpacity
        onPress={() => {
          const { gameTime: gameTimeFormatted, gameDate: gameDateFormatted } =
            formatGameDateTime(item.datetime);
          navigation.navigate('GameChat', {
            gameId: item.id.toString(),
            homeTeam: item.teams[0].name,
            awayTeam: item.teams[1].name,
            homeTeamLogo: item.teams[0].logo,
            awayTeamLogo: item.teams[1].logo,
            gameTime: gameTimeFormatted,
            gameDate: gameDateFormatted,
            gameType: 'Upcoming Game',
          });
        }}
      >
        <CardBgGradient>
          <View style={[themeStyles.br10, styles.gameCardContainer]}>
            {/* Main Row: Left (teams), Right (odds) */}
            <View style={[themeStyles.flexRow, themeStyles.alignItemsCenter]}>
              {/* Left: Both teams */}
              <View
                style={[themeStyles.flex2, themeStyles.justifyContentCenter]}
              >
                <View
                  style={[themeStyles.flexRow, themeStyles.alignItemsCenter]}
                >
                  {renderLogo(item.teams[0]?.logo, styles, 28, 28)}
                  <Text
                    style={[
                      themeStyles.fontSize18,
                      themeStyles.fontWeightBold,
                      styles.teamNameText,
                    ]}
                  >
                    {item.teams[0]?.name}
                  </Text>
                  <Text
                    style={[
                      themeStyles.fontSize18,
                      themeStyles.fontWeigthMedium,
                      themeStyles.textSupporting,
                      styles.teamRecordText,
                    ]}
                  >
                    {item.teams[0]?.record || '4 - 8'}
                  </Text>
                </View>
                <View
                  style={[themeStyles.flexRow, themeStyles.alignItemsCenter]}
                >
                  {renderLogo(item.teams[1]?.logo, styles, 28, 28)}
                  <Text
                    style={[
                      themeStyles.fontSize18,
                      themeStyles.fontWeightBold,
                      styles.teamNameText,
                    ]}
                  >
                    {item.teams[1]?.name}
                  </Text>
                  <Text
                    style={[
                      themeStyles.fontSize18,
                      themeStyles.fontWeigthMedium,
                      themeStyles.textSupporting,
                      styles.teamRecordText,
                    ]}
                  >
                    {item.teams[1]?.record || '4 - 8'}
                  </Text>
                </View>
              </View>
              {/* Right: Both odds rows */}
              <View
                style={[
                  themeStyles.flex1,
                  themeStyles.alignItemsEnd,
                  themeStyles.justifyContentStart,
                ]}
              >
                <View
                  style={[
                    themeStyles.flexRow,
                    themeStyles.alignItemsCenter,
                    styles.oddsRowContainer,
                  ]}
                >
                  {homeOdds.map((odd, idx) => (
                    <View key={idx} style={styles.oddsPillFinal}>
                      <Text
                        style={[themeStyles.fontWeigthMedium, styles.oddsText]}
                      >
                        {odd}
                      </Text>
                    </View>
                  ))}
                </View>
                <View
                  style={[
                    themeStyles.flexRow,
                    themeStyles.alignItemsCenter,
                    styles.oddsRowContainer,
                  ]}
                >
                  {awayOdds.map((odd, idx) => (
                    <View key={idx} style={styles.oddsPillFinal}>
                      <Text
                        style={[themeStyles.fontWeigthMedium, styles.oddsText]}
                      >
                        {odd}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            {/* Footer Row: left (date), right (games) */}
            <View
              style={[
                themeStyles.flexRow,
                themeStyles.alignItemsCenter,
                themeStyles.justifyContentBetween,
                styles.footerRowContainer,
              ]}
            >
              <View style={styles.footerDateTimeFinal}>
                <Text
                  style={[
                    themeStyles.textInterSemiBold,
                    styles.footerDateFinal,
                  ]}
                >{`SUNDAY, ${formattedDate}`}</Text>
                <Text
                  style={[
                    themeStyles.textInterSemiBold,
                    styles.footerTimeFinal,
                  ]}
                >
                  {' '}
                  <Text style={styles.footerTimeBoldFinal}>
                    {formattedTime}
                  </Text>
                </Text>
              </View>
              <View style={styles.gamesCountPillFinal}>
                <Text
                  style={[
                    themeStyles.textInterSemiBold,
                    themeStyles.textSupporting,
                    styles.gamesCountTextFinal,
                  ]}
                >
                  5 GAMES
                </Text>
              </View>
            </View>
          </View>
        </CardBgGradient>
      </TouchableOpacity>
    );
  };

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
        style={[
          themeStyles.flexRow,
          themeStyles.alignItemsCenter,
          styles.userChannelContainer,
        ]}
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
        <View
          style={[
            themeStyles.justifyContentCenter,
            themeStyles.alignItemsCenter,
            styles.teamLogoContainer,
          ]}
        >
          {item.gameData?.homeTeamLogo && item.gameData?.awayTeamLogo ? (
            <>
              <View style={styles.gameChatsLogoOne}>
                {renderLogo(item.gameData.homeTeamLogo, styles, 32, 18)}
              </View>
              <View style={styles.diagonalLine} />
              <View style={styles.gameChatsLogoTwo}>
                {renderLogo(item.gameData.awayTeamLogo, styles, 32, 18)}
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

        {/* Right: Chat Content */}
        <View style={[themeStyles.flex1, styles.chatContentContainer]}>
          {/* Row 1: Game Info + Active Games */}
          <View
            style={[
              themeStyles.flexRow,
              themeStyles.alignItemsCenter,
              themeStyles.justifyContentBetween,
              styles.gameInfoRowContainer,
            ]}
          >
            <View style={styles.gameInfoPill}>
              <Text style={styles.gameInfoText}>
                {homeTeam} @ {awayTeam} {date} {time}
              </Text>
            </View>
            <View style={styles.activeGamesPill}>
              <Text style={styles.activeGamesText}>5 ACTIVE GAMES</Text>
            </View>
          </View>

          {/* Row 2: Message */}
          <View
            style={[
              themeStyles.flexRow,
              themeStyles.alignItemsCenter,
              styles.messageRowContainer,
            ]}
          >
            <Text style={styles.messageText}>
              <Text style={styles.usernameText}>
                {item.lastMessage?.user?.name || 'User'}
              </Text>
              {item.lastMessage?.text
                ? ` ${
                    item.lastMessage.text.length > 50
                      ? item.lastMessage.text.substring(0, 50) + '...'
                      : item.lastMessage.text
                  }`
                : ''}
            </Text>
          </View>

          {/* Row 3: Time and Unread Count */}
          <View style={[themeStyles.flexRow, themeStyles.justifyContentEnd]}>
            <Text style={styles.timeAgoText}>{timeAgo}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadCountCircle}>
                <Text style={styles.unreadCountText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View
        style={[
          themeStyles.justifyContentCenter,
          themeStyles.alignItemsCenter,
          styles.footerContainer,
        ]}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderUpcomingGamesSection = () => {
    if (loading) {
      return (
        <View style={[themeStyles.mb5]}>
          <Text style={[themeStyles.textInterSemiBold, themeStyles.fontSize14]}>
            Upcoming Games
          </Text>
          <View
            style={[
              themeStyles.justifyContentCenter,
              themeStyles.alignItemsCenter,
              styles.loadingContainer,
            ]}
          >
            <ActivityIndicator size="small" />
          </View>
        </View>
      );
    }

    if (upcomingGames.length === 0) {
      return (
        <View style={[themeStyles.mb5]}>
          <Text style={[themeStyles.textInterSemiBold, themeStyles.fontSize14]}>
            Upcoming Games
          </Text>
          <View
            style={[
              themeStyles.justifyContentCenter,
              themeStyles.alignItemsCenter,
              styles.emptyContainer,
              { backgroundColor: themeColors.cardBG },
            ]}
          >
            <Text
              style={[
                themeStyles.fontSize16,
                themeStyles.fontWeightSemiBold,
                themeStyles.textDefault,
                themeStyles.mb2,
              ]}
            >
              No upcoming games
            </Text>
            <Text
              style={[
                themeStyles.fontSize14,
                themeStyles.textMuted,
                themeStyles.textAlignCenter,
              ]}
            >
              Check back later for new games!
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[themeStyles.mb5]}>
        <Text
          style={[
            themeStyles.textInterBold,
            themeStyles.pv4,
            themeStyles.fontWeightBold,
          ]}
        >
          Upcoming Games
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={upcomingGames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUpcomingGame}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={ItemSeparator}
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
        <View
          style={[
            themeStyles.flex1,
            themeStyles.justifyContentCenter,
            themeStyles.alignItemsCenter,
            themeStyles.pv10,
          ]}
        >
          <ActivityIndicator size="small" />
        </View>
      );
    }

    if (userChannels.length === 0) {
      return (
        <View
          style={[
            themeStyles.flex1,
            themeStyles.justifyContentCenter,
            themeStyles.alignItemsCenter,
            themeStyles.pv10,
          ]}
        >
          <Text style={[themeStyles.textInterSemiBold, themeStyles.fontSize14]}>
            No game chats yet
          </Text>
          <Text style={[themeStyles.textInterSemiBold, themeStyles.fontSize14]}>
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
        contentContainerStyle={[
          themeStyles.flexGrow1,
          styles.flatListContentContainer,
        ]}
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
    <GradientBackground>
      <View style={themeStyles.appHeaderBG}>
        <Spacer multiplier={1} />
        <GameChatHeader
          themeStyles={themeStyles}
          containerStyle={themeStyles.appHeaderBG}
        />
      </View>

      <View style={[themeStyles.ph4, themeStyles.pt4, themeStyles.flex1]}>
        {renderUpcomingGamesSection()}

        <View style={themeStyles.flex1}>
          <Text
            style={[
              themeStyles.textInterBold,
              themeStyles.pv4,
              themeStyles.fontWeightBold,
            ]}
          >
            Chats
          </Text>
          {renderChannelsContent()}
        </View>
      </View>
    </GradientBackground>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    // Using global styles where available, keeping specific styles that don't have global equivalents

    gameCardContainer: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 10,
      width: 370,
      alignSelf: 'center',
    },

    teamNameText: {
      color: '#fff',
      marginLeft: 12,
      marginRight: 8,
      minWidth: 48,
    },

    teamRecordText: {
      marginRight: 8,
    },

    oddsRowContainer: {
      marginBottom: 3,
      gap: 3,
    },

    oddsText: {
      color: '#fff',
      fontSize: 8,
    },

    footerRowContainer: {
      paddingTop: 0,
      paddingHorizontal: 0,
      gap: 0,
    },

    userChannelContainer: {
      height: 80,
      backgroundColor: 'transparent',
      marginBottom: 8,
    },

    teamLogoContainer: {
      width: 70,
      height: 70,
      borderRadius: 8,
      backgroundColor: '#23272F',
      marginRight: 4,
      overflow: 'hidden',
    },

    chatContentContainer: {
      height: '100%',
      justifyContent: 'center',
    },

    gameInfoRowContainer: {
      marginBottom: 2,
    },

    messageRowContainer: {
      marginBottom: 2,
      flexWrap: 'nowrap',
    },

    footerContainer: {
      width: 50,
      paddingHorizontal: 10,
    },

    loadingContainer: {
      height: 120,
    },

    emptyContainer: {
      height: 120,
      borderRadius: 10,
      marginTop: 16,
    },

    separatorContainer: {
      width: 12,
    },

    flatListContentContainer: {
      paddingBottom: 20,
    },

    itemSeparatorStyle: {
      width: 12,
    },

    oddsPillFinal: {
      width: 36,
      height: 36,
      borderRadius: 3,
      backgroundColor: '#22262E',
      alignItems: 'center',
      justifyContent: 'center',
    },

    dividerFinal: {
      height: 1,
      backgroundColor: '#404353',
      marginTop: 18,
      marginBottom: 0,
      marginHorizontal: -20,
    },
    footerDateTimeFinal: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#1C2027',
      borderRadius: 3,
      paddingHorizontal: 8,
      paddingVertical: 7,
      fontSize: 8,
      flex: 0.65,
    },
    footerDateFinal: {
      fontWeight: '600',
      fontSize: 10,
      textTransform: 'uppercase',
    },
    footerTimeFinal: {
      fontWeight: '600',
      fontSize: 10,
    },
    footerTimeBoldFinal: {
      color: '#fff',
      fontWeight: 'bold',
    },
    gamesCountPillFinal: {
      backgroundColor: '#22262E',
      borderRadius: 3,
      paddingHorizontal: 10,
      paddingVertical: 7,
      flex: 0.3,
      alignItems: 'center',
    },
    gamesCountTextFinal: {
      textTransform: 'uppercase',
      fontSize: 8,
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
      fontSize: 12,
      fontWeight: 'bold',
      color: themeColors.primary,
    },
    diagonalLine: {
      position: 'absolute',
      width: 90,
      height: 1,
      backgroundColor: themeColors.primary,
      top: 34,
      right: -10,
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

    gameInfoPill: {
      backgroundColor: '#23272F',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 3,
      marginRight: 6,
      maxWidth: '65%',
    },
    gameInfoText: {
      color: '#ADB5BD',
      fontWeight: '600',
      fontSize: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    activeGamesPill: {
      backgroundColor: '#23272F',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 3,
      alignSelf: 'flex-start',
    },
    activeGamesText: {
      color: '#2ECC71',
      fontWeight: '600',
      fontSize: 8,
      textTransform: 'uppercase',
    },
    usernameText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 12,
      marginRight: 4,
    },
    messageText: {
      color: '#ADB5BD',
      fontWeight: '400',
      fontSize: 12,
      flexShrink: 1,
    },
    timeAgoText: {
      color: '#ADB5BD',
      fontWeight: '500',
      fontSize: 9,
      textTransform: 'uppercase',
    },
    unreadCountCircle: {
      minWidth: 22,
      height: 20,
      borderRadius: 11,
      backgroundColor: '#2ECC71',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
      paddingHorizontal: 6,
    },
    unreadCountText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 9,
    },
  });
};

export default Messages;
