import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

import Text from './text';

const Link = ({
  children,
  style,
  onPress,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={[styles.text, { color: themeColors.btnBG }, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    fontFamily: Fonts.WorkSansBold,
    fontSize: 15,
  },
});

export default Link;
