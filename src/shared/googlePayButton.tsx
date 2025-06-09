import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

import { darkColors, lightColors } from '../theme/colors';

import Text from './text';

const screenWidth = Dimensions.get('window').width;
type GooglePayButtonProps = {
  onPress: () => void;
};
const GooglePayButton = ({ onPress }: GooglePayButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Add money with</Text>
      <Image
        source={require('../../assets/pngs/googleLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: darkColors.text,
    borderRadius: 8,
    paddingVertical: 16,
    width: screenWidth - 32,
    alignSelf: 'center',
    shadowColor: lightColors.text,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 20,
    fontFamily: 'none',
    fontWeight: '500',
    color: lightColors.text,
  },
  logo: {
    width: 61,
    height: 24,
    paddingTop: 3,
  },
});

export default GooglePayButton;
