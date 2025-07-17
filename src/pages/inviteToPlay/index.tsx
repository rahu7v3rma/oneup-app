import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import { GradientBackground } from '../../components/GradientBackground';
import Button from '../../shared/button';
import CustomOddsInput from '../../shared/customOddsInput';
import PlayHeader from '../../shared/PlayHeader';
import PlayScoreCard from '../../shared/PlayScoreCard';
import Spacer from '../../shared/Spacer';
import TeamOdds from '../../shared/teamDummyOdds';
import TypeOfPlay from '../../shared/typeOfPlay';
import { darkColors, lightColors } from '../../theme/colors';
import BuyNow from '../../shared/BuyNow';
import { Fonts } from '../../theme/fonts';
import { useNavigation } from '@react-navigation/native';

export default function InviteToPlay() {
  const navigation = useNavigation();
  const [selectedPlay, setSelectedPlay] = useState<
    'SPREAD' | 'OVER/UNDER' | 'MONEYLINE' | null
  >(null);
  const [teamOdds, setTeamOdds] = useState<'PHL  +3.5' | 'WSH -3.5' | null>(
    null,
  );
  const [userCustomOdds, setUserCustomOdds] = useState(false);
  const [buy_coins, setBuy_coins] = useState(true);
  const [toggalColor, setToggalColor] = useState(false);
  const [selAmount, setSelAmount] = useState(0);
  
  // Coin balances - these will be fetched later
  const [goldCoinBalance, setGoldCoinBalance] = useState(75); // Gold coin balance
  const [sweepCoinBalance, setSweepCoinBalance] = useState(150); // Sweep coin balance
  const [selectedCoinType, setSelectedCoinType] = useState<'gold' | 'sweep'>('gold'); // Track which coin type is selected

  const MAX_BET_AMOUNT = 200;

  const getCurrentBalance = () => {
    return selectedCoinType === 'gold' ? goldCoinBalance : sweepCoinBalance;
  };

  const shouldShowBuyNow = () => {
    return getCurrentBalance() < MAX_BET_AMOUNT;
  };

  // Reset buy_coins state when coin type changes
  useEffect(() => {
    setBuy_coins(shouldShowBuyNow());
  }, [selectedCoinType, goldCoinBalance, sweepCoinBalance]);

  const handlePlayTypeSelect = (play: 'SPREAD' | 'OVER/UNDER' | 'MONEYLINE') => {
    setSelectedPlay(play);
    // Reset subsequent selections when play type changes
    setTeamOdds(null);
    setSelAmount(0);
    setBuy_coins(shouldShowBuyNow());
  };

  const handleTeamOddsSelect = (odds: 'PHL  +3.5' | 'WSH -3.5') => {
    setTeamOdds(odds);
    // Reset amount selection when team odds change
    setSelAmount(0);
    setBuy_coins(shouldShowBuyNow());
  };

  const handleAmountSelect = (amount: number) => {
    setSelAmount(amount);
    setBuy_coins(false);
  };

  const handleCoinTypeChange = (type: 'gold' | 'sweep') => {
    setSelectedCoinType(type);
    // Reset amount selection when coin type changes
    setSelAmount(0);
  };

  const isFormComplete = () => {
    return selectedPlay && teamOdds && selAmount > 0;
  };

  const getContinueButtonStyle = () => {
    const isComplete = isFormComplete();
    return {
      backgroundColor: isComplete 
        ? (buy_coins ? darkColors.charcoalBlue : lightColors.textGreen)
        : darkColors.charcoalBlue,
      borderColor: darkColors.charcoalBlue,
      opacity: isComplete ? 1 : 0.5,
    };
  };

  const getContinueButtonTextStyle = () => {
    const isComplete = isFormComplete();
    return {
      color: isComplete 
        ? (buy_coins ? lightColors.slateGray : '#070F17')
        : lightColors.slateGray,
      opacity: isComplete ? 1 : 0.6,
    };
  };
  const handlePlusButtonPress = () => {
    navigation.navigate('BuyCoin' as never);
  };
  return (
    <GradientBackground>
       <Spacer multiplier={1} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <Spacer multiplier={0.1} />
            <PlayHeader 
              label="Invite to play" 
              toggalCallBack={(value) => setToggalColor(value)}
              goldCoinBalance={goldCoinBalance}
              sweepCoinBalance={sweepCoinBalance}
              selectedCoinType={selectedCoinType}
              onCoinTypeChange={handleCoinTypeChange}
            />
            <View style={styles.container}>
              <PlayScoreCard />
              
              {/* Type of Play - Always visible */}
              <View style={styles.playTypeContainer}>
                <Text style={styles.playText}>Type of play</Text>
                <TypeOfPlay
                  options={['SPREAD', 'OVER/UNDER', 'MONEYLINE']}
                  selected={selectedPlay}
                  onChange={handlePlayTypeSelect}
                  toggalColor={toggalColor}
                />
              </View>

              {/* Team Odds - Only visible when play type is selected */}
              {selectedPlay && (
                <View style={styles.playTypeContainer}>
                  <Text style={styles.playText}>Team odds</Text>
                  <TeamOdds
                    options={['PHL  +3.5', 'WSH -3.5']}
                    selected={teamOdds}
                    onChange={handleTeamOddsSelect}
                    toggalColor={toggalColor}
                  />
                </View>
              )}

              {/* Amount Selection - Only visible when team odds is selected */}
              {selectedPlay && teamOdds && (
                <CustomOddsInput 
                  key={`${selectedCoinType}-${getCurrentBalance()}`} // Force re-render when coin type or balance changes
                  toggalColor={toggalColor}
                  selectAmount={handleAmountSelect}
                  currentBalance={getCurrentBalance()}
                  selectedAmount={selAmount}
                  selectedCoinType={selectedCoinType}
                />
              )}

              {/* Buy Now - Only visible when user balance is less than max bet amount (200) */}
              {selectedPlay && teamOdds && shouldShowBuyNow() && (
                <BuyNow 
                  onPress={handlePlusButtonPress}
                  buy_coins={buy_coins}
                  selAmount={selAmount}
                  balanceWarning={`Your balance is low.`}
                />
              )}

              {/* Invite Form - Only visible when not buying coins and all selections made */}
              {!buy_coins && selectedPlay && teamOdds && selAmount > 0 && (
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
              )}
            </View>
          </ScrollView>

          {/* Fixed bottom section */}
          <View style={styles.bottomSection}>
            <Button
              title="CONTINUE"
              style={[styles.gotItButton, getContinueButtonStyle()]}
              textStyle={[styles.gotItText, getContinueButtonTextStyle()]}
              onPress={() => {
                if (isFormComplete()) {
                  // Handle continue action
                  console.log('Continue pressed');
                }
              }}
              disabled={!isFormComplete()}
            />

            <View style={styles.footerText}>
              <Text style={styles.agreeText}>By entering you agree to our</Text>
              <Text style={styles.termsText}>
                Terms of Services & Privacy Policy
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
    color:darkColors.textSupporting,
    marginBottom: 15,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    backgroundColor: 'transparent',
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
  inviteToPlay: {marginTop:30},
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
    marginBottom: 0,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: lightColors.textGreen,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "transparent",
    borderRadius: 2,
  },
  checkboxText: {
    color: lightColors.slateGray,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts.InterMedium,
  },
  checkmark: {
    color: lightColors.textGreen,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
