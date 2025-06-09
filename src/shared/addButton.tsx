import Icon from '@react-native-vector-icons/ionicons';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';
import {ThemeColors} from '../theme/colors';

type AddButtonProps = {
  onPress?: () => void;
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/* A functional component that renders a forward button with an onPress event.
 *
 * @param onPress - Optional function to be called when the button is pressed.
 * @param size - A integer number to determine the size of the button.
 * @param color - Optional Color of the button icon.
 * @param style - Optional style object.
 * @returns Returns a TouchableOpacity component styled as a Add button.
 */
const AddButton = ({
  onPress,
  size,
  color,
  style = {},
}: AddButtonProps) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon
        name="add"
        size={size}
        color={color ?? theme.themeColors.textWhite}
        style={style}
      />
    </TouchableOpacity>
  );
};

const getStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'center',
      width: 36,
      height: 25,
      borderRadius:2,
      borderColor:themeColors.btnBG,
      borderWidth:1,
    },
  });
};

export default AddButton;
