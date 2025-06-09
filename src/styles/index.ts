import { StyleSheet } from 'react-native';

import { darkColors, ThemeColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

import borderRadius from './borderRadius';
import display from './display';
import flex from './flex';
import positioning from './positioning';
import sizing from './sizing';
import spacing from './spacing';

export const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    ...flex,
    ...display,
    ...spacing,
    ...positioning,
    ...borderRadius,
    ...sizing,

    appBG: {
      backgroundColor: colors.appBG,
    },

    themeContainerColor: {
      backgroundColor: colors.appBG,
    },

    inputStyle: {
      backgroundColor: colors.inputBgColor,
    },

    // Start: Text Color

    textDefault: {
      color: colors.text,
    },
    themeBtnColor: {
      backgroundColor: colors.btnBG,
    },
    themeBtnTextColor: {
      color: colors.btnBG,
    },
    themeInputPlacholderColor: {
      color: colors.gray1,
    },
    outlineBtn: {
      borderColor: colors.btnBG,
      borderWidth: 2,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
    },

    textPrimary: {
      color: colors.primary,
    },
    themeGrayishBackground: {
      backgroundColor: colors.inputPlaceholderClr,
    },

    textSupporting: {
      color: colors.textSupporting,
    },

    textMuted: {
      color: colors.mutedText,
    },

    // End: Text Color

    // Start: Text Styles

    textAlignCenter: {
      textAlign: 'center',
    },

    textDefaultSmall: {
      fontFamily: Fonts.RobotoMedium,
      fontSize: 12,
      lineHeight: 16,
      color: colors.text,
    },

    textDefaultCustom: {
      fontFamily: Fonts.RobotoRegular,
      fontSize: 13,
      lineHeight: 14,
      color: colors.text,
    },

    textDefaultMedium: {
      fontFamily: Fonts.RobotoMedium,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },

    textDefaultLarge: {
      fontFamily: Fonts.RobotoBold,
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },

    textDefaultXXXLarge: {
      fontFamily: Fonts.RobotoBold,
      fontSize: 30,
      lineHeight: 36,
      color: colors.text,
    },

    textSupportingSmall: {
      fontFamily: Fonts.WorkSansRegular,
      fontSize: 12,
      lineHeight: 16,
      color: colors.textSupporting,
    },

    textSupportingMedium: {
      fontFamily: Fonts.WorkSansMedium,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSupporting,
    },

    textSupportingLarge: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontSize: 16,
      lineHeight: 24,
      color: colors.textSupporting,
    },

    fontWeightLight: {
      fontWeight: '300',
    },

    fontWeightNormal: {
      fontWeight: '400',
    },

    fontWeigthMedium: {
      fontWeight: '500',
    },

    fontWeightSemiBold: {
      fontWeight: '600',
    },

    fontWeightBold: {
      fontWeight: '700',
    },

    // End: Text Styles

    card: {
      padding: 16,
      backgroundColor: colors.secondary,
      borderRadius: 10,
    },

    themeTextColor: {
      color: colors.text,
    },

    feedUserAvatar: {
      height: 26,
      width: 26,
      borderRadius: 40,
    },

    feedImage: {
      height: 176,
      width: '100%',
    },
    logo: {
      alignSelf: 'center',
    },

    separatorLine: {
      width: 48,
      height: 1,
      backgroundColor: colors.mutedText,
    },

    backButton: {
      width: 33.42,
      height: 32.02,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.textSupporting,
    },
    input: {
      width: '100%',
      backgroundColor: colors.inputBG,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 15,
      fontFamily: Fonts.RobotoMedium,
      color: colors.textSupporting,
    },
    gameOverText: {
      color: colors.inputPlaceholderClr,
    },
    cardContainer: {
      backgroundColor: colors.cardBG,
      borderRadius: 16,
      marginBottom: 20,
      marginHorizontal: 20,
    },
    checkbox: {
      width: 16,
      height: 16,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkBoxBorder: {
      borderColor: colors.text,
      borderWidth: 1,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      fontFamily: Fonts.WorkSansMedium,
    },
    errorInputBorder: {
      borderColor: colors.danger,
      borderWidth: 1,
    },
    gap: {
      height: 14,
    },
    inputText: {
      fontFamily: Fonts.WorkSansMedium,
      fontSize: 15,
      color: colors.textSupporting,
    },
    truncationLink: {
      fontFamily: Fonts.WorkSansRegular,
      fontSize: 12,
      color: colors.primary,
    },
  });
};

export const defaultStyles = createStyles(darkColors);
export type ThemeStyles = typeof defaultStyles;
