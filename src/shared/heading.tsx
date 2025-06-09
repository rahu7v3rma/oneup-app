import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

/* A functional component that renders a heading text with a specific style and
 * theme color.
 *
 * @param children - The text to be displayed in the heading.
 * @param style - Optional. The style properties to be applied to the heading
 *   text.
 * @returns Returns a Text component with the provided text and style.
 */
const Heading = ({
  children,
  style,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
}) => {
  const { themeColors } = useTheme();
  return (
    <Text style={[styles.heading, { color: themeColors.textWhite }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: Fonts.RobotoBold,
    fontSize: 31,
  },
});

export default Heading;
