import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

import { AppLogo } from '../../../assets/svgs';
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
  const themStyles = useThemeStyles();
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

  const onBackPress = () => {
    navigation.goBack();
  };

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
        console.error('Error resetting password:', error);
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
        <Text style={[themStyles.textSupporting, styles.loadingText]}>
          Verifying your reset link...
        </Text>
      </View>
    );
  }

  if (!tokenValid && !submitted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.fullFlex}>
          <BackButton onPress={onBackToLogin} />
          <View style={styles.logo}>
            <AppLogo />
          </View>
          <Text style={[styles.resetText, themStyles.textSupporting]}>
            Invalid Reset Link
          </Text>
          <Text style={[themStyles.textSupporting, styles.resetTextDesc]}>
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
    <View style={styles.container}>
      <SafeAreaView style={styles.fullFlex}>
        <BackButton onPress={onBackPress} />
        <View style={styles.logo}>
          <AppLogo />
        </View>
        <Text style={[styles.resetText, themStyles.textSupporting]}>
          Reset Password
        </Text>
        <Text style={[themStyles.textSupporting, styles.resetTextDesc]}>
          {submitted
            ? 'Your password has been successfully\nupdated. Return to login page to log in.'
            : 'Your new password must be unique\nfrom those previously used.'}
        </Text>
        {!submitted && (
          <Formik
            initialValues={initialValues}
            onSubmit={handleResetPassword}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, values, isSubmitting }) => {
              const password = values.password;
              const confirmPassword = values.confirmPassword;

              const hasLetter = /[A-Za-z]/.test(password);
              const hasNumber = /[0-9]/.test(password);
              const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
              const hasMinLength = password.length >= 8;
              const disabled = !password || !confirmPassword || isSubmitting;
              const submitBtnStyles = {
                backgroundColor: disabled
                  ? themeColors.disabledGreen
                  : themeColors.btnBG,
                borderColor: disabled
                  ? themeColors.disabledGreen
                  : themeColors.btnBG,
              };

              return (
                <View style={styles.formContainer}>
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

                  <View style={styles.iconcontainer}>
                    <View style={styles.iconmaincontainer}>
                      <View style={styles.closeIcon}>
                        <View style={styles.singleIconContainer}>
                          {hasLetter ? (
                            <FontAwesome6
                              name="check"
                              size={15}
                              color={themeColors.btnBG}
                              iconStyle="solid"
                            />
                          ) : (
                            <FontAwesome6
                              name="xmark"
                              size={15}
                              color={themeColors.mutedText}
                              iconStyle="solid"
                            />
                          )}
                        </View>
                        <Text
                          style={[styles.passText, themStyles.textSupporting]}
                        >
                          One letter
                        </Text>
                      </View>
                      <View style={styles.closeIcon}>
                        <View style={styles.singleIconContainer}>
                          {hasNumber ? (
                            <FontAwesome6
                              name="check"
                              size={15}
                              color={themeColors.btnBG}
                              iconStyle="solid"
                            />
                          ) : (
                            <FontAwesome6
                              name="xmark"
                              size={15}
                              color={themeColors.mutedText}
                              iconStyle="solid"
                            />
                          )}
                        </View>
                        <Text
                          style={[styles.passText, themStyles.textSupporting]}
                        >
                          One number
                        </Text>
                      </View>
                    </View>
                    <View style={styles.iconmaincontainer}>
                      <View style={styles.closeIcon}>
                        <View style={styles.singleIconContainer}>
                          {hasSpecialChar ? (
                            <FontAwesome6
                              name="check"
                              size={15}
                              color={themeColors.btnBG}
                              iconStyle="solid"
                            />
                          ) : (
                            <FontAwesome6
                              name="xmark"
                              size={15}
                              color={themeColors.mutedText}
                              iconStyle="solid"
                            />
                          )}
                        </View>
                        <Text
                          style={[styles.passText, themStyles.textSupporting]}
                        >
                          A Special Character
                        </Text>
                      </View>
                      <View style={styles.closeIcon}>
                        <View style={styles.singleIconContainer}>
                          {hasMinLength ? (
                            <FontAwesome6
                              name="check"
                              size={15}
                              color={themeColors.btnBG}
                              iconStyle="solid"
                            />
                          ) : (
                            <FontAwesome6
                              name="xmark"
                              size={15}
                              color={themeColors.mutedText}
                              iconStyle="solid"
                            />
                          )}
                        </View>
                        <Text
                          style={[styles.passText, themStyles.textSupporting]}
                        >
                          8 Character Minimum
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.submitBtnWrapper}>
                    <Button
                      size="lg"
                      title={isSubmitting ? 'Resetting...' : 'Reset Password'}
                      style={submitBtnStyles}
                      onPress={handleSubmit}
                      disabled={disabled}
                    />
                  </View>
                </View>
              );
            }}
          </Formik>
        )}

        {submitted && (
          <Button
            style={styles.backToLogin}
            size="lg"
            title="Back to Login"
            onPress={onBackToLogin}
          />
        )}

        {submitted && (
          <View style={styles.footer}>
            <Text style={[styles.registerText, themStyles.textDefault]}>
              Remember Password?{' '}
              <Text
                style={[styles.registerNow, themStyles.themeBtnTextColor]}
                onPress={onBackToLogin}
              >
                Login
              </Text>
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ResetPassword;

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    passText: {
      fontSize: 12,
      textAlign: 'center',
      fontFamily: Fonts.WorkSansMedium,
      lineHeight: 17,
    },
    closeIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
      gap: 7,
      marginTop: 3,
    },
    iconmaincontainer: {
      flexDirection: 'column',
    },
    iconcontainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 5,
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
    fullFlex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.appBG,
      padding: 22,
      justifyContent: 'center',
    },
    logo: {
      alignItems: 'center',
      marginBottom: 30,
    },
    registerText: {
      textAlign: 'center',
      marginTop: 29,
      fontFamily: Fonts.WorkSansMedium,
    },
    registerNow: {
      fontWeight: 'bold',
      fontFamily: Fonts.WorkSansMedium,
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
    backIcon: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      width: 33,
      height: 33,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginLeft: -8,
    },
    singleIconContainer: {
      width: 11,
      height: 15,
    },
    formContainer: {
      marginTop: 26,
    },
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
