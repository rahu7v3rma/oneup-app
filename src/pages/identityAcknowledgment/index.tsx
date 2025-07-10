import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthLayout from '@shared/authLayout';
import Button from '@shared/button';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Yup from 'yup';

import { AppLogoLarge } from '../../../assets/svgs';
import { RootStackParamList } from '../../navigation';
import CheckboxField from '../../shared/Checkboxfield';
import Text from '../../shared/text';
import { lightColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * A functional component that renders an identity acknowledgment form with
 * validation.
 *
 * @returns Returns a JSX element representing a form for identity acknowledgment with
 *   validation for terms, tax, and age.
 */
const IdentityAcknowledgment = () => {
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const [showCongrats, setShowCongrats] = useState(false);

  const navigation = useNavigation<RootNavigationProp>();
  const validationSchema = Yup.object().shape({
    tax: Yup.bool().oneOf([true], 'Tax agreement is required').required(),
    terms: Yup.bool()
      .oneOf([true], 'You must accept the terms and conditions')
      .required(),
  });

  const handleFormSubmit = () => {
    // Show congratulations screen
    setShowCongrats(true);
  };

  const handleMakeDeposit = () => {
    // Navigate to deposit screen or handle deposit logic
    navigation.navigate('Congratulation' as never);
  };

  const renderCongrats = () => {
    return (
      <View style={styles.congrats}>
        <View style={styles.logo}>
          <AppLogoLarge />
        </View>
        <Text style={themeStyles.authTitle}>Congrats</Text>
        <Text style={themeStyles.authSubTitle}>You are all set</Text>
      </View>
    );
  };

  const renderBottomActions = () => {
    if (showCongrats) {
      return (
        <View style={styles.bottomContent}>
          <Button
            size="lg"
            style={themeStyles.w100}
            onPress={handleMakeDeposit}
            title="MAKE DEPOSIT"
          />
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'AppNavigator' }],
                }),
              );
            }}
            style={styles.skipButton}
          >
            <Text style={[styles.skipText, { color: themeColors.primary }]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <AuthLayout showLogo={!showCongrats}>
      <View style={styles.container}>
        {showCongrats ? (
          renderCongrats()
        ) : (
          <>
            <Text style={themeStyles.authTitle}>Acknowledgements</Text>
            <Text style={themeStyles.authSubTitle}>
              Please review and confirm the information below.
            </Text>
            <View style={styles.checklist}>
              <Formik
                initialValues={{ terms: false, tax: false, age: false }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({ handleSubmit, errors, touched, values }) => (
                  <View style={styles.formContainer}>
                    <View>
                      <CheckboxField
                        name="tax"
                        label="All the submitted information is accurate and can be used for taxes purposes"
                        textStyle={{
                          ...styles.checklabel,
                          color: values.tax
                            ? themeColors.text || '#FFFFFF'
                            : themeColors.slate,
                        }}
                        containerStyle={styles.checkContainer}
                      />
                      {touched.terms && errors.terms && (
                        <Text style={themeStyles.errorText}>
                          {errors.terms}
                        </Text>
                      )}

                      <CheckboxField
                        name="terms"
                        label="I acknowledge that I should not allow other people to use or access my account"
                        textStyle={{
                          ...styles.checklabel,
                          color: values.terms
                            ? themeColors.text || '#FFFFFF'
                            : themeColors.slate,
                        }}
                        containerStyle={styles.checkContainer}
                      />
                      {touched.tax && errors.tax && (
                        <Text style={themeStyles.errorText}>{errors.tax}</Text>
                      )}
                    </View>

                    <View style={styles.bottomContent}>
                      <Button
                        size="lg"
                        style={themeStyles.w100}
                        onPress={handleSubmit}
                        title="I, ACKNOWLEDGE"
                        disabled={!values.terms || !values.tax}
                      />
                      <Text style={[styles.footerText, themeStyles.footerText]}>
                        By using the 1UP app you agree to our{'\n'}
                        <Text style={[themeStyles.textGreen]}>
                          Terms of Services{' '}
                          <Text style={[themeStyles.footerText]}>&</Text>{' '}
                          Privacy Policy
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </>
        )}

        {renderBottomActions()}
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  congrats: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50,
  },
  logo: {
    alignItems: 'center',
  },
  successMsg: {
    width: 296,
  },
  checklist: {
    marginTop: 50,
    flex: 1,
  },
  checkContainer: {
    alignItems: 'flex-start',
    marginVertical: 9,
  },
  checklabel: {
    fontFamily: Fonts.WorkSansRegular,
    fontSize: 14,
    color: lightColors.textSupporting,
  },
  footerText: {
    width: 276,
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 30,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomContent: {
    alignItems: 'center',
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: Fonts.WorkSansRegular,
    textAlign: 'center',
  },
});

export default IdentityAcknowledgment;
