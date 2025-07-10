import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthLayout from '@shared/authLayout';
import { Formik, FormikHelpers } from 'formik';
import React, { useCallback, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import { AppLogoLarge, Info } from '../../../assets/svgs';
import { AuthContext } from '../../context/authContext';
import { RootStackParamList } from '../../navigation';
import Button from '../../shared/button';
import Input from '../../shared/inputField';
import Text from '../../shared/text';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('User email not on file. Please try again.')
    .required('Please enter your email'),
});

/* A functional component that renders a Forgot Password form. It handles the
 * state of the form and the actions to be performed based on the state.
 * @returns Returns a JSX element that represents a Forgot Password form.
 */
const ForgotPassword = () => {
  const themeStyles = useThemeStyles();
  const [pageState, setPageState] = useState<
    'initial' | 'emailSent' | 'emailError'
  >('initial');
  const navigation = useNavigation<RootNavigationProp>();
  const { forgotPassword } = useContext(AuthContext);

  const sendResetEmail = useCallback(
    async (
      values: { email: string },
      { setSubmitting, setErrors }: FormikHelpers<{ email: string }>,
    ) => {
      try {
        const success = await forgotPassword(values.email);

        if (success) {
          setPageState('emailSent');
        } else {
          setPageState('emailError');
          setErrors({ email: 'User does not exist' });
        }
      } catch (error) {
        setPageState('emailError');
        setErrors({ email: 'An error occurred. Please try again.' });
      } finally {
        setSubmitting(false);
      }
    },
    [forgotPassword],
  );

  const backToLogin = useCallback(() => {
    navigation.navigate('Login' as never);
  }, [navigation]);

  return (
    <AuthLayout showLogo={pageState !== 'emailSent'}>
      <>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={sendResetEmail}
          validationSchema={ForgotPasswordSchema}
        >
          {({ handleSubmit, isSubmitting }) => (
            <View style={styles.container}>
              {pageState === 'emailSent' ? (
                <View style={styles.emailSentContent}>
                  <View style={styles.logo}>
                    <AppLogoLarge />
                  </View>
                  <Text style={themeStyles.authTitle}>
                    Please, check your inbox
                  </Text>
                  <View style={[styles.subtitleContainer]}>
                    <Text style={themeStyles.authSubTitle}>
                      Password reset instructions have been sent to your email
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={themeStyles.authTitle}>Forgot Password?</Text>
                  <View style={[styles.subtitleContainer]}>
                    <Text style={themeStyles.authSubTitle}>
                      Please enter the email address linked with your account'
                    </Text>
                  </View>
                  {(pageState === 'initial' || pageState === 'emailError') && (
                    <View style={styles.inputContainer}>
                      <Input name="email" placeholder="Email" />
                    </View>
                  )}
                  {pageState === 'emailError' && (
                    <View style={styles.emailError}>
                      <View style={styles.infoIcon}>
                        <Info color="#FD5064" />
                      </View>
                      <Text style={[themeStyles.pl1, themeStyles.infoText]}>
                        User does not exist
                      </Text>
                    </View>
                  )}
                </View>
              )}
              <View style={styles.buttonContainer}>
                <Button
                  size="lg"
                  style={themeStyles.w100}
                  onPress={() => {
                    if (pageState === 'initial') {
                      handleSubmit();
                    } else if (pageState === 'emailError') {
                      setPageState('initial');
                    } else if (pageState === 'emailSent') {
                      backToLogin();
                    }
                  }}
                  loading={isSubmitting}
                  disabled={pageState === 'emailError'}
                  title={
                    pageState === 'initial' || pageState === 'emailError'
                      ? 'Next step'
                      : 'Back to Login'
                  }
                />
              </View>
            </View>
          )}
        </Formik>
      </>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  emailSentContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50,
  },
  logo: {
    alignItems: 'center',
    marginTop: 50,
  },
  subtitleContainer: {
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: 70,
  },
  emailError: {
    flexDirection: 'row',
    marginTop: 20,
  },
  infoIcon: {
    marginTop: 3,
  },
  buttonContainer: {
    marginBottom: 50,
  },
});

export default ForgotPassword;
