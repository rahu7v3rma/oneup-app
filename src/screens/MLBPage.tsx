import Icon from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ThemeColors } from 'theme/colors';

import {
  fetchEvents,
  fetchScores,
  fetchTeams,
  fetchTimeframes,
} from '../api/match';
import {
  SportsEvent,
  SportsScore,
  SportsTeam,
  SportsTimeframe,
} from '../api/types';
import { GradientBackground } from '../components/GradientBackground';
import MLBTab from '../navigation/MLB/MLBTab';
import PlayHeader from '../shared/PlayHeader';
import PlayScoreCard from '../shared/PlayScoreCard';
import Spacer from '../shared/Spacer';
import WeeklyCalendar from '../shared/WeeklyCalendar';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface WeekData {
  id: string;
  week: number;
  season: number;
  displayName: string;
  startDate: string;
  endDate: string;
  timeframe: SportsTimeframe;
  isCurrentWeek: boolean;
}

interface MLBScores {
  id: string;
  homeTeam: {
    name: string;
    record: string;
    logo: string;
    score: string;
    hasPossession: boolean;
    GameOver: boolean;
    hasNotPlayed: boolean;
  };
  awayTeam: {
    name: string;
    record: string;
    logo: string;
    score: string;
    hasPossession: boolean;
    GameOver: boolean;
    hasNotPlayed: boolean;
  };
  quarter: string;
  timeRemaining: string;
  network: string;
  downAndDistance: string;
  finalOut: boolean;
}

export default function MLBPage() {
  const themeStyles = useThemeStyles();
  const [matches, setMatches] = useState<MLBScores[]>([]);
  const [teamsMap, setTeamsMap] = useState<Record<number, SportsTeam>>({});
  const [scoresMap, setScoresMap] = useState<Record<number, SportsScore>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const isFetching = useRef(false);
  const isRefreshing = useRef(false);
  const userScrolled = useRef(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const isInitialized = useRef(false);
  const limit = 10;
  const [availableWeeks, setAvailableWeeks] = useState<WeekData[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);

  const generateWeeksFromTimeframes = useCallback(
    (timeframes: SportsTimeframe[]): WeekData[] => {
      const weeks: WeekData[] = [];
      const today = dayjs();

      timeframes.forEach((timeframe) => {
        const startDate = dayjs(timeframe.start_at);
        const endDate = dayjs(timeframe.end_at);

        let currentWeekStart = startDate;
        let weekNumber = 1;

        while (
          currentWeekStart.isBefore(endDate) ||
          currentWeekStart.isSame(endDate, 'day')
        ) {
          const currentWeekEnd = currentWeekStart.add(6, 'day');
          const actualWeekEnd = currentWeekEnd.isAfter(endDate)
            ? endDate
            : currentWeekEnd;

          const isCurrentWeek =
            today.isSameOrAfter(currentWeekStart, 'day') &&
            today.isSameOrBefore(actualWeekEnd, 'day');

          weeks.push({
            id: `${timeframe.id}-week-${weekNumber}`,
            week: weekNumber,
            season: timeframe.season,
            displayName: `Week ${weekNumber}`,
            startDate: currentWeekStart.format('MMM D'),
            endDate: actualWeekEnd.format('MMM D'),
            timeframe,
            isCurrentWeek,
          });

          currentWeekStart = currentWeekStart.add(7, 'day');
          weekNumber++;
        }
      });

      const sortedWeeks = weeks.sort((a, b) => {
        if (a.season !== b.season) {
          return a.season - b.season;
        }
        return a.week - b.week;
      });

      return sortedWeeks;
    },
    [],
  );

  const filterEventsByWeek = useCallback(
    (
      events: SportsEvent[],
      selectedWeekData: WeekData | null,
    ): SportsEvent[] => {
      if (!selectedWeekData) {
        return events;
      }

      return events.filter((event) => event.week === selectedWeekData.week);
    },
    [],
  );

  const findCurrentWeekIndex = useCallback((weeks: WeekData[]): number => {
    const currentWeekIndexNumber = weeks.findIndex(
      (week) => week.isCurrentWeek,
    );
    return currentWeekIndexNumber >= 0 ? currentWeekIndexNumber : 0;
  }, []);

  const fetchAndMapScores = useCallback(async () => {
    let allScores: SportsScore[] = [];
    let currentScorePage = 1;
    let hasMoreScores = true;

    while (hasMoreScores) {
      const scoreResponse = await fetchScores(currentScorePage, 100);
      allScores = [...allScores, ...scoreResponse.data.list];
      hasMoreScores = scoreResponse.data.has_next;
      currentScorePage++;
    }

    const scoresMapping = allScores.reduce(
      (acc, score) => ({ ...acc, [score.event]: score }),
      {},
    );
    return scoresMapping;
  }, []);

  const fetchAndMapTeams = useCallback(async () => {
    let allTeams: SportsTeam[] = [];
    let currentTeamPage = 1;
    let hasMoreTeams = true;

    while (hasMoreTeams) {
      const teamResponse = await fetchTeams(currentTeamPage, 100);
      allTeams = [...allTeams, ...teamResponse.data.list];
      hasMoreTeams = teamResponse.data.has_next;
      currentTeamPage++;
    }

    const teamMap = allTeams.reduce(
      (acc, team) => ({
        ...acc,
        [team.api_team_id]: team,
      }),
      {},
    );
    return teamMap;
  }, []);

  const loadEvents = useCallback(
    async (
      currentPage: number,
      showLoading = true,
      currentMatches: any[] = matchesRef.current,
    ) => {
      if (!dataLoaded || isFetching.current) return;

      try {
        isFetching.current = true;

        if (!isRefreshing.current && currentPage === 1 && showLoading) {
          setLoading(true);
        }

        const response = await fetchEvents(currentPage, limit);

        const filteredEvents = filterEventsByWeek(
          response.data.list,
          selectedWeek,
        );

        const processedEvents = filteredEvents.map((event: SportsEvent) => {
          const homeTeam = teamsMap[event.home_team];
          const awayTeam = teamsMap[event.away_team];
          const scoreData = scoresMap[event.id];
          const isFinal = event.status === 'Final' || event.status === 'F/OT';
          const isScheduled = event.status === 'Scheduled';

          return {
            id: event.api_event_id.toString(),
            homeTeam: {
              name: homeTeam?.full_name || 'TBD',
              record: homeTeam?.record || '',
              logo:
                homeTeam?.logo_url ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/TBD_Logo_2019.svg/1200px-TBD_Logo_2019.svg.png',
              score: scoreData?.home_team_score.toString() || '0',
              hasPossession: false,
              GameOver: isFinal,
              hasNotPlayed: isScheduled,
            },
            awayTeam: {
              name: awayTeam?.full_name || 'TBD',
              record: awayTeam?.record || '',
              logo:
                awayTeam?.logo_url ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/TBD_Logo_2019.svg/1200px-TBD_Logo_2019.svg.png',
              score: scoreData?.away_team_score.toString() || '0',
              hasPossession: false,
              GameOver: isFinal,
              hasNotPlayed: isScheduled,
            },
            quarter: isFinal
              ? event.status
              : isScheduled
                ? new Date(event.start_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'numeric',
                    day: 'numeric',
                  })
                : event.status,
            timeRemaining: isScheduled
              ? new Date(event.start_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : '',
            network: 'MLB', // Updated to reflect MLB context
            downAndDistance: event.bet_over_under
              ? `OU: ${event.bet_over_under}`
              : '',
            finalOut: isFinal,
          };
        });

        if (isRefreshing.current || currentPage === 1) {
          setMatches(processedEvents);
          setShowEmptyMessage(processedEvents.length === 0);
        } else {
          const newEvents = processedEvents.filter(
            (event: any) => !currentMatches.some((m) => m.id === event.id),
          );
          setMatches((prev) => [
            ...prev,
            ...newEvents.map((event) => ({
              ...event,
              id: event.id.toString(),
              awayTeam: {
                ...event.awayTeam,
                hasPossession: false, // Ensure hasPossession is included
              },
            })),
          ]);
        }
        setHasNextPage(
          response.data.list.length >= limit && response.data.has_next,
        );
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events');
      } finally {
        if (!isRefreshing.current && currentPage === 1 && showLoading) {
          setLoading(false);
        }
        isFetching.current = false;
      }
    },
    [dataLoaded, limit, filterEventsByWeek, selectedWeek, teamsMap, scoresMap],
  );

  const initializeData = useCallback(async () => {
    if (isInitialized.current) return;

    try {
      isInitialized.current = true;

      if (!isRefreshing.current) {
        setLoading(true);
      }

      const timeframeResponse = await fetchTimeframes(1, 100);
      const sortedTimeframes = timeframeResponse.data.list.sort((a, b) => {
        if (a.season !== b.season) {
          return a.season - b.season;
        }
        return dayjs(a.start_at).diff(dayjs(b.start_at));
      });

      const [teamMap, scoresMapping] = await Promise.all([
        fetchAndMapTeams(),
        fetchAndMapScores(),
      ]);

      setTeamsMap(teamMap);
      setScoresMap(scoresMapping);

      const weeks = generateWeeksFromTimeframes(sortedTimeframes);
      setAvailableWeeks(weeks);

      const currentIndex = findCurrentWeekIndex(weeks);
      setCurrentWeekIndex(currentIndex);

      setSelectedWeek(null);
      setDataLoaded(true);
      setError(null);
    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Failed to initialize data');
      isInitialized.current = false;
    } finally {
      if (!isRefreshing.current) {
        setLoading(false);
      }
    }
  }, [
    fetchAndMapTeams,
    fetchAndMapScores,
    generateWeeksFromTimeframes,
    findCurrentWeekIndex,
  ]);

  // const handleRefresh = async () => {
  //   // setRefreshing(true);
  //   isRefreshing.current = true;
  //   isInitialized.current = false;
  //   setPage(1);
  //   setError(null);
  //   userScrolled.current = false;

  //   try {
  //     await initializeData();
  //     setSelectedWeek(null);
  //     await loadEvents(1, false, []);
  //   } catch (err) {
  //     console.error('Error refreshing data:', err);
  //     setError('Failed to refresh data');
  //   } finally {
  //     // setRefreshing(true);
  //     isRefreshing.current = false;
  //     userScrolled.current = true;
  //   }
  // };

  const handleWeekSelect = (week: WeekData) => {
    setShowEmptyMessage(false);
    const newSelectedWeek = selectedWeek?.id === week.id ? null : week;
    setSelectedWeek(newSelectedWeek);

    if (!newSelectedWeek) {
      const newCurrentIndex = findCurrentWeekIndex(availableWeeks);
      setCurrentWeekIndex(newCurrentIndex);
    }

    setMatches([]);
    setPage(1);
    setHasNextPage(true);
    loadEvents(1, false, []);
  };

  const matchesRef = useRef(matches);
  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (dataLoaded && !isRefreshing.current && !isFetching.current) {
      if (page === 1) {
        loadEvents(1, selectedWeek === null, []);
      } else {
        loadEvents(page, false, matchesRef.current);
      }
    }
  }, [page, dataLoaded, selectedWeek, loadEvents]);

  const handleLoadMore = () => {
    if (!userScrolled.current) return;

    if (hasNextPage && !isFetching.current && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const createStyles = (themeColors: ThemeColors) => {
    return StyleSheet.create({
      weekContainer: {
        flex: 1,
        paddingVertical: 8,
        backgroundColor: themeColors.appBG,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
      },
      emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: themeColors.text,
      },
      tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 2,
      },
      headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginTop: 40,
        backgroundColor: themeColors.appBG,
      },
      headerText: {
        color: themeColors.textWhite,
        fontSize: 16,
        fontWeight: 'bold',
      },
      iconButton: {
        paddingHorizontal: 6,
        marginLeft: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.charcoalBlue,
        borderRadius: 15,
        width: 30,
        height: 30,
      },
      calendarContainer: {
        paddingVertical: 5,
        paddingHorizontal: 6,
      },
    });
  };
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);

  if (loading && page === 1) {
    return (
      <View
        style={[
          themeStyles.flex1,
          themeStyles.appBG,
          themeStyles.justifyContentCenter,
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          themeStyles.flex1,
          themeStyles.appBG,
          themeStyles.justifyContentCenter,
        ]}
      >
        <Text
          style={[themeStyles.textDefault, themeStyles.justifyContentCenter]}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <GradientBackground>
      <Spacer multiplier={1} />
      <PlayHeader label="MLB" />
      <View style={styles.tabContainer}>
        <MLBTab />
      </View>
      <View style={styles.weekContainer}>
        <FlatList
          data={matches}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={
            <>
              <View style={styles.calendarContainer}>
                <WeeklyCalendar
                  availableWeeks={availableWeeks}
                  selectedWeek={selectedWeek}
                  onWeekSelect={handleWeekSelect}
                  currentWeekIndex={currentWeekIndex}
                />
              </View>
              <View style={styles.headerRow}>
                <Text style={styles.headerText}>NFL</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Icon
                      name="search"
                      size={15}
                      color={themeColors.textGreen}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Icon
                      name="reload"
                      size={15}
                      color={themeColors.textGreen}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
          ListEmptyComponent={
            showEmptyMessage ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, themeStyles.textDefault]}>
                  No matches found for this week
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => <PlayScoreCard match={item} />}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            userScrolled.current = true;
          }}
          ListFooterComponent={
            loading && hasNextPage ? (
              <ActivityIndicator size="small" style={themeStyles.mv2} />
            ) : null
          }
        />
      </View>
    </GradientBackground>
  );
}
