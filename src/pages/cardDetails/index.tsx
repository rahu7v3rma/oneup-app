import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import BankIcon from '../../../assets/pngs/account_balance.png';
import MasterCardIcon from '../../../assets/pngs/mastercard.png';
import PayPalIcon from '../../../assets/pngs/paypalLogo.png';
import { RootNavigationProp } from '../../navigation';
import BackButton from '../../shared/backButton';
import ToggleSwitch from '../../shared/toggleSwitch';
import { lightColors, ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const CardDetails = ({
  cardNumber,
  cardExpiry,
  cardFee,
}: {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardFee: string;
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute();
  const { type: linkedAccountType, name } = route.params as {
    type: 'Mastercard' | 'Paypal' | 'Bank';
    name: string;
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={styles.backButtonText}>{linkedAccountType}</Text>
      </View>
      <View
        style={[
          styles.cardContainer,
          linkedAccountType === 'Paypal' && styles.cardContainerPaypal,
        ]}
      >
        <Text
          style={[
            styles.cardName,
            linkedAccountType === 'Paypal' && styles.paypalText,
          ]}
        >
          {name}
        </Text>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
        <Text style={styles.cardExpiry}>Exp: {cardExpiry}</Text>
        {linkedAccountType === 'Mastercard' && (
          <Image
            source={MasterCardIcon}
            style={[styles.icon, styles.cardIcon]}
          />
        )}
        {linkedAccountType === 'Paypal' && (
          <Image source={PayPalIcon} style={[styles.icon, styles.paypalIcon]} />
        )}
        {linkedAccountType === 'Bank' && (
          <Image source={BankIcon} style={[styles.icon, styles.bankIcon]} />
        )}
      </View>
      <View style={styles.cardDefaultMethodContainer}>
        <ToggleSwitch value={true} onValueChange={() => {}} />
        <Text style={styles.cardFundingMethodText}>
          Make this card your default funding method?
        </Text>
      </View>
      {linkedAccountType === 'Bank' ? (
        <View style={styles.cardDefaultMethodContainer}>
          <ToggleSwitch value={true} onValueChange={() => {}} />
          <Text style={styles.cardFundingMethodText}>
            Make this your default funding bank?
          </Text>
        </View>
      ) : (
        <View style={styles.cardFeesContainer}>
          <Text style={styles.cardFeeText}>Fee</Text>
          <Text style={styles.cardFeeAmountText}>{cardFee}</Text>
        </View>
      )}

      <Text style={styles.removeText}>Remove</Text>
    </View>
  );
};

export const CardDetailsPreview = () => {
  return (
    <CardDetails
      cardName="MasterCard"
      cardNumber="Card ending in 3726"
      cardExpiry="11/25"
      cardFee="3% for sending money with credit cards"
    />
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.appBG,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    backButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    backButtonText: {
      fontSize: 16,
      fontFamily: Fonts.RobotoRegular,
      color: themeColors.text,
    },
    cardContainer: {
      marginTop: 30,
      height: 200,
      backgroundColor: themeColors.cardBG,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 25,
      position: 'relative',
    },
    cardContainerPaypal: {
      backgroundColor: themeColors.textWhite,
    },
    cardName: {
      fontSize: 16,
      fontFamily: Fonts.WorkSansBold,
      color: themeColors.textWhite,
    },
    paypalText: {
      color: lightColors.text,
    },
    cardNumber: {
      marginTop: 5,
      fontSize: 14,
      fontFamily: Fonts.WorkSansMedium,
      color: themeColors.gray1,
    },
    cardExpiry: {
      fontSize: 14,
      fontFamily: Fonts.WorkSansMedium,
      color: themeColors.gray1,
      position: 'absolute',
      bottom: 40,
      left: 25,
    },
    icon: {
      position: 'absolute',
      bottom: 36,
      right: 30,
      objectFit: 'contain',
    },
    cardIcon: {
      width: 59,
      height: 59,
    },
    paypalIcon: {
      width: 72,
      height: 18,
    },
    bankIcon: {
      width: 24,
      height: 24,
    },
    cardFeesContainer: {
      marginTop: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardFeeSwitchContainer: {
      flexDirection: 'column',
      gap: 15,
    },
    cardFeeText: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansMedium,
      color: themeColors.gray1,
    },
    cardDefaultMethodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 30,
    },
    cardFeeAmountText: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansBold,
      color: themeColors.textWhite,
    },
    removeText: {
      fontSize: 16,
      fontFamily: Fonts.WorkSansMedium,
      color: themeColors.errorText,
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 20 : 50,
      alignSelf: 'center',
    },
    cardFundingMethodText: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.gray1,
    },
  });
};
export default CardDetails;
