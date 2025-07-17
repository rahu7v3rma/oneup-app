import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ThemeColors } from 'theme/colors';

import { coinPacks, coinString } from '../../constants';
import BalanceCard from '../../shared/BuyCoins/BalanceCard';
import CoinPackCard from '../../shared/BuyCoins/CoinPackCard';
import TopBar from '../../shared/BuyCoins/TopBar';
import Text from '../../shared/text';
import { useTheme } from '../../theme/ThemeProvider';
import { GradientBackground } from '../../components/GradientBackground';
import Spacer from '../../shared/Spacer';
import Header from '../../shared/header';

type CoinPack = {
  id: string;
  amount: number;
  bonus: number;
  price: string;
  popular?: boolean;
};

const COIN_PACKS: CoinPack[] = coinPacks;

const BuyCoins = () => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  const balance = { gold: 12500, green: 2500 };

  return (
    <GradientBackground>
       <Spacer multiplier={1} />
    <View style={[styles.container]}>
       <Header title={coinString?.BUY_COINS_TITLE} />
      <Text style={styles.balance}>{coinString?.BALANCE_LABEL}</Text>

      <BalanceCard gold={balance.gold} green={balance.green} />

      <FlatList
        data={COIN_PACKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CoinPackCard
            amount={item.amount}
            bonus={item.bonus}
            price={item.price}
            popular={item.popular}
            onPress={() => {
              /* TODO: handle coin pack purchase */
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
    </GradientBackground>
  );
};

export default BuyCoins;

/**
 * A function to generate a StyleSheet based on the provided theme colors.
 *
 * @param theme - An object of type ThemeColors that defines the colors to be used
 *   in the StyleSheet.
 * @returns Returns a StyleSheet object created with the provided theme colors.
 */

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: theme.appBG,
    },
    balance: {
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '600',
      marginLeft: 16,
      marginBottom: 10,
      marginTop: 30,
    },
    title: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600',
      marginBottom: 20,
    },
    separator: {
      height: 1,
      width: '100%',
      backgroundColor: theme.secondary,
    },
    listContent: {
      paddingBottom: 32,
      marginHorizontal: 16,
    },
  });
};
