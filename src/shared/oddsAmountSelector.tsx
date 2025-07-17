import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

import Text from './text';

const chipAmounts = [25, 50, 100, 200];

export const OddsAmountSelector = ({
  selected,
  onSelect,
  toggalColor,
  selectedCoinType,
  currentBalance
}: {
  selected: number;
  onSelect: (amount: number) => void;
  toggalColor: any;
  selectedCoinType: 'gold' | 'sweep';
  currentBalance?: number;
}) => {
  
  const getCoinImage = () => {
    return selectedCoinType === 'sweep' 
      ? require('../../assets/pngs/greenCoin.png')
      : require('../../assets/pngs/goldCoin.png');
  };

  return (
    <View style={chipStyles.container}>
      {chipAmounts.map((amount) => {
        const isSelected = selected === amount;
        const isDisabled = currentBalance !== undefined && amount > currentBalance;
        
        return (
          <TouchableOpacity
            key={amount}
            onPress={() => !isDisabled && onSelect(amount)}
            style={[
              chipStyles.chip, 
              isSelected && [
                chipStyles.selectedChip,
                {
                  backgroundColor: toggalColor ? '#27f07e25' : '#FFD3410A',
                  borderColor: toggalColor ? '#27f07ebb' : '#FFD34166'
                }
              ],
              isDisabled && chipStyles.disabledChip
            ]}
            disabled={isDisabled}
          >
            <Text
              style={[
                chipStyles.chipText,
                isSelected && [
                  chipStyles.selectedChipText,
                  {
                    color: toggalColor ? '#13f374d7' : '#F9C240'
                  }
                ],
                isDisabled && chipStyles.disabledChipText
              ]}
            >
              {amount}
            </Text>
            <Image
              source={getCoinImage()}
              style={[
                chipStyles.coinIcon,
                isDisabled && chipStyles.disabledCoinIcon
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const chipStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: darkColors.charcoalBlue,
    borderRadius: 4,
    paddingVertical: 9.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedChip: {
    backgroundColor: darkColors.darkGreen,
    borderColor: darkColors.darkGreen,
    borderWidth: 1,
    borderRadius: 4,
  },
  disabledChip: {
    opacity: 0.5,
  },
  chipText: {
    color: darkColors.textSupporting,
    fontSize: 14,
    fontFamily: Fonts.InterSemiBold,
    fontWeight: '600',
    marginRight: 1,
  },
  selectedChipText: {
    fontSize: 14,
    color: darkColors.springGreen,
    fontWeight: '600',
    fontFamily: Fonts.InterSemiBold,
  },
  disabledChipText: {
    opacity: 0.5,
  },
  coinIcon: {
    width: 12.5,
    height: 12.5,
    marginLeft: 2
  },
  disabledCoinIcon: {
    opacity: 0.5,
  },
});
