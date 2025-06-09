import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

type BackButtonProps = {
  onPress?: () => void;
};

/* A functional component that renders a back button with an onPress event.
 *
 * @param onPress - A function to be called when the button is pressed.
 * @returns Returns a TouchableOpacity component styled as a back button.
 */
const BackButton = ({ onPress }: BackButtonProps) => {
  const themeStyles = useThemeStyles();
  const navigation = useNavigation();

  const backHandler = () => {
    if (onPress) {
      onPress();
      return;
    }
    navigation.goBack();
  };

  return (
    <TouchableOpacity style={styles.iconContainer} onPress={backHandler}>
      <FontAwesome6
        name="chevron-left"
        size={16}
        style={themeStyles.textDefault}
        iconStyle="solid"
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
});

export default BackButton;
