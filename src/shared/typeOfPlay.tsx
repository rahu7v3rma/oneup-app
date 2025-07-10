import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

type Option = 'SPREAD' | 'OVER/UNDER' | 'MONEYLINE';

interface TypeOfPlayProps {
  options: Option[];
  selected: Option;
  onChange: (value: Option) => void;
  containerStyle?: ViewStyle;
}

const TypeOfPlay: React.FC<TypeOfPlayProps> = ({
  options,
  selected,
  onChange,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            style={[styles.option, isActive && styles.activeOption]}
          >
            <Text style={[styles.optionText, isActive && styles.activeText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TypeOfPlay;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: darkColors.charcoalBlue,
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 15.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOption: {
    backgroundColor: darkColors.darkGreen,
    borderColor: darkColors.darkGreen,
    borderWidth: 1,
    borderRadius: 8,
  },
  optionText: {
    color: darkColors.textSupporting,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.InterSemiBold,
  },
  activeText: {
    fontSize: 12,
    color: darkColors.springGreen,
    fontWeight: '600',
    fontFamily: Fonts.InterSemiBold,
  },
});
