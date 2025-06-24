import { useNavigation } from '@react-navigation/native';
import BackButton from '@shared/backButton';
import Button from '@shared/button';
import AccountCard from '@shared/walletComponents/AccountCard';
import AmountInputBox from '@shared/walletComponents/AmountInputBox';
import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { darkColors, lightColors, ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import TransferSpeedToggle from './TransferSpeedToggle';

const TransferMoneyScreen = () => {
  const themeStyles = useThemeStyles();
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  const navigation = useNavigation();
  const [amount, setAmount] = useState<number>(50);
  const [headerTitle, setHeaderTitle] = useState('Transfer Money');

  const handleTransferMoney = () => {
    if (headerTitle === 'Transfer Money Confirm') {
      navigation.goBack();
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: '$50 transferring to Bank',
      });
    } else {
      setHeaderTitle('Transfer Money Confirm');
    }
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onGoBack} />
        <Text style={styles.headerText}>Transfer Money</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AmountInputBox
          value={amount}
          inputType="transfer"
          onEditPress={() => {}}
          onChange={(value: number) => {
            setAmount(value);
          }}
        />
        {headerTitle === 'Transfer Money' && <TransferSpeedToggle />}

        <Text style={styles.label}>To</Text>
        <AccountCard
          icon={require('../../assets/png/masterCard.png')}
          name="America First Credit Union"
          subtext="Checking ••••2550"
          onPress={() => {}}
          isDivider={false}
        />
        <View
          style={[
            themeStyles.flexRow,
            themeStyles.justifyContentBetween,
            themeStyles.mt5,
          ]}
        >
          <Text style={styles.feetext}>Fee</Text>
          <Text style={styles.fee}>Free</Text>
        </View>
        <Text style={styles.note}>
          Transfers made after 7:00 PM ET or on weekends or holidays can take a
          little longer. All transfers are subject to review and might be
          delayed or stopped if there's an issue.
        </Text>
        <Button
          title={
            headerTitle === 'Transfer Money'
              ? `Transfer $${amount}`
              : `Confirm and Transfer $${amount}`
          }
          onPress={handleTransferMoney}
          color="primary"
          variant="solid"
          size="lg"
          style={styles.addButton}
          textStyle={styles.addPayText}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransferMoneyScreen;

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkColors.appBG,
      paddingTop: 5,
    },
    scrollContainer: {
      padding: 16,
      flexGrow: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      gap: 13,
      paddingHorizontal: 16,
    },
    headerText: {
      fontSize: 16,
      color: theme.text,
      fontFamily: Fonts.RobotoRegular,
      verticalAlign: 'middle',
      lineHeight: 20,
    },
    label: {
      color: darkColors.text,
      marginTop: 24,
      marginBottom: 8,
      fontSize: 13,
      fontFamily: Fonts.RobotoMedium,
    },
    note: {
      color: darkColors.text,
      marginTop: 20,
      marginBottom: 8,
      fontSize: 13,
      fontFamily: Fonts.RobotoRegular,
      paddingHorizontal: 3,
    },
    addButton: {
      marginTop: 80,
    },
    applePayButton: {
      backgroundColor: darkColors.text,
    },
    applePayText: {
      fontSize: 20,
      fontFamily: Fonts.WorkSansMedium,
      color: lightColors.text,
    },
    addPayText: {
      color: darkColors.text,
      fontSize: 15,
      fontFamily: Fonts.WorkSansSemiBold,
    },
    feeContainer: {},
    feetext: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansBold,
      color: darkColors.mutedText,
    },
    fee: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansMedium,
      color: darkColors.text,
    },
  });
};
