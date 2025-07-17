import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Info } from '../../assets/svgs';
import { type ThemeColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeProvider';

import Text from './text';

const PlayTypeSelector = () => {
  const [selectedType, setSelectedType] = useState('SPREAD');
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  const types = ['SPREAD', 'OVER/UNDER', 'MONEYLINE'];

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Type of play</Text>
        <Info color={theme.themeColors.textSupporting} />
      </View>

      <View style={styles.buttonGroup}>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            style={[
              styles.button,
              selectedType === type && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                selectedType === type && styles.activeButtonText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginVertical: 30,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      gap: 4,
    },
    label: {
      color: themeColors.textSupporting,
      fontSize: 16,
    },
    buttonGroup: {
      flexDirection: 'row',
      borderRadius: 10,
      height: 45,
      alignItems: 'center',
      backgroundColor: themeColors.selectorBgColor,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 10,
    },
    activeButton: {
      backgroundColor: themeColors.transparentSpringGreen,
      borderColor: themeColors.dullGreen,
      borderWidth: 1,
    },
    buttonText: {
      color: themeColors.textSupporting,
      fontWeight: '600',
      fontFamily: 'Inter',
      fontSize: 10,
      lineHeight: 14,
    },
    activeButtonText: {
      color: themeColors.springGreen,
      fontWeight: 'bold',
    },
  });

export default PlayTypeSelector;
