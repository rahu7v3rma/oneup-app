import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { darkColors, lightColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface AddAccountButtonProps {
  onPress?: () => void;
}

const AddAccountButton: React.FC<AddAccountButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.plusContainer}>
      <Text style={styles.plus}>+</Text>
    </View>
    <Text style={styles.text}>Add an Account</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  plusContainer: {
    borderColor: lightColors.primary,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 10,
  },
  plus: {
    color: '#34C759',
    fontSize: 18,
  },
  text: {
    color: darkColors.text,
    marginLeft: 6,
    fontFamily: Fonts.WorkSansBold,
    fontSize: 12,
  },
});

export default AddAccountButton;
