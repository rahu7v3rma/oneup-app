import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemeColors } from 'theme/colors';

import { useTheme } from '../../theme/ThemeProvider';
import Text from '../text';

type Props = {
  title: string;
  onBack?: () => void;
  onMore?: () => void;
};

/**
 * A function component that renders a top bar with a title, back button, and more
 * button.
 *
 * @param title - The title to be displayed on the top bar.
 * @param onBack - A callback function that is triggered when the back button is
 *   pressed.
 * @param onMore - A callback function that is triggered when the more button is
 *   pressed.
 * @returns Returns a JSX element representing the top bar.
 */

const TopBar = ({ title, onBack, onMore }: Props) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={onBack} style={styles.iconWrapper}>
        <Image
          source={require('../../../assets/pngs/arrow-left.png')}
          style={[styles.icon]}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={onMore} style={styles.iconWrapper}>
        <Image
          source={require('../../../assets/pngs/more.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 25,
      backgroundColor: theme.charcoalBlueOpacity3,
    },
    iconWrapper: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    },

    title: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
    },
  });
};
