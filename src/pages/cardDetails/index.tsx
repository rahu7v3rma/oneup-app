import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '@shared/button';
import CheckboxField from '@shared/Checkboxfield';
import Header from '@shared/header';
import { Formik } from 'formik';
import React from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LinkedAccount } from 'types/linkedAccount';
import * as Yup from 'yup';

import { MasterLogo, PayPalLogo, BankLogo } from '../../../assets/svgs';
import { RootNavigationProp } from '../../navigation';
import { lightColors, ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

const CardDetails = () => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const themeStyles = useThemeStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute();
  const { name, onRemoveAccount, id, type, cardNumber, cardExpiry, cardFee } =
    route.params as LinkedAccount & {
      onRemoveAccount: (id: string) => void;
    };

  const getCardOrAccount = () => {
    if (type === 'Mastercard') {
      return 'card';
    } else {
      return 'account';
    }
  };

  const getLogo = () => {
    if (type === 'Mastercard') {
      return <MasterLogo />;
    } else if (type === 'Paypal') {
      return <PayPalLogo />;
    } else {
      return <BankLogo />;
    }
  };

  return (
    <View style={styles.container}>
      <Header title={type} />
      <View
        style={[
          themeStyles.flexRow,
          themeStyles.justifyContentBetween,
          themeStyles.mb3,
        ]}
      >
        <Text style={styles.cardAccountTitle}>Your {getCardOrAccount()}</Text>
        <Text style={styles.percentFee}>
          <Text style={styles.percent}>{cardFee}</Text> fee
        </Text>
      </View>
      <LinearGradient
        colors={['#151A20', '#141B22']}
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.linearGradient}
      >
        <View style={styles.card}>
          <Text style={styles.cardName}>{name}</Text>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
          <View
            style={[
              themeStyles.flexRow,
              themeStyles.justifyContentBetween,
              themeStyles.alignItemsCenter,
              themeStyles.mt11,
            ]}
          >
            <View>
              <Text style={styles.expires}>Expires</Text>
              <Text style={styles.cardExpiry}>{cardExpiry}</Text>
            </View>
            <View>{getLogo()}</View>
          </View>
        </View>
      </LinearGradient>

      <Button
        title="Remove"
        style={styles.removeButton}
        textStyle={styles.removeBtnText}
        size="lg"
        color="secondary"
        onPress={() => {
          Alert.alert(
            'Remove Card',
            'Are you sure you want to remove this card?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Remove',
                style: 'destructive',
                onPress: () => {
                  onRemoveAccount(id); // <- update the list in Wallet
                  navigation.goBack();
                },
              },
            ],
          );
        }}
      />
      <Formik
        initialValues={{ defaultPayingMethod: false }}
        onSubmit={() => {}}
        validationSchema={Yup.object().shape({
          defaultPayingMethod: Yup.boolean()
            .oneOf([true], 'You must acknowledge the Default paying method')
            .required('Required'),
        })}
      >
        {() => (
          <CheckboxField
            name="defaultPayingMethod"
            label="Default paying method"
            textStyle={styles.checkboxText}
            containerStyle={themeStyles.mt6}
          />
        )}
      </Formik>
      {type === 'Bank' && (
        <Formik
          initialValues={{ defaultFundingBank: false }}
          onSubmit={() => {}}
          validationSchema={Yup.object().shape({
            defaultFundingBank: Yup.boolean()
              .oneOf([true], 'You must acknowledge the default funding bank')
              .required('Required'),
          })}
        >
          {() => (
            <CheckboxField
              name="defaultFundingBank"
              label="Make this default funding bank"
              textStyle={styles.checkboxText}
              containerStyle={themeStyles.mt6}
            />
          )}
        </Formik>
      )}
    </View>
  );
};

export const CardDetailsPreview = () => {
  return <CardDetails />;
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.appBG,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    cardAccountTitle: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 20,
      color: themeColors.textWhite,
    },
    percentFee: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 20,
      color: themeColors.dimGray,
    },
    percent: {
      color: themeColors.springGreen,
    },
    linearGradient: {
      height: 180,
      borderRadius: 8,
    },
    card: {
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    cardName: {
      fontSize: 17,
      fontFamily: Fonts.InterSemiBold,
      fontWeight: '600',
      lineHeight: 20,
      color: themeColors.textWhite,
    },
    paypalText: {
      color: lightColors.text,
    },
    cardNumber: {
      paddingTop: 25,
      fontSize: 18,
      lineHeight: 20,
      fontFamily: Fonts.InterMedium,
      fontWeight: '500',
      color: themeColors.gray1,
    },
    expires: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      lineHeight: 14,
      color: themeColors.dimGray,
    },
    cardExpiry: {
      fontSize: 18,
      lineHeight: 20,
      fontFamily: Fonts.InterMedium,
      fontWeight: '500',
      color: themeColors.textWhite,
      paddingTop: 3,
    },
    removeButton: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 20 : 50,
      width: '100%',
      alignSelf: 'center',
    },
    removeBtnText: {
      color: themeColors.roseRed,
    },
    checkboxText: {
      fontFamily: Fonts.InterRegular,
      fontWeight: '400',
      fontSize: 14,
      lineHeight: 14,
      color: themeColors.slate,
    },
  });
};
export default CardDetails;
