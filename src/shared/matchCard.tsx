import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ThemeColors } from 'theme/colors';

import PhiladelphiaEaglesLogo from '../../assets/pngs/philadelphia-eagles-logo.png';
import WashingtonCommandersLogo from '../../assets/pngs/washington-commanders-logo.png';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';
import { Match } from '../types/match';

import { TeamInfo } from './teamInfo';

interface Props {
  match: Match;
}

export const MatchCard: React.FC<Props> = ({ match }) => {
  const {
    homeTeam,
    awayTeam,
    quarter,
    timeRemaining,
    network,
    downAndDistance,
    finalOut,
  } = match;
  const themeStyles = useThemeStyles();
  return (
    <View style={[themeStyles.cardContainer, styles.container]}>
      <View style={styles.card}>
        <View style={styles.homeTeamContainer}>
          <TeamInfo team={homeTeam} />
          <View style={styles.divider} />
          <TeamInfo team={awayTeam} />
        </View>
        {!finalOut ? (
          <View style={[styles.infoRow]}>
            <View style={styles.info}>
              <Text style={[styles.subText, themeStyles.themeTextColor]}>
                {quarter}
              </Text>
              <Text style={[styles.timeText, themeStyles.themeTextColor]}>
                {timeRemaining}
              </Text>
            </View>
            <Text style={[styles.subText, themeStyles.themeTextColor]}>
              {network}
            </Text>
          </View>
        ) : (
          <View style={[styles.finalOut]}>
            <Text style={[themeStyles.themeTextColor, styles.finalOutText]}>
              FINAL/OT
            </Text>
          </View>
        )}
      </View>
      {!finalOut && (
        <Text style={[styles.bottomText, themeStyles.themeTextColor]}>
          {downAndDistance}
        </Text>
      )}
    </View>
  );
};

export const MatchCardPreview = () => {
  const theme = useTheme();
  const styles = matchCardStyles(theme.themeColors);
  return (
    <View style={styles.matchCard}>
      <MatchCard
        match={{
          homeTeam: {
            name: 'Commanders',
            record: '7-3',
            logo: WashingtonCommandersLogo,
            score: '35',
            hasPossession: false,
            GameOver: false,
            hasNotPlayed: false,
          },
          awayTeam: {
            name: 'Eagles',
            record: '7-3',
            logo: PhiladelphiaEaglesLogo,
            score: '35',
            hasPossession: true,
            GameOver: false,
            hasNotPlayed: false,
          },
          quarter: '4th Quarter',
          timeRemaining: '6:15',
          network: 'ESPN',
          downAndDistance: '4th and 10 on Eagles 35 yard line',
          finalOut: false,
        }}
      />
      <MatchCard
        match={{
          homeTeam: {
            name: 'Commanders',
            record: '7-3',
            logo: WashingtonCommandersLogo,
            score: '35',
            hasPossession: false,
            GameOver: false,
            hasNotPlayed: true,
          },
          awayTeam: {
            name: 'Eagles',
            record: '7-3',
            logo: PhiladelphiaEaglesLogo,
            score: '35',
            hasPossession: true,
            GameOver: true,
            hasNotPlayed: false,
          },
          quarter: '4th Quarter',
          timeRemaining: '6:15',
          network: 'ESPN',
          downAndDistance: '4th and 10 on Eagles 35 yard line',
          finalOut: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  homeTeamContainer: {
    flex: 1,
  },
  infoRow: {
    width: Dimensions.get('screen').width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 10,
    paddingLeft: 10,
  },
  info: { justifyContent: 'center', alignItems: 'center' },
  finalOut: {
    width: Dimensions.get('screen').width * 0.18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  subText: {
    fontSize: 7,
    fontFamily: Fonts.WorkSansRegular,
  },
  timeText: {
    fontFamily: Fonts.WorkSansBold,
    fontSize: 10,
    lineHeight: 14,
  },
  bottomText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: Fonts.WorkSansSemiBold,
    fontSize: 11,
    marginBottom: 5,
  },
  container: {
    paddingVertical: 15,
  },
  divider: {
    height: 3,
  },
  finalOutText: {
    fontSize: 12,
    fontFamily: Fonts.WorkSansSemiBold,
  },
});

const matchCardStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    matchCard: {
      flex: 1,
      paddingTop: 100,
      backgroundColor: colors.appBG,
      gap: 10,
    },
  });
