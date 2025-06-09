import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik, FormikHelpers } from 'formik';
import React, { useCallback, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';

import Logo from '../../../assets/svgs/logo';
import { AuthContext } from '../../context/authContext';
import { RootStackParamList } from '../../navigation';
import BackButton from '../../shared/backButton';
import Button from '../../shared/button';
import Heading from '../../shared/heading';
import Input from '../../shared/inputField';
import Link from '../../shared/link';
import Text from '../../shared/text';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
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
  const { themeColors } = useTheme();
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
          setErrors({ email: 'User email not on file. Please try again.' });
        }
      } catch (error) {
        console.error('Error sending reset email:', error);
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

  const login = useCallback(() => {
    navigation.navigate('Login' as never);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.appBG }]}>
      <BackButton
        onPress={() => {
          if (pageState === 'emailSent' || pageState === 'emailError') {
            setPageState('initial');
          } else {
            navigation.goBack();
          }
        }}
      />
      <View style={styles.logoContainer}>
        <Logo />
      </View>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={sendResetEmail}
        validationSchema={ForgotPasswordSchema}
      >
        {({ handleSubmit, isSubmitting }) => (
          <View>
            <Heading style={[styles.title, themeStyles.textSupporting]}>
              Forgot Password?
            </Heading>
            <View
              style={[
                styles.subtitleContainer,
                pageState === 'initial' ? themeStyles.w80 : themeStyles.w60,
              ]}
            >
              <Text
                style={[
                  themeStyles.textSupportingSmall,
                  themeStyles.textAlignCenter,
                  themeStyles.fontWeighMedium,
                ]}
              >
                {pageState === 'initial'
                  ? "Don't worry! It occurs. Please enter the email address linked with your account"
                  : pageState === 'emailSent'
                    ? 'Password reset instructions have been sent to your email'
                    : ''}
              </Text>
            </View>
            {(pageState === 'initial' || pageState === 'emailError') && (
              <View style={styles.inputContainer}>
                <Input name="email" placeholder="Enter Your Email" />
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
                disabled={isSubmitting}
                title={
                  pageState === 'initial'
                    ? 'Send Reset Email'
                    : pageState === 'emailError'
                      ? 'Reset'
                      : 'Back to Login'
                }
              />
            </View>
          </View>
        )}
      </Formik>
      <View style={styles.rememberPasswordContainer}>
        <Text style={[styles.rememberPaswordText, themeStyles.textSupporting]}>
          Remember Password?
        </Text>
        <Link onPress={login}>Login</Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
  backButtonImg: {
    width: 33,
    height: 32,
  },
  logoImg: {
    width: 148,
    height: 148,
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: 5,
  },
  title: {
    textAlign: 'center',
    marginTop: 27,
    fontFamily: Fonts.RobotoBold,
    fontSize: 30,
  },
  subtitleContainer: {
    alignSelf: 'center',
  },
  input: {
    marginTop: 12,
    width: '100%',
    height: 56,
  },
  button: {
    width: '100%',
    height: 56,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 44,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.WorkSansSemiBold,
  },
  rememberPasswordContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 39,
    gap: 4,
  },
  rememberPaswordText: {
    fontSize: 15,
  },
});

export default ForgotPassword;
