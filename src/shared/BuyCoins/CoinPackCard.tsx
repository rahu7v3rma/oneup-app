import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ThemeColors } from 'theme/colors';

import Button from '../../shared/button';
import Text from '../../shared/text';
import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  amount: number;
  bonus: number;
  price: string;
  popular?: boolean;
  onPress: () => void;
};

const CoinPackCard = ({ amount, bonus, price, popular, onPress }: Props) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Image
          source={require('../../../assets/pngs/coin.png')}
          style={styles.coin}
        />
        {popular && (
          <Image
            source={require('../../../assets/pngs/mostPopular.png')}
            style={styles.ribbon}
          />
        )}
        <View style={styles.balance}>
          <Text style={styles.amountText}>{amount.toLocaleString()} </Text>
          <View style={styles.oneUpTextView}>
            <Image
              source={require('../../../assets/pngs/1up.png')}
              style={styles.oneUp}
            />
            <Text style={styles.label}>coins</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <LinearGradient
          colors={['#76FFB1', '#26F07D', '#26F07D', '#34B36B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.priceWrapper}
        >
          <Button
            title={price}
            variant="solid"
            color="primary"
            onPress={onPress}
            style={styles.transparentBtn}
            textStyle={styles.priceTxt}
          />
        </LinearGradient>
        <View style={styles.bonusView}>
          <Text style={styles.bonusText}>+{bonus}</Text>
          <Image
            source={require('../../../assets/pngs/greenCoin.png')}
            style={[styles.greenCoin]}
          />
          <Text style={styles.free}>free</Text>
        </View>
      </View>
    </View>
  );
};

export default CoinPackCard;

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 6,
      height: 90,
    },
    left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    coin: { width: 46, height: 46 },
    amountText: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.text,
      lineHeight: 25,
    },
    label: { fontSize: 14, fontWeight: '400', color: theme.slate },
    ribbon: {
      position: 'absolute',
      left: -30,
      top: 20,
      width: 82,
      height: 22,
      resizeMode: 'contain',
      marginLeft: 8,
    },
    right: { alignItems: 'center' },
    priceWrapper: {
      borderRadius: 8,
      overflow: 'hidden',
    },
    transparentBtn: {
      borderWidth: 0,
      backgroundColor: 'transparent',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    priceTxt: {
      fontWeight: '700',
      fontSize: 13,
    },
    oneUpTextView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balance: {
      marginLeft: 25,
    },
    oneUp: {
      width: 30,
      height: 21,
    },
    bonusView: {
      flexDirection: 'row',
      marginTop: 12,
    },
    bonusText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    free: {
      fontSize: 14,
      fontWeight: '400',
      color: theme.slate,
    },
    greenCoin: {
      width: 20.5,
      height: 20.5,
      resizeMode: 'contain',
      marginHorizontal: 3,
    },
  });
};
