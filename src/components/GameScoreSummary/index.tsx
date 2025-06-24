import { useRoute } from '@react-navigation/native';
import Text from '@shared/text';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useGameScoreWebSocket } from '../../hooks/useGameScoreWebSocket';
import {
  fetchTeamDetails,
  useSportSelectors,
  fetchEventDetails,
  resetTeams,
  resetScoreDetails,
} from '../../reducers/match';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { COMMON } from '../../utils/common';

import { ActionButtons } from './components/ActionButtons';
import { GameStatus, Team, TeamScore } from './components/Team';
import { LiveGameInfo, TeamStatistics } from './components/TeamStatistics';
import GameOver from './GameOver';
import LiveGame from './LiveGame';
import PreGame from './PreGame';

type GameScoreSummaryProps = {
  homeTeam: Team;
  awayTeam: Team;
  gameTime: Date;
  status: GameStatus;
  broadCasterName: string;
  liveGameInfo?: LiveGameInfo;
  onBetPress?: () => void;
  onChatPress?: () => void;
};

const getGameLabel = (
  _status: GameStatus,
  _homeTeam: string,
  _awayTeam: string,
) => {
  return _status === 'before' ? 'Preview' : `${_homeTeam} VS ${_awayTeam}`;
};

const GameScoreSummary = () => {
  const theme = useTheme();
  const themeStyles = useThemeStyles();
  const styles = getStyles(theme.themeColors);
  const route = useRoute();
  const dispatch = useDispatch();
  const { eventId } = route.params as { eventId: string };
  const { eventLoading, eventDetails, teams, teamLoading } =
    useSportSelectors();

  // Determine if WebSocket should be enabled (only for live games)
  const isLiveGame =
    eventDetails &&
    (eventDetails.status === 'Live' || eventDetails.status === 'InProgress');

  // Only construct the WebSocket URL if the game is live
  const webSocketUrl = isLiveGame
    ? `ws://${COMMON.websocketBaseUrl}/ws/event/${eventId}/`
    : null;

  const { isConnected, error } = useGameScoreWebSocket({
    eventId,
    wsUrl: webSocketUrl,
    enabled: !!isLiveGame,
  });

  useEffect(() => {
    if (__DEV__) {
      console.log(`[GameScoreSummary] WebSocket for event ${eventId}:`, {
        isLiveGame,
        isConnected,
        error,
        url: webSocketUrl,
      });
    }
  }, [eventId, isLiveGame, isConnected, error, webSocketUrl]);

  useEffect(() => {
    // When eventId changes, fetch new data. The cleanup function will handle resetting old data.
    dispatch(fetchEventDetails({ eventId }) as any);

    // Return a cleanup function that will run when eventId changes or the component unmounts
    return () => {
      dispatch(resetScoreDetails());
      dispatch(resetTeams());
    };
  }, [dispatch, eventId]);

  useEffect(() => {
    // Once we have event details, fetch the corresponding team details.
    if (eventDetails) {
      if (!teams || !teams[eventDetails.home_team]) {
        dispatch(fetchTeamDetails(eventDetails.home_team) as any);
      }
      if (!teams || !teams[eventDetails.away_team]) {
        dispatch(fetchTeamDetails(eventDetails.away_team) as any);
      }
    }
  }, [dispatch, eventDetails, teams]);

  // Show loading only on initial load, not on WebSocket updates
  const isInitialLoading = (eventLoading || teamLoading) && !eventDetails;

  if (isInitialLoading) {
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

  if (
    !eventDetails ||
    !teams ||
    !teams[eventDetails.home_team] ||
    !teams[eventDetails.away_team]
  ) {
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
          No Details Found
        </Text>
      </View>
    );
  }

  const scoresData = eventDetails.scores[0];

  const getMappedStatus = (status: string): GameStatus => {
    if (status === 'Final') return 'final';
    if (status === 'Live' || status === 'InProgress') return 'live';
    return 'before';
  };

  const gameStatus = getMappedStatus(eventDetails.status);
  const homeTeamData = teams[eventDetails.home_team];
  const awayTeamData = teams[eventDetails.away_team];
  const homeScore = scoresData?.home_team_score || 0;
  const awayScore = scoresData?.away_team_score || 0;

  const {
    status,
    homeTeam,
    awayTeam,
    gameTime,
    broadCasterName,
    liveGameInfo,
    onBetPress,
    onChatPress,
  }: GameScoreSummaryProps = {
    homeTeam: {
      name: homeTeamData.full_name,
      shortName: homeTeamData.short_name,
      logo: homeTeamData.logo_url,
      score: homeScore,
      record: { A: 8, B: 2 },
    },
    awayTeam: {
      name: awayTeamData.full_name,
      shortName: awayTeamData.short_name,
      logo: awayTeamData.logo_url,
      score: awayScore,
      record: { A: 8, B: 2 },
    },
    gameTime: new Date(eventDetails.start_at),
    status: gameStatus,
    liveGameInfo:
      gameStatus === 'live'
        ? {
            whichHalf: '1st',
            time: new Date(),
            description: '1st & 10, WSH 16',
          }
        : {
            whichHalf: '1st',
            time: new Date(),
            description: '1st & 10, WSH 16',
          },
    broadCasterName: 'CBS',
    onBetPress: () => {
      console.log('Bet button pressed!');
    },
    onChatPress: () => {
      console.log('Chat button pressed!');
    },
  };

  const gameLabel = getGameLabel(
    status,
    homeTeam.shortName,
    awayTeam.shortName,
  );

  return (
    <FlatList
      data={[]} // No actual list items
      ListHeaderComponent={
        <>
          {/* Game Label */}
          <View style={styles.gameLabel}>
            <Text style={styles.gameLabelText}>{gameLabel}</Text>
            {/* Optional: Show WebSocket connection status for debugging */}
            {__DEV__ && gameStatus === 'live' && (
              <Text
                style={[
                  styles.gameLabelText,
                  styles.debugConnectionStatusBase,
                  isConnected
                    ? styles.connectedStatus
                    : styles.disconnectedStatus,
                ]}
              >
                {isConnected ? '● Live' : '● Disconnected'}
              </Text>
            )}
          </View>

          {/* Team summary */}
          <View style={styles.teamsContainer}>
            <TeamScore team={homeTeam} isHomeTeam status={status} />
            <TeamStatistics
              status={status}
              gameTime={gameTime}
              liveGameInfo={liveGameInfo}
              broadCasterName={broadCasterName}
            />
            <TeamScore
              team={awayTeam}
              isHomeTeam={false}
              status={status}
              lost
            />
          </View>

          {/* Action buttons */}
          <ActionButtons
            status={status}
            onBetPress={onBetPress}
            onChatPress={onChatPress}
            eventId={eventId.toString()}
            gameTime={gameTime}
            homeTeamLogo={homeTeam.logo}
            awayTeamLogo={awayTeam.logo}
            homeTeamName={homeTeam.shortName}
            awayTeamName={awayTeam.shortName}
          />

          <View style={styles.gameInfo}>
            {status === 'before' && (
              <PreGame
                gameLabel={`${homeTeam.name} vs ${awayTeam.name}`}
                homeTeamLogo={homeTeam.logo}
                awayTeamLogo={awayTeam.logo}
                eventDetails={eventDetails}
              />
            )}
            {status === 'live' && (
              <LiveGame
                scores={scoresData}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
            )}
            {status === 'final' && (
              <GameOver
                scores={scoresData}
                awayTeam={awayTeam}
                homeTeam={homeTeam}
              />
            )}
          </View>
        </>
      }
      keyExtractor={(_, index) => `key-${index}`}
      renderItem={null}
      showsVerticalScrollIndicator={false}
    />
  );
};

const getStyles = (themeColor: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: themeColor.appBG,
    },
    gameLabel: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginBottom: 10,
      alignItems: 'center',
    },
    gameStatusText: {
      fontFamily: Fonts.RobotoRegular,
      fontSize: 12,
      lineHeight: 20,
      letterSpacing: 0,
      marginLeft: 8,
      verticalAlign: 'middle',
      color: themeColor.text,
    },
    gameLabelText: {
      fontFamily: Fonts.RobotoRegular,
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: 0,
      verticalAlign: 'middle',
      color: themeColor.text,
    },
    debugConnectionStatusBase: {
      fontSize: 12,
      marginLeft: 8,
    },
    connectedStatus: {
      color: 'green',
    },
    disconnectedStatus: {
      color: 'red',
    },
    teamsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '100%',
    },
    gameInfo: { marginTop: 25 },
  });

export default GameScoreSummary;
