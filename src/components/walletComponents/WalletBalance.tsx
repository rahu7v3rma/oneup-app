// components/WalletBalance.tsx
import { useNavigation } from '@react-navigation/native';
import Button from '@shared/button';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { darkColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Balance</Text>
      <View style={styles.labelContainer}>
        <Text style={styles.dollor}>$</Text>
        <Text style={styles.amount}>{balance.toLocaleString()}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          title="Transfer"
          variant="outline"
          size="sm"
          style={styles.button}
          onPress={() => {
            navigation.navigate('TransferMoneyScreen');
          }}
        />
        <Button
          size="sm"
          title="Add money"
          variant="solid"
          style={styles.button}
          onPress={() => {
            navigation.navigate('AddMoneyScreen');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.secondary,
    borderRadius: 10,
    padding: 16,
    margin: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    color: darkColors.text,
    marginBottom: 4,
    fontSize: 8,
    lineHeight: 14,
    fontFamily: Fonts.WorkSansSemiBold,
  },
  amount: {
    fontSize: 32,
    color: darkColors.text,
    marginBottom: 12,
    fontFamily: Fonts.WorkSansRegular,
  },
  dollor: {
    fontSize: 20,
    color: darkColors.text,
    marginBottom: 12,
    fontFamily: Fonts.WorkSansRegular,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
  },
});

export default WalletBalance;
