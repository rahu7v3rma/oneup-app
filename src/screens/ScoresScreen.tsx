import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeColors } from 'theme/colors';

import { useTheme } from '../../src/theme/ThemeProvider';
import { MatchCard } from '../shared/matchCard';
import WeeklyCalendar from '../shared/WeeklyCalendar';

const matches = [
  {
    homeTeam: {
      name: 'Commanders',
      record: '',
      logo: require('../../assets/png/washington-commanders-logo.png'),
      score: '35',
      hasPossession: false,
      GameOver: true,
      hasNotPlayed: false,
    },
    awayTeam: {
      name: 'Eagles',
      record: '',
      logo: require('../../assets/png/philadelphia-eagles-logo.png'),
      score: '35',
      hasPossession: true,
      GameOver: true,
      hasNotPlayed: false,
    },
    quarter: 'FINAL/OT',
    timeRemaining: '',
    network: '',
    downAndDistance: '',
    finalOut: true,
  },
  {
    homeTeam: {
      name: 'Commanders',
      record: '7-3',
      logo: require('../../assets/png/washington-commanders-logo.png'),
      score: '35',
      hasPossession: true,
      GameOver: false,
      hasNotPlayed: false,
    },
    awayTeam: {
      name: 'Eagles',
      record: '7-3',
      logo: require('../../assets/png/philadelphia-eagles-logo.png'),
      score: '35',
      hasPossession: false,
      GameOver: false,
      hasNotPlayed: false,
    },
    quarter: '4th Quarter',
    timeRemaining: '6:15',
    network: 'ESPN',
    downAndDistance: '4th and 10 on Eagles 35 yard line',
    finalOut: false,
  },
  {
    homeTeam: {
      name: 'Titans',
      record: '7-3',
      logo: require('../../assets/png/washington-commanders-logo.png'),
      score: '0',
      hasPossession: true,
      GameOver: false,
      hasNotPlayed: false,
    },
    awayTeam: {
      name: 'Falcons',
      record: '7-3',
      logo: require('../../assets/png/philadelphia-eagles-logo.png'),
      score: '20',
      hasPossession: false,
      GameOver: false,
      hasNotPlayed: false,
    },
    quarter: 'SUN, 12/01',
    timeRemaining: '1:00 PM',
    network: 'CBS',
    downAndDistance: 'Division Round Playoff',
    finalOut: false,
  },
  {
    homeTeam: {
      name: 'Titans',
      record: '7-3',
      logo: require('../../assets/png/washington-commanders-logo.png'),
      score: '20',
      hasPossession: true,
      GameOver: false,
      hasNotPlayed: false,
    },
    awayTeam: {
      name: 'Falcons',
      record: '7-3',
      logo: require('../../assets/png/philadelphia-eagles-logo.png'),
      score: '20',
      hasPossession: false,
      GameOver: false,
      hasNotPlayed: false,
    },
    quarter: 'SUN, 12/01',
    timeRemaining: '1:00 PM',
    network: 'CBS',
    downAndDistance: 'ou:48.5',
    finalOut: false,
  },
  {
    homeTeam: {
      name: 'Titans',
      record: '7-3',
      logo: require('../../assets/png/washington-commanders-logo.png'),
      score: '+200',
      hasPossession: true,
      GameOver: false,
      hasNotPlayed: false,
    },
    awayTeam: {
      name: 'Falcons',
      record: '7-3',
      logo: require('../../assets/png/philadelphia-eagles-logo.png'),
      score: '-200',
      hasPossession: false,
      GameOver: false,
      hasNotPlayed: false,
    },
    quarter: 'SUN, 12/01',
    timeRemaining: '1:00 PM',
    network: 'CBS',
    downAndDistance:
      'Concacaf Nations League A - Quarterfinal\nH: +285, D: +210, A: +100',
    finalOut: false,
  },
];

export default function ScoresScreen() {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scoreCardContainer}>
        <View style={styles.weeklyCalendar} />
        <WeeklyCalendar />
        <View style={styles.matchesContainer}>
          {matches.map((match, index) => (
            <MatchCard key={index} match={match} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { backgroundColor: colors.appBG, flex: 1 },
    scoreCardContainer: { flex: 1, paddingTop: 0 },
    matchesContainer: { paddingTop: 20 },
    weeklyCalendar: { paddingTop: 20 },
  });
