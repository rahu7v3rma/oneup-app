export type ThemeColors = {
  appBG: string;
  text: string;
  cardBG: string;
  blue1: string;
  blue2: string;
  btnBG: string;
  primary: string;
  secondary: string;
  textWhite: string;
  disabledBtnBG: string;
  errorText: string;
  inputBgColor: string;
  danger: string;
  textSupporting: string;
  mutedText: string;
  inputBG: string;
  gray1: string;
  gray2: string;
  inputPlaceholderClr: string;
  midnight: string;
  textGreen: string;
  mintGreen: string;
  springGreen: string;
  slate: string;
  slateGray: string;
  charcoalBlue: string;
  darkGreen: string;

  // new theme colors
  appBGGradient: {
    backgroundColor: string;
    gradientStart: string;
    gradientEnd: string;
  };
  textDetail: string;
};

export const lightColors: ThemeColors = {
  appBG: '#ffffff',
  blue1: '#0b0c3a',
  blue2: '#161c6b',
  // TODO: update colors for light theme based on the figma assets once it is available
  primary: '#04BA6A',
  // secondary: '#1B2470',
  danger: '#EA5252',
  text: '#000000',
  cardBG: '#1B2470',
  btnBG: '#04BA6A',
  textWhite: '#050505',
  textSupporting: '#F5F5F5',
  // mutedText: '#8F8184',
  gray1: '#8F8184',
  gray2: '#55537A',
  inputBG: '#1B2366',
  inputPlaceholderClr: '#8F8184',
  disabledBtnBG: '#9CBCAE',
  errorText: '#EA5252',
  inputBgColor: '#1B2366',
  midnight: '#070F17',
  textGreen: '#26F07DCC',
  mintGreen: '#26F07D99',
  springGreen: '#26F07D',
  darkGreen: '#26F07D4D',
  slate: '#A1A2B0',
  slateGray: '#616376',
  charcoalBlue: '#161C23',

  // new theme colors
  appBGGradient: {
    backgroundColor: '#070F17',
    gradientStart: '#292F37',
    gradientEnd: '#070F17',
  },
  secondary: '#1B2470',

  //gray color
  mutedText: '#8F8184',
  textDetail: '#E6E7EC',
};

export const darkColors: ThemeColors = {
  primary: '#04BA6A',
  // blue color
  // secondary: '#1B2470',
  danger: '#EA5252',
  appBG: '#070F17',
  blue1: '#0b0c3a',
  blue2: '#161c6b',
  text: '#ffffff',
  cardBG: '#1B2470',
  btnBG: '#04BA6A',
  textWhite: '#F5F5F5',
  disabledBtnBG: '#9CBCAE',
  errorText: '#EA5252',
  inputBgColor: '#1B2366',
  // textSupporting: '#F5F5F5',
  // gray color
  // mutedText: '#8F8184',
  gray1: '#8F8184',
  gray2: '#55537A',
  inputBG: '#1B2366',
  inputPlaceholderClr: '#8F8184',
  midnight: '#070F17',
  textGreen: '#26F07DCC',
  mintGreen: '#26F07D99',
  springGreen: '#26F07D',
  darkGreen: '#26F07D4D',
  slate: '#A1A2B0',
  slateGray: '#616376',
  charcoalBlue: '#161C23',

  // new theme colors
  appBGGradient: {
    backgroundColor: '#070F17',
    gradientStart: '#292F37',
    gradientEnd: '#070F17',
  },
  secondary: '#161C23',

  //gray color
  mutedText: '#616376',
  textSupporting: '#9C9DA9',
  textDetail: '#E6E7EC',
};
