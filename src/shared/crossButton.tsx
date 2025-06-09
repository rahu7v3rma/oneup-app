import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

type CrossButtonProps = {
  onPress: () => void;
};

/**
 * CrossButton Component
 *
 * A functional component that renders a cross (X) button, typically used for closing or dismissing a screen or modal.
 *
 * Features:
 * - Styled using theme-based colors for consistency across the app.
 * - Customizable `onPress` action to handle button interactions.
 *
 * Props:
 * @param {() => void} onPress - A callback function to be executed when the button is pressed.
 *
 * Styling:
 * - The button's border color and text color are dynamically applied based on the current theme.
 * - Padding and border radius are applied for proper alignment and appearance.
 *
 * @returns {JSX.Element} A styled TouchableOpacity component with a cross icon.
 */

const CrossButton = ({ onPress }: CrossButtonProps) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.iconContainer,
        {
          borderColor: themeColors.text,
        },
      ]}
      onPress={onPress}
    >
      <FontAwesome6
        name="xmark"
        size={16}
        color={themeColors.textSupporting}
        iconStyle="solid"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
});

export default CrossButton;
