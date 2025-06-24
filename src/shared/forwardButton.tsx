import Icon from '@react-native-vector-icons/ionicons';
import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type ForwardButtonProps = {
  onPress: () => void;
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/* A functional component that renders a forward button with an onPress event.
 *
 * @param onPress - A function to be called when the button is pressed.
 * @param size - A integer number to determine the size of the button.
 * @param color - Optional Color of the button icon.
 * @param style - Optional style object.
 * @returns Returns a TouchableOpacity component styled as a forward button.
 */
const ForwardButton = ({
  onPress,
  size,
  color,
  style = {},
}: ForwardButtonProps) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name="chevron-forward"
        size={size}
        color={color ?? theme.themeColors.textWhite}
        style={style}
      />
    </TouchableOpacity>
  );
};

export default ForwardButton;
