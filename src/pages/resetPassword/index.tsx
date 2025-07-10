import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthLayout from '@shared/authLayout';
import { Formik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { type ThemeColors } from 'theme/colors';
import * as Yup from 'yup';

import { AppLogo, AppLogoLarge } from '../../../assets/svgs';
import { AuthContext } from '../../context/authContext';
import { RootStackParamList } from '../../navigation';
import BackButton from '../../shared/backButton';
import Button from '../../shared/button';
import InputField from '../../shared/inputField';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ResetPassword = () => {
  const themeStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const styles = getStyles(themeColors);
  const [submitted, setSubmitted] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const route = useRoute<ResetPasswordRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { token } = route.params;
  const { verifyResetToken, confirmResetPassword } = useContext(AuthContext);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(8).required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required(),
  });

  useEffect(() => {
    // Verify token when component mounts
    const checkToken = async () => {
      if (token) {
        try {
          setVerifying(true);
          const isValid = await verifyResetToken(token);
          setTokenValid(isValid);
        } catch (error) {
          console.error('Error verifying token:', error);
          setTokenValid(false);
          Toast.show({
            type: 'error',
            text1: 'Token Verification Failed',
            text2: 'The reset link is invalid or has expired.',
            position: 'bottom',
            visibilityTime: 4000,
          });
        } finally {
          setVerifying(false);
        }
      } else {
        setVerifying(false);
        setTokenValid(false);
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: 'No reset token provided.',
          position: 'bottom',
          visibilityTime: 4000,
        });
      }
    };

    checkToken();
  }, [token, verifyResetToken]);

  const onBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleResetPassword = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (token && tokenValid) {
      try {
        const success = await confirmResetPassword(token, values.password);
        if (success) {
          setSubmitted(true);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Reset Failed',
          text2: 'Failed to reset password. Please try again.',
          position: 'bottom',
          visibilityTime: 4000,
        });
      }
    }
  };

  if (verifying) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={themeColors.btnBG} />
        <Text style={[themeStyles.textSupporting, styles.loadingText]}>
          Verifying your reset link...
        </Text>
      </View>
    );
  }

  if (!tokenValid && !submitted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={themeStyles.flex1}>
          <BackButton onPress={onBackToLogin} />
          <View style={styles.logo}>
            <AppLogo />
          </View>
          <Text style={[styles.resetText, themeStyles.textSupporting]}>
            Invalid Reset Link
          </Text>
          <Text style={[themeStyles.textSupporting, styles.resetTextDesc]}>
            The password reset link is invalid or has expired. Please request a
            new password reset link.
          </Text>
          <Button
            style={styles.backToLogin}
            size="lg"
            title="Back to Login"
            onPress={onBackToLogin}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <AuthLayout showLogo={!submitted}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleResetPassword}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, values }) => {
          const password = values.password;
          const confirmPassword = values.confirmPassword;

          const disabled = !(password && confirmPassword) && !submitted;

          return (
            <View style={styles.content}>
              {submitted ? (
                <View style={styles.submittedContent}>
                  <View style={styles.logo}>
                    <AppLogoLarge />
                  </View>
                  <Text style={themeStyles.authTitle}>Password reset</Text>
                  <Text style={[themeStyles.authSubTitle, styles.successMsg]}>
                    Your password has been successfully updated. Return to login
                    page to proceed
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={themeStyles.authTitle}>Reset password</Text>
                  <Text style={themeStyles.authSubTitle}>
                    Your new password must be unique from those previously used
                  </Text>
                  <View style={styles.form}>
                    <View style={styles.inputContainer}>
                      <InputField
                        name="password"
                        placeholder="Password"
                        secureTextEntry
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <InputField
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.submitBtnWrapper}>
                <Button
                  size="lg"
                  title={submitted ? 'Back to Login' : 'Reset Password'}
                  onPress={() => {
                    if (submitted) {
                      onBackToLogin();
                    } else {
                      handleSubmit();
                    }
                  }}
                  disabled={disabled}
                />
              </View>
            </View>
          );
        }}
      </Formik>
    </AuthLayout>
  );
};

export default ResetPassword;

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    submittedContent: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: 50,
    },
    form: {
      marginTop: 50,
    },
    resetTextDesc: {
      fontSize: 12,
      textAlign: 'center',
      fontFamily: Fonts.WorkSansMedium,
      lineHeight: 17,
      letterSpacing: 0.1,
    },
    resetText: {
      fontSize: 30,
      textAlign: 'center',
      fontFamily: Fonts.RobotoBold,
      lineHeight: 39,
    },
    container: {
      flex: 1,
      backgroundColor: colors.appBG,
      padding: 22,
      justifyContent: 'center',
    },
    logo: {
      alignItems: 'center',
    },
    successMsg: {
      width: 296,
    },
    backToLogin: { marginTop: 39 },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 30,
      textAlign: 'center',
    },
    submitBtnWrapper: { marginTop: 28 },
    inputContainer: {
      marginBottom: 16,
    },
    centerContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 20,
      fontSize: 16,
      textAlign: 'center',
    },
  });
