import {
  KeyboardTypeOptions,
  StyleProp,
  TextInput,
  TextStyle,
} from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

type InputProps = {
  inputDetails: {
    style?: StyleProp<TextStyle>;
    placeholder?: string;
    placeholderTextColor?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    autoCorrect?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
  };
};

/**
 *
 * @param inputDetails - Details object for the input
 */
export default function Input({ inputDetails }: InputProps) {
  const styles = useThemeStyles();
  const theme = useTheme();

  const {
    placeholder = '',
    value = '',
    autoCapitalize = 'none',
    keyboardType = 'default',
    secureTextEntry = false,
    autoCorrect = false,
    placeholderTextColor = theme.themeColors.mutedText,
  } = inputDetails;

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={(text) => inputDetails?.onChangeText?.(text)}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={[inputDetails?.style, styles.input, styles.mb10]}
    />
  );
}
