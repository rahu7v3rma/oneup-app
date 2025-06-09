import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '@shared/button';
import { Formik } from 'formik';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import Logo from '../../../assets/svgs/logo';
import { RootStackParamList } from '../../navigation';
import BackButton from '../../shared/backButton';
import CheckboxField from '../../shared/Checkboxfield';
import Heading from '../../shared/heading';
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

  const navigation = useNavigation<RootNavigationProp>();
  const validationSchema = Yup.object().shape({
    terms: Yup.bool()
      .oneOf([true], 'You must accept the terms and conditions')
      .required(),
    tax: Yup.bool().oneOf([true], 'Tax agreement is required').required(),
    age: Yup.bool()
      .oneOf([true], 'You must confirm you are at least 18')
      .required(),
  });

  const handleFormSubmit = () => {
    // If validation passes, navigate to Congratulation screen
    navigation.navigate('Congratulation' as never);
  };

  return (
    <SafeAreaView
      style={[themeStyles.flex1, { backgroundColor: themeColors.appBG }]}
    >
      <View style={[styles.container]}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={styles.logoContainer}>
          <Logo width={94} height={94} />
        </View>
        <View>
          <Heading style={[styles.title, themeStyles.textDefault]}>
            Identity
          </Heading>
          <Heading
            style={[
              styles.title,
              themeStyles.textDefault,
              { marginTop: themeStyles.m0.margin },
            ]}
          >
            Acknowledgements
          </Heading>
          <Text
            style={[themeStyles.textSupporting, themeStyles.alignSelfCenter]}
          >
            Please review and confirm the information below.
          </Text>
          <View style={styles.checklist}>
            <Formik
              initialValues={{ terms: false, tax: false, age: false }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
            >
              {({ handleSubmit, errors, touched }) => (
                <View style={styles.checklist}>
                  <CheckboxField
                    name="terms"
                    label="I accept the Terms & Conditions and Privacy Policy for 1-UP"
                    textStyle={styles.checklabel}
                    containerStyle={styles.checkContainer}
                  />
                  {touched.terms && errors.terms && (
                    <Text style={themeStyles.errorText}>{errors.terms}</Text>
                  )}

                  <CheckboxField
                    name="tax"
                    label="All the submitted information is accurate and can be used for taxes purposes"
                    textStyle={styles.checklabel}
                    containerStyle={styles.checkContainer}
                  />
                  {touched.tax && errors.tax && (
                    <Text style={themeStyles.errorText}>{errors.tax}</Text>
                  )}

                  <CheckboxField
                    name="age"
                    label="I am at least 18 years of age and acknowledge that I may not allow other persons to use or access my account"
                    textStyle={styles.checklabel}
                    containerStyle={styles.checkContainer}
                  />
                  {touched.age && errors.age && (
                    <Text style={themeStyles.errorText}>{errors.age}</Text>
                  )}

                  <View style={styles.buttonContainer}>
                    <Button
                      size="lg"
                      style={themeStyles.w100}
                      onPress={handleSubmit}
                      title="I, acknowledge"
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
  logoContainer: {
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 27,
    fontFamily: Fonts.RobotoBold,
    fontSize: 30,
    letterSpacing: -0.3,
  },
  subtitle: {},
  checklist: {
    paddingHorizontal: 2,
    marginTop: 10,
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.WorkSansSemiBold,
  },
});

export default IdentityAcknowledgment;
