import { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { ISettingInput } from '../interfaces/settingInput.interface.ts';
import { Fonts } from '../theme/fonts.ts';
import { useTheme } from '../theme/ThemeProvider.tsx';

import { InputItem } from './SettingInput.tsx';

export interface IOptionsContainer {
  title: string;
  inputs: Array<ISettingInput>;
}
export const OptionsContainer: FC<IOptionsContainer> = ({ title, inputs }) => {
  const { themeColors } = useTheme();
  return (
    <View style={[{ backgroundColor: themeColors.appBG }]}>
      {title && (
        <View
          style={[
            { backgroundColor: themeColors.appBG },
            styles.titleContainer,
          ]}
        >
          <Text style={[{ color: themeColors.text }]}>{title}</Text>
        </View>
      )}
      <View
        style={[
          styles.optionsContainer,
          { backgroundColor: themeColors.cardBG },
        ]}
      >
        {inputs.map((item) => (
          <InputItem {...item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  titleContainer: {
    textAlign: 'center',
    paddingBottom: 9,
  },
  title: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 13,
    lineHeight: 14,
    letterSpacing: 0,
    fontWeight: 400,
  },
});
