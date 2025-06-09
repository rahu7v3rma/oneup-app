import React from 'react';
import { StyleProp, StyleSheet, Text as RNText, TextStyle } from 'react-native';

import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

const Text = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) => {
  const { themeColors } = useTheme();
  return (
    <RNText style={[styles.text, { color: themeColors.textWhite }, style]}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.WorkSansMedium,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default Text;
