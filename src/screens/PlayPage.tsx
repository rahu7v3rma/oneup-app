import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { GradientBackground } from '../components/GradientBackground';
import Button from '../shared/button';
import PlayHeader from '../shared/PlayHeader';
import PlayScoreCard from '../shared/PlayScoreCard';
import Spacer from '../shared/Spacer';
import { darkColors, lightColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

export default function PlayPage() {
  return (
    <GradientBackground>
      <Spacer multiplier={0.1} />
      <PlayHeader label="Play" />
      <View style={styles.container}>
        <PlayScoreCard />
        <View style={styles.prohibitedWrapper}>
          <View style={styles.prohibitedContainer}>
            <Text style={styles.prohibitedTitle}>This state is prohibited</Text>
            <Text style={styles.prohibitedSubtitle}>
              Based on your location you aren’t allowed to play in this state
            </Text>
          </View>
        </View>
        <Button
          title="Got it"
          style={styles.gotItButton}
          textStyle={styles.gotItText}
          onPress={() => {}}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  prohibitedWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prohibitedContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  prohibitedTitle: {
    color: darkColors.text,
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 20,
    fontFamily: Fonts.InterBold,
    marginBottom: 15,
  },
  prohibitedSubtitle: {
    color: darkColors.slate,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Fonts.InterRegular,
    textAlign: 'center',
    lineHeight: 20,
  },
  gotItButton: {
    marginVertical: 32,
    paddingTop: 18,
    paddingBottom: 18,
  },
  gotItText: {
    fontWeight: '700',
    color: lightColors.midnight,
    fontSize: 13,
    lineHeight: 14,
    fontFamily: Fonts.InterBold,
  },
});
