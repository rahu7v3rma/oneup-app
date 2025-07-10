import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

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
    <TouchableOpacity onPress={backHandler}>
      <Ionicons
        name="arrow-back-sharp"
        size={24}
        style={themeStyles.textMuted}
      />
    </TouchableOpacity>
  );
};
// const styles = StyleSheet.create({
//   iconContainer: {
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     alignSelf: 'flex-start',
//   },
// });

export default BackButton;
