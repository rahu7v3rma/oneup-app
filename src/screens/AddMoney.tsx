import { useNavigation } from '@react-navigation/native';
import Button from '@shared/button';
import GooglePayButton from '@shared/googlePayButton';
import Spacer from '@shared/Spacer';
import AccountCard from '@shared/walletComponents/AccountCard';
import AmountInputBox from '@shared/walletComponents/AmountInputBox';
import AmountSelector from '@shared/walletComponents/AmountSelector';
import DividerWithText from '@shared/walletComponents/DivderWithText';
import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import BackButton from '../shared/backButton';
import { darkColors, lightColors, ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const AddMoneyScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  const navigation = useNavigation();
  const [amount, setAmount] = useState(50);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [headerTitle, setHeaderTitle] = useState('Add Money');

  const handleAddMoney = () => {
    if (headerTitle === 'Add Money Confirm') {
      navigation.goBack();
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: `$${amount.toFixed(2)} Added to Wallet`,
      });
    } else {
      setIsConfirmed(true);
      setHeaderTitle('Add Money Confirm');
    }
  };

  const handleGooglePay = () => {
    // Google Pay logic
  };

  const handleApplePay = () => {
    // Apple Pay logic
  };

  const handleEdit = () => {
    // Allow editing by resetting confirmation state
    setIsConfirmed(false);
    setHeaderTitle('Add Money');
  };

  const handleAmountChange = (newAmount: number) => {
    // Update the amount state if the input is valid
    if (newAmount > 0) {
      setAmount(newAmount);
    } else {
      setAmount(0); // Reset to 0 or handle invalid input as needed
    }
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spacer />
      <View style={styles.header}>
        <BackButton onPress={onGoBack} />
        <Text style={styles.headerText}>{headerTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AmountInputBox
          inputType="addmoney"
          value={amount}
          editable={!isConfirmed}
          onEditPress={handleEdit}
          onChange={handleAmountChange}
        />
        {!isConfirmed && (
          <AmountSelector
            selected={amount}
            onSelect={setAmount}
            options={[25, 50, 100, 200]}
          />
        )}

        <Text style={styles.label}>From</Text>
        <AccountCard
          icon={require('../../assets/png/masterCard.png')}
          name="Mastercard"
          subtext="Ending in 1884"
          onPress={() => {}}
          isDivider={false}
        />
        <Text style={styles.note}>
          Transfers made after 7:00 PM ET or on weekends or holidays can take a
          little longer. All transactions are subject to review.
        </Text>
        <Button
          title={
            headerTitle === 'Add Money'
              ? `Add $${amount.toFixed(2)}`
              : `Confirm and Add $${amount.toFixed(2)}`
          }
          onPress={handleAddMoney}
          color="primary"
          variant="solid"
          size="lg"
          style={styles.addButton}
          textStyle={styles.addPayText}
        />
        {headerTitle === 'Add Money' && (
          <>
            <DividerWithText />
            {Platform.OS === 'ios' ? (
              <Button
                title={'Add money with  Pay'}
                onPress={handleApplePay}
                color="secondary"
                variant="solid"
                size="lg"
                style={styles.applePayButton}
                textStyle={styles.applePayText}
              />
            ) : (
              <GooglePayButton onPress={handleGooglePay} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddMoneyScreen;

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.appBG,
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
      fontFamily: 'none',
      fontWeight: '500',
      color: lightColors.text,
    },
    addPayText: {
      color: darkColors.text,
      fontSize: 15,
      fontFamily: Fonts.WorkSansSemiBold,
    },
  });
};
