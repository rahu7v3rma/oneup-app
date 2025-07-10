import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Commanders, Eagles } from '../../assets/svgs';
import { darkColors, ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const PlayScoreCard = () => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Commanders />
            <Text style={[styles.teamNameText]}>Commanders</Text>
          </View>
          <Text style={styles.recordText}>4 - 8</Text>
        </View>

        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Eagles />
            <Text style={[styles.teamNameText, { color: darkColors.text }]}>
              Eagles
            </Text>
          </View>
          <Text style={styles.recordText}>4 - 8</Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.gameTimeBox}>
            <Text style={styles.gameDateText}>SUNDAY, 12/01</Text>
            <Text style={[styles.gameTimeText]}>1:00 PM</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.bettingRow}>
          <View style={styles.bettingBox}>
            <Text style={styles.bettingText}>+10</Text>
          </View>
          <View style={styles.bettingBox}>
            <Text style={styles.bettingText}>O40</Text>
          </View>
          <View style={styles.bettingBox}>
            <Text style={styles.bettingText}>+140</Text>
          </View>
        </View>

        <View style={styles.bettingRow}>
          <View style={styles.bettingBox}>
            <Text style={styles.bettingText}>-10</Text>
          </View>
          <View style={styles.bettingBox}>
            <Text style={styles.bettingText}>U40</Text>
          </View>
          <View style={styles.bettingBox}>
            <Text style={styles.bettingText}>+340</Text>
          </View>
        </View>
        <View style={styles.countdownBox}>
          <Text style={styles.startsInText}>STARTS IN</Text>
          <Text style={styles.countdownText}>08:32:30</Text>
        </View>
      </View>
    </View>
  );
};

const getStyles = (_themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#1D2129',
      borderRadius: 8,
      padding: 10,
      marginVertical: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    leftSection: {
      flex: 1,
      paddingRight: 16,
    },
    rightSection: {
      justifyContent: 'space-between',
    },
    teamRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    teamInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    teamNameText: {
      color: darkColors.textSupporting,
      fontSize: 12,
      lineHeight: 14,
      fontFamily: Fonts.InterSemiBold,
      marginLeft: 10,
      fontWeight: '600',
    },
    recordText: {
      color: darkColors.textSupporting,
      fontSize: 14,
      fontFamily: Fonts.InterMedium,
      marginRight: 10,
      fontWeight: '500',
    },
    bottomContainer: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    gameTimeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#292D37',
      borderRadius: 8,
      paddingHorizontal: 1,
      paddingVertical: 8,
      flex: 1,
    },
    gameDateText: {
      fontWeight: '500',
      color: darkColors.text,
      fontSize: 10,
      fontFamily: Fonts.InterMedium,
      textAlign: 'center',
    },
    gameTimeText: {
      marginLeft: 7,
      fontWeight: '600',
      color: darkColors.text,
      fontSize: 12,
      lineHeight: 14,
      fontFamily: Fonts.InterSemiBold,
      textAlign: 'center',
    },
    countdownBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#3D2A2A',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: 'center',
    },
    startsInText: {
      color: '#FD5064',
      fontSize: 10,
      lineHeight: 14,
      fontFamily: Fonts.InterMedium,
      fontWeight: '500',
    },
    countdownText: {
      marginLeft: 7,
      color: '#FD5064',
      fontSize: 12,
      lineHeight: 14,
      fontFamily: Fonts.InterSemiBold,
      fontWeight: '600',
    },
    bettingRow: {
      flexDirection: 'row',
      marginBottom: 8,
      gap: 10,
    },
    bettingBox: {
      height: 33,
      width: 44,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#292D37',
      borderRadius: 6,
    },
    bettingText: {
      color: darkColors.text,
      fontSize: 10,
      lineHeight: 14,
      fontFamily: Fonts.InterSemiBold,
      fontWeight: '600',
    },
  });
};

export default PlayScoreCard;
