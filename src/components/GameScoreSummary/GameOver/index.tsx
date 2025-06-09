import {
  GameRecapTable,
  GameRecapTableHeader,
} from '@components/GameRecapTable';
import ScoringSummary from '@components/ScoringSummary';
import { StyleSheet, View, Image } from 'react-native';

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

const GameOver = () => {
  return (
    <View>
      <View>
        <GameRecapTableHeader />
        <GameRecapTable data={demoTeamData} />
      </View>
      <View style={styles.scoringView}>
        <ScoringSummary />
      </View>
    </View>
  );
};

export default GameOver;

const styles = StyleSheet.create({ scoringView: { marginTop: 14 } });
