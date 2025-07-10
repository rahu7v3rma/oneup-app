import { GradientBackground } from '@components/GradientBackground';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetRef } from '@shared/bottomSheet';
import Button from '@shared/button';
import ForwardButton from '@shared/forwardButton';
import Header from '@shared/header';
import PaymentSheet from '@shared/PaymentSheet';
import Text from '@shared/text';
import { RootNavigationProp } from 'navigation';
import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinkedAccount } from 'types/linkedAccount';

import { MasterCard } from '../../../assets/svgs';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

const linkedAccounts: LinkedAccount[] = [
  {
    id: '1',
    type: 'Mastercard',
    name: 'Mastercard',
    navigate: 'CardDetails',
    icon: <MasterCard width={36} height={25} />,
    cardNumber: '**** **** **** 1234',
    cardFee: '3%',
    cardExpiry: '02/28',
  },
  {
    id: '2',
    type: 'Paypal',
    name: 'Paypal',
    navigate: 'CardDetails',
    icon: <MasterCard width={36} height={25} />,
    cardNumber: 'paypal.account.2007',
    cardFee: '3%',
    cardExpiry: '03/26',
  },
  {
    id: '3',
    type: 'Bank',
    name: 'Bank',
    navigate: 'CardDetails',
    icon: <MasterCard width={36} height={25} />,
    cardNumber: '**** **** **** 9101',
    cardFee: '3%',
    cardExpiry: '04/30',
  },
];

const Wallet = () => {
  const theme = useTheme();
  const themeStyles = useThemeStyles();
  const styles = getStyles(theme.themeColors);

  const navigation = useNavigation<RootNavigationProp>();
  const [accounts, setAccounts] = useState(linkedAccounts);

  const ref = useRef<BottomSheetRef>(null);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <Header title="Wallet" />
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={[styles.balance, themeStyles.pt10]}>12, 500</Text>
        <View
          style={[
            themeStyles.flexRow,
            themeStyles.justifyContentBetween,
            themeStyles.mt4,
            themeStyles.mb16,
            themeStyles.gap2,
          ]}
        >
          <View style={themeStyles.flex1}>
            <Button
              title="Transfer"
              onPress={() => {
                navigation.navigate('TransferMoneyScreen' as never);
              }}
              color="secondary"
              size="lg"
              textStyle={themeStyles.springGreen}
            />
          </View>
          <View style={themeStyles.flex1}>
            <Button
              title="Add Money"
              onPress={() => {
                navigation.navigate('AddMoneyScreen' as never);
              }}
              size="lg"
            />
          </View>
        </View>
        <View
          style={[
            themeStyles.flexRow,
            themeStyles.justifyContentBetween,
            themeStyles.alignItemsCenter,
            themeStyles.mb3,
          ]}
        >
          <Text style={styles.linkedAccountsLabel}>Linked Accounts</Text>
          <LinearGradient
            colors={['#242B33', '#191B20']}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.plusButton}
          >
            <FontAwesome6
              name="plus"
              iconStyle="solid"
              size={11.25}
              style={themeStyles.springGreen}
              onPress={() => ref.current?.open()}
            />
          </LinearGradient>
        </View>
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          style={styles.accountList}
          renderItem={({ item }) => (
            <LinearGradient
              colors={['#151A20', '#141B22']}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={[themeStyles.mb1]}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation?.navigate({
                    name: item.navigate,
                    params: {
                      ...item,
                      onRemoveAccount: (id: string) => {
                        setAccounts((prev) =>
                          prev.filter((acc) => acc.id !== id),
                        );
                      },
                    },
                  })
                }
              >
                <View
                  style={[
                    styles.accountItem,
                    themeStyles.flexRow,
                    themeStyles.alignItemsCenter,
                  ]}
                >
                  <View style={styles.accountIcon}>{item.icon}</View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountType}>{item.name}</Text>
                    <Text style={styles.accountDetails}>{item.cardExpiry}</Text>
                  </View>
                  <View style={styles.arrowIcon}>
                    <ForwardButton
                      onPress={() => {}}
                      style={styles.arrowIcon}
                      size={15}
                      color="#2F363C"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          )}
          ListFooterComponent={<PaymentSheet ref={ref} />}
        />
      </SafeAreaView>
    </GradientBackground>
  );
};

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 5,
    },
    balanceLabel: {
      color: theme.text,
      fontSize: 13,
      fontFamily: Fonts.InterSemiBold,
      fontWeight: '600',
      lineHeight: 20,
    },
    balance: {
      color: theme.text,
      fontSize: 38,
      fontFamily: Fonts.InterSemiBold,
      lineHeight: 21.94,
      fontWeight: '600',
    },
    linkedAccountsLabel: {
      color: theme.text,
      fontFamily: Fonts.InterSemiBold,
      fontWeight: '600',
      fontSize: 13,
      lineHeight: 20,
    },
    plusButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
    },
    accountList: {
      flexGrow: 0,
      gap: 4,
      borderRadius: 8,
    },
    accountItem: {
      height: 80,
      gap: 10,
      paddingVertical: 15,
      paddingHorizontal: 10,
    },
    accountIcon: {
      width: 36,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accountInfo: {
      flexDirection: 'column',
    },
    accountType: {
      color: theme.textWhite,
      fontFamily: Fonts.InterSemiBold,
      fontWeight: '600',
      fontSize: 12,
      lineHeight: 14,
    },
    accountDetails: {
      color: theme.dimGray,
      fontSize: 12,
      fontFamily: Fonts.InterRegular,
      lineHeight: 14,
    },
    arrowIcon: {
      marginLeft: 'auto',
      verticalAlign: 'middle',
    },
  });
};

export default Wallet;
