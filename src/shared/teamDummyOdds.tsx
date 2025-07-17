import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { Commanders, Eagles } from '../../assets/svgs';
import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

type Option = 'PHL  +3.5' | 'WSH -3.5';

interface TeamOddsProps {
  options: Option[];
  selected: Option | null;
  onChange: (value: Option) => void;
  containerStyle?: ViewStyle;
  toggalColor: any;
}

const TeamOdds: React.FC<TeamOddsProps> = ({
  options,
  selected,
  onChange,
  containerStyle,
  toggalColor
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            style={[styles.option, isActive && [styles.activeOption,{backgroundColor:toggalColor?'#27f07e25':'#FFD3410A',borderColor:toggalColor?'#27f07ebb':'#FFD34166'}]]}
          >
            {option === 'PHL  +3.5' ? <Eagles /> : <Commanders />}
            <Text style={[styles.optionText, isActive && [styles.activeText,{color:toggalColor?'#13f374d7':'#F9C240'}]]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TeamOdds;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: darkColors.charcoalBlue, // dark background
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 15.5,
    borderRadius: 10,
    flexDirection: 'row',
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
    fontWeight: '700',
    marginLeft: 7,
    fontFamily: Fonts.InterBold,
  },
  activeText: {
    fontSize: 12,
    color: darkColors.springGreen,
    fontWeight: '700',
    fontFamily: Fonts.InterBold,
  },
});
