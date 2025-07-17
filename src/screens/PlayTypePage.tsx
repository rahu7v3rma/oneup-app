import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Commanders, Eagles } from '../../assets/svgs';
import { GradientBackground } from '../components/GradientBackground';
import { Button, PlayTypeSelector, TeamOdds } from '../shared';
import PlayHeader from '../shared/PlayHeader';
import PlayScoreCard from '../shared/PlayScoreCard';
import Spacer from '../shared/Spacer';
import { lightColors, ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

export default function PlayTypePage() {
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  return (
    <GradientBackground>
      <Spacer multiplier={0.1} />
      <PlayHeader label="Play" />
      <PlayScoreCard />
      <PlayTypeSelector />
      <View style={styles.teamOddsContainer}>
        <TeamOdds
          teamA={{ odds: '+3.5', teamLogo: <Eagles />, teamName: 'PHL' }}
          teamB={{ odds: '-3.5', teamLogo: <Commanders />, teamName: 'WSH' }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="CONTINUE"
          style={styles.continueBtn}
          textStyle={styles.continueText}
          onPress={() => {}}
        />
        <View style={styles.tcContainer}>
          <Text style={styles.tcInfo}>By entering you agree to our</Text>
          <Text style={styles.tc}>Terms of Services & Privacy Policy</Text>
        </View>
      </View>
    </GradientBackground>
  );
}

const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    footer: {
      position: 'absolute',
      bottom: 0,
      gap: 20,
      flexDirection: 'column',
      width: '100%',
      marginBottom: 10,
    },
    continueBtn: {
      marginHorizontal: 16,
      paddingVertical: 18,
    },
    continueText: {
      fontWeight: '700',
      color: lightColors.midnight,
      fontSize: 13,
      lineHeight: 14,
      fontFamily: Fonts.InterBold,
    },
    tcContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 5,
    },
    tcInfo: {
      color: themeColors.inputPlaceholderClr,
    },
    tc: {
      color: themeColors.textGreen,
    },
    teamOddsContainer: {},
  });
