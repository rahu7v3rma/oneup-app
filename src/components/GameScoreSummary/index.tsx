import Text from '@shared/text';
import { StyleSheet, View } from 'react-native';

import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

import { ActionButtons } from './components/ActionButtons';
import { GameStatus, Team, TeamScore } from './components/Team';
import { LiveGameInfo, TeamStatistics } from './components/TeamStatistics';
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
    name: 'Washington Commanders',
    shortName: 'WSH',
    logo: 'https://marketplace.canva.com/EAFwVuBz834/1/0/1600w/canva-abstract-wolf-mascot-esports-gaming-logo-AKnQQS2sHKU.jpg',
    score: 8,
    record: { A: 8, B: 2 },
  },
  awayTeam: {
    name: 'Philadelphia Eagles',
    shortName: 'PHL',
    logo: 'https://marketplace.canva.com/EAFwVuBz834/1/0/1600w/canva-abstract-wolf-mascot-esports-gaming-logo-AKnQQS2sHKU.jpg',
    score: 7,
    record: { A: 10, B: 1 },
  },
  gameTime: new Date('2025-12-01T13:00:00'),
  status: 'before',
  liveGameInfo: {
    whichHalf: '1st',
    time: new Date('2025-12-01T13:00:00'),
    description: '1st & 10, WSH 16',
  },
  onBetPress: () => {
    console.log('Bet button pressed!');
  },
  onChatPress: () => {
    console.log('Chat button pressed!');
  },
  broadCasterName: 'CBS',
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
  const styles = getStyles(theme.themeColors);

  const gameLabel = getGameLabel(
    status,
    homeTeam.shortName,
    awayTeam.shortName,
  );
  return (
    <View>
      {/* Game Label */}
      <View style={styles.gameLabel}>
        <Text style={styles.gameLabelText}>{gameLabel}</Text>
      </View>

      {/* Team summary */}
      <View style={styles.teamsContainer}>
        <TeamScore team={homeTeam} isHomeTeam status={status} />

        {/* Game time statistics */}
        <TeamStatistics
          status={status}
          gameTime={gameTime}
          liveGameInfo={liveGameInfo}
          broadCasterName={broadCasterName}
        />

        <TeamScore team={awayTeam} isHomeTeam={false} status={status} lost />
      </View>

      {/* Action buttons */}
      <ActionButtons
        status={status}
        onBetPress={onBetPress}
        onChatPress={onChatPress}
      />

      <View style={styles.gameInfo}>
        {status === 'before' && <PreGame />}
        {/* {status === 'live' && <LiveGame />}
        {status === 'final' && <GameOver />} */}
      </View>
    </View>
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
    },
    gameLabelText: {
      fontFamily: Fonts.RobotoRegular,
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: 0,
      verticalAlign: 'middle',
      color: themeColor.text,
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
