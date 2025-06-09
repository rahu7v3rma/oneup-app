import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const DEFAULT_PERCENT = 50;

/**
 * Represents a score metric item.
 */

type ScoreBarProps = {
  label: string;
  homeValue: number;
  awayValue: number;
  isTime?: boolean;
  reverse?: boolean;
};

/**
 * Props for Scores component.
 */

const convertSecondsToTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padEnd(2, '0');
  return `${minutes}:${seconds}`;
};

const calculatePercent = (
  { homeValue, awayValue }: { homeValue: number; awayValue: number },
  total: number,
) => {
  const homePercent = total > 0 ? (homeValue / total) * 100 : DEFAULT_PERCENT;
  const awayPercent = total > 0 ? (awayValue / total) * 100 : DEFAULT_PERCENT;
  return { homePercent, awayPercent };
};

/**
 * ScoreBar Component
 * Renders a list of stats or timers comparing home and away values.
 * Props:
 * - data: Array of score items to render (label, homeValue, awayValue, isTime flag).
 *
 * Example item:
 * {
 *   label: 'Possession',
 *   homeValue: 60,
 *   awayValue: 40,
 *   isTime: false,
 * }
 */

const ScoreBar = (data: ScoreBarProps) => {
  const theme = useTheme();

  const styles = getStyles(theme.themeColors);

  let homePercent;
  let awayPercent;
  let timerHomeValue;
  let timerAwayValue;

  let [homeBarStyle, awayBarStyle] = [styles.homeBar, styles.awayBar];

  const { homeValue, awayValue, isTime, reverse } = data;

  const values = { homeValue: homeValue, awayValue: awayValue };

  const total = homeValue + awayValue;

  if (isTime) {
    timerHomeValue = convertSecondsToTime(homeValue);
    timerAwayValue = convertSecondsToTime(awayValue);
  }

  const { homePercent: hPercent, awayPercent: aPercent } = calculatePercent(
    values,
    total,
  );

  if (reverse) {
    [homePercent, awayPercent] = [aPercent, hPercent];
    [homeBarStyle, awayBarStyle] = [awayBarStyle, homeBarStyle];
  } else {
    [homePercent, awayPercent] = [hPercent, aPercent];
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: 10 }}>
        <View style={styles.labelRow}>
          <Text style={styles.value}>
            {isTime ? timerHomeValue : homeValue}
          </Text>
          <Text style={styles.label}>{data.label.toUpperCase()}</Text>
          <Text style={styles.value}>
            {data.isTime ? timerAwayValue : data.awayValue}
          </Text>
        </View>

        <View style={styles.barBackground}>
          <View style={[homeBarStyle, { flex: homePercent }]} />
          <View style={styles.emptyBar} />
          <View style={[awayBarStyle, { flex: awayPercent }]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    label: {
      color: themeColors.gray1,
      fontFamily: Fonts.WorkSansRegular,
      fontSize: 8,
      lineHeight: 14,
    },
    barBackground: {
      flexDirection: 'row',
      height: 5,
      backgroundColor: themeColors.gray2,
    },
    homeBar: {
      backgroundColor: themeColors.btnBG,
    },
    emptyBar: {
      backgroundColor: themeColors.cardBG,
      width: 5,
    },
    awayBar: {
      backgroundColor: themeColors.gray2,
    },
    valueRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    value: {
      color: themeColors.gray1,
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0,
      fontFamily: Fonts.WorkSansRegular,
    },
  });
};

export default ScoreBar;
export type { ScoreBarProps };
