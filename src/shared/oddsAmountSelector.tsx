import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

import Text from './text';

const chipAmounts = [25, 50, 100, 200];

export const OddsAmountSelector = ({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (amount: number) => void;
}) => {
  return (
    <View style={chipStyles.container}>
      {chipAmounts.map((amount) => {
        const isSelected = selected === amount;
        return (
          <TouchableOpacity
            key={amount}
            onPress={() => onSelect(amount)}
            style={[chipStyles.chip, isSelected && chipStyles.selectedChip]}
          >
            <Text
              style={[
                chipStyles.chipText,
                isSelected && chipStyles.selectedChipText,
              ]}
            >
              {amount}
            </Text>
            {isSelected ? (
              <Image
                source={require('../../assets/pngs/greenOdds.png')}
                style={chipStyles.coinIcon}
              />
            ) : (
              <Image
                source={require('../../assets/pngs/grayCoin.png')}
                style={chipStyles.coinIcon}
              />
            )}
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
    borderRadius: 8,
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
  coinIcon: {
    width: 12.5,
    height: 12.5,
  },
});
