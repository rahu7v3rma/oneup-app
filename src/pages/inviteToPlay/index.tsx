import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';

import { GradientBackground } from '../../components/GradientBackground';
import Button from '../../shared/button';
import CustomOddsInput from '../../shared/customOddsInput';
import PlayHeader from '../../shared/PlayHeader';
import PlayScoreCard from '../../shared/PlayScoreCard';
import Spacer from '../../shared/Spacer';
import TeamOdds from '../../shared/teamOdds';
import TypeOfPlay from '../../shared/typeOfPlay';
import { darkColors, lightColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

export default function InviteToPlay() {
  const [selectedPlay, setSelectedPlay] = useState<
    'SPREAD' | 'OVER/UNDER' | 'MONEYLINE'
  >('SPREAD');
  const [teamOdds, setTeamOdds] = useState<'PHL  +3.5' | 'WSH -3.5'>(
    'PHL  +3.5',
  );

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.scrollContainer}>
          <Spacer multiplier={0.1} />
          <PlayHeader label="Invite to play" />
          <View style={styles.container}>
            <PlayScoreCard />
            <View style={styles.playTypeContainer}>
              <Text style={styles.playText}>Type of play</Text>
              <TypeOfPlay
                options={['SPREAD', 'OVER/UNDER', 'MONEYLINE']}
                selected={selectedPlay}
                onChange={setSelectedPlay}
              />
            </View>
            <View style={styles.playTypeContainer}>
              <Text style={styles.playText}>Team odds</Text>
              <TeamOdds
                options={['PHL  +3.5', 'WSH -3.5']}
                selected={teamOdds}
                onChange={setTeamOdds}
              />
            </View>

            <CustomOddsInput />
            <View style={styles.devider} />

            <View style={styles.inviteToPlay}>
              <Text style={styles.playText}>Invite to play</Text>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#AAAAAA"
                style={styles.input}
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Message (optional)"
                placeholderTextColor="#AAAAAA"
                style={[styles.input, styles.messageInput]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <Button
              title="Continue"
              style={styles.gotItButton}
              textStyle={styles.gotItText}
              onPress={() => {}}
            />

            <View style={styles.footerText}>
              <Text style={styles.agreeText}>By entering you agree to our</Text>
              <Text style={styles.termsText}>
                Terms of Services & Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 16,
  },
  playTypeContainer: {
    marginTop: 30,
  },
  playText: {
    color: lightColors.textSupporting,
    marginBottom: 15,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
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
  devider: {
    borderBottomWidth: 1,
    borderColor: darkColors.charcoalBlue,
    marginVertical: 30,
  },
  inviteToPlay: {},
  input: {
    backgroundColor: darkColors.charcoalBlue,
    color: lightColors.slateGray,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    marginBottom: 16,
  },
  messageInput: {
    height: 120,
  },
  footerText: {
    marginBottom: 30,
    alignItems: 'center',
  },
  agreeText: {
    color: lightColors.slateGray,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Fonts.InterRegular,
    marginBottom: 1,
  },
  termsText: {
    color: lightColors.textGreen,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
  },
});
