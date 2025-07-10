import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

import AmountInputBox from './amountInputBox';
import { OddsAmountSelector } from './oddsAmountSelector';

const CustomOddsInput = () => {
  const [amount, setAmount] = useState('50');
  const [chance, setChance] = useState('50');

  const handleChipSelect = (amt: number) => setAmount(String(amt));

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.switchLabel}>User custom odds</Text>
      </View>

      <Text style={styles.amountLabel}>Amount</Text>

      <View style={styles.inputRow}>
        <AmountInputBox label="Enter" value={amount} onChange={setAmount} />
        <AmountInputBox
          label="Chance to win"
          value={chance}
          onChange={setChance}
        />
      </View>

      <OddsAmountSelector
        selected={parseInt(amount)}
        onSelect={handleChipSelect}
      />
    </View>
  );
};

export default CustomOddsInput;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
  },
  switchLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  amountLabel: {
    color: darkColors.textSupporting,
    marginBottom: 15,
    fontSize: 12,
    fontFamily: Fonts.InterMedium,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});
