import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

import AmountInputBox from './amountInputBox';
import { OddsAmountSelector } from './oddsAmountSelector';

interface CustomOddsInputProps {
  selectAmount: (amount: number) => void;
  toggalColor: boolean;
  currentBalance: number;
  selectedAmount: number;
  selectedCoinType: 'gold' | 'sweep';
}

const CustomOddsInput: React.FC<CustomOddsInputProps> = ({
  selectAmount,
  toggalColor,
  currentBalance,
  selectedAmount,
  selectedCoinType
}) => {
  const [amount, setAmount] = useState('0');
  const [chance, setChance] = useState('50');

  // Reset amount when coin type changes
  useEffect(() => {
    if (selectedAmount === 0) {
      setAmount('0');
    } else {
      setAmount(String(selectedAmount));
    }
  }, [selectedAmount, selectedCoinType]);

  const handleChipSelect = (amt: number) => {
    if (amt <= currentBalance) {
      selectAmount(amt);
      setAmount(String(amt));
    }
  };

  return (
    <View style={{flex:1,width:'100%',marginTop:30}}>
      <Text style={styles.amountLabel}>Amount</Text>

      <OddsAmountSelector
        key={selectedCoinType} // Force re-render when coin type changes
        selected={selectedAmount}
        onSelect={handleChipSelect}
        toggalColor={toggalColor}
        currentBalance={currentBalance}
        selectedCoinType={selectedCoinType}
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
    marginBottom: 11,
    gap: 5,
  },
});
