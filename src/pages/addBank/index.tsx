import { useNavigation, useRoute } from '@react-navigation/native';
import valid from 'card-validator';
import { Formik } from 'formik';
import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ThemeColors } from 'theme/colors';
import * as Yup from 'yup';

import { Button, InputField, ToggleSwitch } from '../../shared';
import Text from '../../shared/text';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { RootNavigationProp } from '../forgotPassword';

type Props = Record<string, never>;

const AddBank: FunctionComponent<Props> = ({}: Props) => {
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute();
  const { addingType } = route.params as { addingType: 'card' | 'bank' };

  const themeStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);

  const validationSchema = Yup.object().shape({
    routingNumber: Yup.string().required('Please enter routing number'),
    accountNumber: Yup.string().required('Please enter account number'),
    cardNumber: Yup.string()
      .required('Please enter card number')
      .test('test-card-number', 'Invalid card number', (value) => {
        const validation = valid.number(value || '');
        return validation.isValid;
      }),
    expiration: Yup.string()
      .required('Please enter expiration')
      .test('test-expiry', 'Invalid expiry date', (value) => {
        const validation = valid.expirationDate(value || '');
        return validation.isValid;
      }),
    cvv: Yup.string()
      .required('Please enter cvv')
      .test('test-cvv', 'Invalid CVV', function (value) {
        const { cardNumber } = this.parent;
        const cardData = valid.number(cardNumber || '');
        const codeSize = cardData.card ? cardData.card.code.size : undefined;
        const validation = valid.cvv(value || '', codeSize);
        return validation.isValid;
      }),
    zipcode: Yup.string().required('Please enter zipcode'),
  });

  const handleAddBank = () => {
    Toast.show({
      text1: 'Card added Successfully',
      position: 'bottom',
      type: 'success',
    });
  };

  return (
    <View
      style={[
        themeStyles.p4,
        themeStyles.themeContainerColor,
        themeStyles.flex1,
      ]}
    >
      <View style={[themeStyles.mb12, themeStyles.flexRow]}>
        <TouchableOpacity
          style={[themeStyles.pAbsolute]}
          onPress={() => navigation?.pop()}
        >
          <Text style={styles.headerText}>Cancel</Text>
        </TouchableOpacity>
        <View style={[themeStyles.flex1, themeStyles.alignItemsCenter]}>
          <Text style={[styles.headerText]}>
            Add {addingType === 'bank' ? 'Bank' : 'Card'}
          </Text>
        </View>
      </View>
      <Formik
        initialValues={{
          routingNumber: '',
          accountNumber: '',
          cardNumber: '',
          cvv: '',
          expiration: '',
          zipcode: '',
          defaultFundingMethod: true,
          defaultFundingBank: true,
        }}
        onSubmit={handleAddBank}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            {addingType === 'bank' && (
              <>
                <View style={themeStyles.mb4}>
                  <InputField
                    name="routingNumber"
                    placeholder="Routing Number"
                    value={values.routingNumber}
                    onChange={handleChange('routingNumber')}
                    errorMessage={
                      touched.routingNumber ? errors.routingNumber : undefined
                    }
                   numbersOnly={true}
                  />
                </View>
                <View style={themeStyles.mb4}>
                  <InputField
                    name="accountNumber"
                    placeholder="Account Number"
                    value={values.accountNumber}
                    onChange={handleChange('accountNumber')}
                    errorMessage={
                      touched.accountNumber ? errors.accountNumber : undefined
                    }
                   numbersOnly={true}
                  />
                </View>
              </>
            )}

            {addingType === 'card' && (
              <>
                <View style={themeStyles.mb4}>
                  <InputField
                    name="cardNumber"
                    placeholder="Debt or Credit Card Number"
                    value={values.cardNumber}
                    onChange={handleChange('cardNumber')}
                    errorMessage={
                      touched.cardNumber ? errors.cardNumber : undefined
                    }
                    numbersOnly={true}
                  />
                </View>
                <View style={[themeStyles.flexRow, themeStyles.mb4]}>
                  <InputField
                    containerStyle={[themeStyles.flex1, themeStyles.mr4]}
                    name="expiration"
                    placeholder="Expiration"
                    value={values.expiration}
                    onChange={handleChange('expiration')}
                    errorMessage={
                      touched.expiration ? errors.expiration : undefined
                    }
                  />
                  <InputField
                    containerStyle={[themeStyles.flex1]}
                    name="cvv"
                    placeholder="CVV"
                    value={values.cvv}
                    onChange={handleChange('cvv')}
                    errorMessage={touched.cvv ? errors.cvv : undefined}
                    numbersOnly={true}
                  />
                </View>
                <View style={themeStyles.mb4}>
                  <InputField
                    name="zipcode"
                    placeholder="Zipcode"
                    value={values.zipcode}
                    onChange={handleChange('zipcode')}
                    errorMessage={touched.zipcode ? errors.zipcode : undefined}
                    numbersOnly={true}
                  />
                </View>
              </>
            )}

            <View
              style={[
                themeStyles.flexRow,
                themeStyles.justifyContentBetween,
                themeStyles.alignItemsCenter,
                themeStyles.mt4,
              ]}
            >
              <ToggleSwitch
                value={values.defaultFundingMethod}
                onValueChange={(val) =>
                  setFieldValue('defaultFundingMethod', val)
                }
              />
              <Text
                style={[
                  styles.switchText,
                  {
                    color: themeColors.gray1,
                  },
                ]}
              >
                Make this your default funding method?
              </Text>
            </View>
            {addingType === 'bank' && (
              <View
                style={[
                  themeStyles.flexRow,
                  themeStyles.justifyContentBetween,
                  themeStyles.alignItemsCenter,
                  themeStyles.mt4,
                  themeStyles.mb10,
                ]}
              >
                <ToggleSwitch
                  value={values.defaultFundingBank}
                  onValueChange={(val) =>
                    setFieldValue('defaultFundingBank', val)
                  }
                />
                <Text
                  style={[
                    styles.switchText,
                    {
                      color: themeColors.gray1,
                    },
                  ]}
                >
                  Make this your default funding bank?
                </Text>
              </View>
            )}
            {addingType === 'card' && (
              <View style={[styles.cardFeesContainer, themeStyles.mb6]}>
                <Text style={styles.cardFeeText}>Fee</Text>
                <Text style={styles.cardFeeAmountText}>
                  3% for sending money with credit cards
                </Text>
              </View>
            )}
            <Button title="Save" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    headerText: {
      fontSize: 16,
      fontWeight: '400',
    },
    switchText: {
      fontSize: 12,
    },
    cardFeesContainer: {
      marginTop: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardFeeAmountText: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansBold,
      color: themeColors.textWhite,
    },
    cardFeeText: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansMedium,
      color: themeColors.gray1,
    },
  });
};

export default AddBank;
