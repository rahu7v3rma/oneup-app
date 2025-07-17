import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { type ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

import Text from './text';

type TeamInfo = {
  teamLogo: React.ReactNode;
  teamName: string;
  odds: string;
};

type Props = {
  teamA: TeamInfo;
  teamB: TeamInfo;
};

const TeamOdds: FC<Props> = ({ teamA, teamB }) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Team Odds</Text>
      </View>
      <View style={styles.teamOddsContainer}>
        {[teamA, teamB].map(({ teamName, teamLogo, odds }) => {
          return (
            <View style={styles.teamInfo}>
              {teamLogo}
              <Text>{teamName}</Text>
              <Text>{odds}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    logo: {},
    container: {
      marginHorizontal: 16,
    },
    teamOddsContainer: {
      borderRadius: 8,
      backgroundColor: themeColors.selectorBgColor,
      height: 45,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    teamInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    label: {
      color: themeColors.textSupporting,
      fontSize: 16,
      marginBottom: 15,
    },
  });

export default TeamOdds;
