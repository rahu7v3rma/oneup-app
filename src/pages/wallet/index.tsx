import { useNavigation } from '@react-navigation/native';
import React, { JSX, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Bank, MasterCard, Paypal } from '../../../assets/svgs';
import PaymentSheet from '../../components/PaymentSheet';
import AddButton from '../../shared/addButton';
import BackButton from '../../shared/backButton';
import { BottomSheetRef } from '../../shared/bottomSheet';
import ForwardButton from '../../shared/forwardButton';
import Text from '../../shared/text';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { RootNavigationProp } from '../resetPassword';

const linkedAccounts: {
  id: string;
  type: string;
  navigate: 'CardDetails';
  name: string;
  details: string;
  icon: JSX.Element;
}[] = [
  {
    id: '1',
    type: 'Mastercard',
    name: 'Mastercard',
    navigate: 'CardDetails',
    details: 'Ending in 1884',
    icon: <MasterCard width={36} height={25} />,
  },
  {
    id: '2',
    type: 'Mastercard',
    name: 'Mastercard',
    navigate: 'CardDetails',
    details: 'Ending in 1984',
    icon: <MasterCard width={36} height={25} />,
  },
  {
    id: '3',
    type: 'Paypal',
    name: 'Paypal',
    navigate: 'CardDetails',
    details: 'smijus2004',
    icon: <Paypal width={36} height={25} />,
  },
  {
    id: '2',
    type: 'Bank',
    name: 'America First Credit Union',
    navigate: 'CardDetails',
    details: 'Ending in 1884',
    icon: <Bank width={30} height={25} />,
  },
];

const Wallet = () => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  const navigation = useNavigation<RootNavigationProp>();

  const onGoBack = () => {
    navigation.goBack();
  };

  const onAccountPress = () => {};
  const ref = useRef<BottomSheetRef>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={onGoBack} />
        <Text style={styles.headerText}>Wallet</Text>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={styles.balanceAmountContainer}>
            <Text>$</Text>
            <Text style={styles.balanceAmount}>12,500.00</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.transferButton, styles.balanceActionButtons]}
            onPress={() => {
              navigation.navigate('TransferMoneyScreen' as never);
            }}
          >
            <Text style={[styles.transferText, styles.balanceButtonText]}>
              Transfer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addMoneyButton, styles.balanceActionButtons]}
            onPress={() => {
              navigation.navigate('AddMoneyScreen' as never);
            }}
          >
            <Text style={[styles.addMoneyText, styles.balanceButtonText]}>
              Add money
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.linkedAccountsLabel}>Linked Accounts</Text>

      <FlatList
        data={linkedAccounts}
        keyExtractor={(item) => item.id}
        style={styles.accountList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate({
                name: item.navigate,
                params: item,
              })
            }
          >
            <View style={styles.accountItem}>
              <View style={styles.accountIcon}>{item.icon}</View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountType}>{item.name}</Text>
                <Text style={styles.accountDetails}>{item.details}</Text>
              </View>
              <View style={styles.arrowIcon}>
                <ForwardButton
                  onPress={onAccountPress}
                  style={styles.arrowIcon}
                  size={20}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addAccount}
            onPress={() => ref.current?.open()}
          >
            <AddButton
              onPress={() => ref.current?.open()}
              size={20}
              color={theme.themeColors.btnBG}
            />
            <Text style={styles.addAccountText}>Add an Account</Text>
            <PaymentSheet ref={ref} />
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

const getStyles = (theme: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.blue1,
      paddingHorizontal: 16,
      paddingTop: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 25,
      gap: 13,
    },
    headerText: {
      fontSize: 16,
      color: theme.text,
      fontFamily: Fonts.RobotoRegular,
      verticalAlign: 'middle',
      lineHeight: 20,
    },
    balanceCard: {
      backgroundColor: theme.cardBG,
      borderRadius: 10,
      flexDirection: 'column',
      gap: 27,
      paddingHorizontal: 10,
      paddingVertical: 15,
      marginBottom: 25,
    },
    balanceInfo: {
      flexDirection: 'column',
      gap: 2,
    },
    balanceLabel: {
      color: theme.text,
      fontSize: 8,
      fontFamily: Fonts.WorkSansSemiBold,
      lineHeight: 14,
      letterSpacing: 0,
    },
    balanceAmountContainer: {
      flexDirection: 'row',
    },
    balanceAmount: {
      color: theme.text,
      fontSize: 20,
      letterSpacing: 0,
      fontFamily: Fonts.WorkSansRegular,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 5,
    },
    balanceActionButtons: {
      borderWidth: 1,
      flex: 1,
      width: '50%',
      paddingVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 8,
    },
    transferButton: {
      borderColor: theme.btnBG,
    },
    addMoneyButton: {
      backgroundColor: theme.btnBG,
    },
    transferText: {
      color: theme.btnBG,
      fontFamily: Fonts.InterBold,
      fontSize: 12,
      lineHeight: 16,
    },
    addMoneyText: {
      color: theme.text,
    },
    balanceButtonText: {
      fontFamily: Fonts.InterBold,
      fontSize: 12,
      lineHeight: 16,
    },
    linkedAccountsLabel: {
      color: theme.text,
      fontFamily: Fonts.RobotoRegular,
      fontSize: 13,
      lineHeight: 14,
      marginBottom: 10,
    },
    accountList: {
      padding: 10,
      flexGrow: 0,
      backgroundColor: theme.blue2,
      gap: 4,
      borderRadius: 12,
    },
    accountItem: {
      flexDirection: 'row',
      gap: 10,
      borderBottomColor: theme.gray1,
      borderBottomWidth: 1,
      paddingVertical: 10,
    },
    accountIcon: {
      width: 36,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accountType: {
      color: theme.textWhite,
      fontFamily: Fonts.WorkSansMedium,
      fontSize: 12,
      lineHeight: 14,
      letterSpacing: 0,
      verticalAlign: 'middle',
    },
    accountInfo: {
      flexDirection: 'column',
    },
    accountDetails: {
      color: theme.textWhite,
      fontSize: 10,
      fontFamily: Fonts.WorkSansLight,
      verticalAlign: 'middle',
      lineHeight: 14,
      letterSpacing: 0,
    },
    arrowIcon: {
      marginLeft: 'auto',
      verticalAlign: 'middle',
    },
    addAccount: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 0,
    },
    addAccountText: {
      color: theme.textWhite,
      marginLeft: 10,
      fontFamily: Fonts.WorkSansMedium,
      fontSize: 12,
    },
  });
};

export default Wallet;
