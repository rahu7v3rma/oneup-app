import type React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { renderLogo } from '../../../utils/logoRenderer';

interface GameChatGameInfoProps {
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  gameDate: string;
  gameTime: string;
  gameType: string;
}

const GameChatGameInfo: React.FC<GameChatGameInfoProps> = ({
  homeTeam,
  awayTeam,
  homeTeamLogo,
  awayTeamLogo,
  gameDate,
  gameTime,
  gameType,
}) => {
  return (
    <View style={styles.gameInfo}>
      <View style={styles.teamsRow}>
        <View style={styles.teamBlock}>
          {renderLogo(homeTeamLogo, styles, 56, 56)}
          <Text style={styles.teamCode}>{homeTeam}</Text>
        </View>
        <View style={styles.separatorLine} />
        <View style={styles.timeBlock}>
          <Text style={styles.gameDate}>{gameDate}</Text>
          <Text style={styles.gameTime}>{gameTime}</Text>
          <Text style={styles.gameChannel}>{gameType}</Text>
        </View>
        <View style={styles.separatorLine} />
        <View style={styles.teamBlock}>
          {renderLogo(awayTeamLogo, styles, 56, 56)}
          <Text style={styles.teamCode}>{awayTeam}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamBlock: {
    alignItems: 'center',
  },
  teamCode: {
    marginTop: 4,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separatorLine: {
    width: 50,
    height: 2,
    backgroundColor: '#A4A4A4',
    marginHorizontal: 12,
  },
  timeBlock: {
    alignItems: 'center',
  },
  gameDate: {
    color: '#A4A4A4',
    fontSize: 12,
    marginBottom: 2,
  },
  gameTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  gameChannel: {
    color: '#A4A4A4',
    fontSize: 12,
  },
});

export default GameChatGameInfo;
