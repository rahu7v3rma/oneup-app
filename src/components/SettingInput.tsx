import Icon from '@react-native-vector-icons/fontawesome6';
import { FC } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import { ISettingInput } from '../interfaces/settingInput.interface';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

export const InputItem: FC<ISettingInput> = ({
  title,
  style,
  handlePress,
  icon,
}) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.touchableContainer,
        { backgroundColor: themeColors.cardBG },
        style,
      ]}
      onPress={handlePress}
    >
      <View style={[styles.iconContainer]}>{icon}</View>
      <View style={[styles.titleContainer]}>
        <Text style={[styles.titleText, { color: themeColors.text }]}>
          {title}
        </Text>
      </View>
      <View style={[styles.arrowContainer]}>
        <Icon
          name="chevron-right"
          size={10}
          color={themeColors.text}
          iconStyle="solid"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    display: 'flex',
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: Fonts.WorkSansRegular,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 14,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginLeft: 'auto',
  },
});
