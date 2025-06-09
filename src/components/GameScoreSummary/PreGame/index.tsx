import { StyleSheet, View } from 'react-native';

import Eagle from '../../../../assets/svgs/eagle';
import Text from '../../../shared/text';
import { Fonts } from '../../../theme/fonts';
import PreGameScoreBar from '../components/GameScoreBar';
import ScoreTable, { ScoreItem } from '../components/ScoreTable';

// Dummy icon function
const sampleIcon = () => <Eagle />;

const demoData: Array<ScoreItem> = [
  {
    icon: sampleIcon,
    spread: '+3.5',
    total_points: '47.5',
    money_line: '+150',
  },
  {
    icon: sampleIcon,
    spread: '-7.0',
    total_points: '54.0',
    money_line: '-200',
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
];

const PreGame = () => {
  const styles = getStyles();
  return (
    <View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Betting Lines</Text>
        <ScoreTable tableData={demoData} />
      </View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Spread</Text>
        <PreGameScoreBar data={scoreItems} />
      </View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Total Points</Text>
        <PreGameScoreBar data={scoreItems} />
      </View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Moneyline</Text>
        <PreGameScoreBar data={scoreItems} />
      </View>
    </View>
  );
};

export default PreGame;

const getStyles = () =>
  StyleSheet.create({
    dataView: { marginBottom: 9 },
    heading: {
      fontSize: 13,
      marginBottom: 9,
      fontFamily: Fonts.RobotoMedium,
      fontWeight: 400,
    },
  });
