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
};

export const lightColors: ThemeColors = {
  appBG: '#ffffff',
  blue1: '#0b0c3a',
  blue2: '#161c6b',
  // TODO: update colors for light theme based on the figma assets once it is available
  primary: '#04BA6A',
  secondary: '#1B2470',
  danger: '#EA5252',
  text: '#000000',
  cardBG: '#1B2470',
  btnBG: '#04BA6A',
  textWhite: '#050505',
  textSupporting: '#F5F5F5',
  mutedText: '#8F8184',
  gray1: '#8F8184',
  gray2: '#55537A',
  inputBG: '#1B2366',
  inputPlaceholderClr: '#8F8184',
  disabledBtnBG: '#9CBCAE',
  errorText: '#EA5252',
  inputBgColor: '#1B2366',
};

export const darkColors: ThemeColors = {
  primary: '#04BA6A',
  // blue color
  secondary: '#1B2470',
  danger: '#EA5252',
  appBG: '#141946',
  blue1: '#0b0c3a',
  blue2: '#161c6b',
  text: '#ffffff',
  cardBG: '#1B2470',
  btnBG: '#04BA6A',
  textWhite: '#F5F5F5',
  disabledBtnBG: '#9CBCAE',
  errorText: '#EA5252',
  inputBgColor: '#1B2366',
  textSupporting: '#F5F5F5',
  // gray color
  mutedText: '#8F8184',
  gray1: '#8F8184',
  gray2: '#55537A',
  inputBG: '#1B2366',
  inputPlaceholderClr: '#8F8184',
};
