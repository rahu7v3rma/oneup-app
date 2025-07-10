import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemeColors } from 'theme/colors';

import Text from '../../shared/text';
import { useTheme } from '../../theme/ThemeProvider';

const BalanceCard = ({ gold, green }: { gold: number; green: number }) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <View style={styles.wrapper}>
      <View style={styles.first}>
        <Text style={styles.balanceText}>{gold}</Text>
        <Image
          source={require('../../../assets/pngs/goldCoin.png')}
          style={styles.coin}
        />
      </View>
      <View style={styles.second}>
        <Text style={styles.greenText}>{green}</Text>
        <Image
          source={require('../../../assets/pngs/greenCoin.png')}
          style={[styles.greenCoin]}
        />
      </View>
    </View>
  );
};

export default BalanceCard;
const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderRadius: 8,
      marginBottom: 35,
      height: 80,
      marginHorizontal: 16,
      backgroundColor: theme.charcoalBlue,
    },
    first: { flexDirection: 'row', alignItems: 'center' },
    second: { flexDirection: 'row', alignItems: 'center' },

    balanceText: {
      fontSize: 38,
      lineHeight: 40,
      fontWeight: '600',
      letterSpacing: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    greenText: {
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '600',
      color: theme.textSupporting,
    },
    coin: {
      width: 27,
      height: 27,
      resizeMode: 'contain',
      marginLeft: 6,
    },
    greenCoin: {
      width: 20.5,
      height: 20.5,
      resizeMode: 'contain',
      marginLeft: 6,
    },
  });
};
