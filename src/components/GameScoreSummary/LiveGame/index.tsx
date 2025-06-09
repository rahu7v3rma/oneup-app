import QuarterScoreSummary from '@components/QuarterScoreSummary';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import {
  GameRecapTable,
  GameRecapTableHeader,
} from '../../../components/GameRecapTable';
import GameScoreBar from '../components/GameScoreBar';

const demoTeamData = [
  {
    image: (
      <Image
        source={require('../../../../assets/png/philadelphia-eagles-logo.png')}
        width={10}
        height={10}
      />
    ),
    teamName: 'Team A',
    record: '12-4',
    scores: [28, 35, 24, 41, 33, 25],
    total: 186,
  },
  {
    image: (
      <Image
        source={require('../../../../assets/png/washington-commanders-logo.png')}
        width={24}
        height={16}
      />
    ),
    teamName: 'Team B',
    record: '9-7',
    scores: [21, 18, 31, 25, 28, 23],
    total: 146,
  },
];

const scoreItems = [
  {
    label: 'Game 1: Team A vs Team B',
    homeValue: 35,
    awayValue: 28,
    isTime: false,
    reverse: false,
  },
  {
    label: 'Game 1: Team A vs Team B',
    homeValue: 35,
    awayValue: 28,
    isTime: false,
    reverse: false,
  },
];

const LiveGame = () => {
  return (
    <View>
      <View>
        <GameRecapTableHeader />
        <GameRecapTable data={demoTeamData} />
      </View>
      <ScrollView style={styles.recapView}>
        <QuarterScoreSummary />
      </ScrollView>
      <View>
        <GameScoreBar data={scoreItems} />
      </View>
    </View>
  );
};

export default LiveGame;

const styles = StyleSheet.create({ recapView: { marginTop: 25 } });
