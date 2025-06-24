import { CommonActions, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';

import AppLogo from '../../../assets/svgs/appLogo';
import { AuthContext } from '../../context/authContext';
import { streamChatService } from '../../services/streamChat';
import CheckboxField from '../../shared/Checkboxfield';
import InputField from '../../shared/inputField';
import LoginButton from '../../shared/loginButton';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

const Login = () => {
  const { signIn, isEmailVerified } = useContext(AuthContext);
  const navigation = useNavigation();
  const { themeColors } = useTheme();
  const themStyles = useThemeStyles();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    enableFaceID: false,
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .test(
        'is-valid-email',
        'Invalid email',
        (value) => !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      ),
    password: Yup.string().required('Password is required'),
    enableFaceID: Yup.boolean(),
  });

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);
    const success = await signIn({
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (success) {
      try {
        const connected = await streamChatService.connectUser();
        if (connected) {
          console.log('Stream Chat connected successfully');
        } else {
          console.warn(
            'Failed to connect to Stream Chat, but continuing with login',
          );
        }
      } catch (error) {
        console.error('Failed to connect to Stream Chat:', error);
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AppNavigator' }],
        }),
      );
    } else if (!isEmailVerified) {
    }
  };

  const maskEmail = (email: string): string => {
    const [user, domain] = email.split('@');
    if (!user || !domain) {
      return email;
    }

    const visiblePart = user.slice(0, 2);
    const masked = '*'.repeat(Math.max(user.length - 2, 2));
    return `${visiblePart}${masked}@${domain}`;
  };

  return (
    <View style={[themStyles.flex1, { backgroundColor: themeColors.appBG }]}>
      <ScrollView
        style={themStyles.flex1}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logo}>
          <AppLogo />
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={handleLogin}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, values, setFieldValue }) => (
            <>
              <InputField
                name="email"
                placeholder="Enter your email"
                maskEmail={values.enableFaceID}
              />
              <View style={themStyles.mt3_1} />
              {!values.enableFaceID && (
                <InputField
                  name="password"
                  placeholder="Enter your password"
                  secureTextEntry
                />
              )}
              <View style={styles.row}>
                <CheckboxField
                  name="enableFaceID"
                  label="Enable Face ID"
                  onChange={() => {
                    maskEmail(values.email);
                    console.log('mask', maskEmail(values.email));
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    values.enableFaceID
                      ? setFieldValue('enableFaceID', !values.enableFaceID)
                      : navigation.navigate('ForgotPassword' as never);
                  }}
                >
                  <Text style={[styles.forgot, themStyles.themeBtnTextColor]}>
                    {!values.enableFaceID ? 'Forgot Password' : 'Use Password'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.submitBtn}>
                <LoginButton
                  title="Login"
                  onPress={handleSubmit}
                  showFaceIDIcon={values.enableFaceID}
                  loading={loading}
                />
              </View>
              <Text style={[styles.registerText, themStyles.textSupporting]}>
                {values.enableFaceID
                  ? 'Not your account?'
                  : 'Don’t have an account?'}
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateAccount' as never)}
                >
                  <Text
                    style={[styles.registerNow, themStyles.themeBtnTextColor]}
                  >
                    {' '}
                    Register Now
                  </Text>
                </TouchableOpacity>
              </Text>
            </>
          )}
        </Formik>
        <View style={styles.footer}>
          <Text style={[styles.bottomText, themStyles.textSupporting]}>
            By using the 1-UP app you agree to
          </Text>
          <Text style={[styles.link, themStyles.textSupporting]}>
            <Text style={[styles.bottomText]}>our</Text> Terms of Services &
            Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  logo: {
    alignItems: 'center',
    paddingBottom: 43,
    paddingTop: 85,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 3,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgot: {
    fontFamily: Fonts.WorkSansSemiBold,
    fontSize: 14,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 29,
    fontFamily: Fonts.WorkSansMedium,
  },
  registerNow: {
    fontFamily: Fonts.WorkSansMedium,
  },
  footer: {
    flex: 1,
    fontFamily: Fonts.WorkSansMedium,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Fonts.WorkSansMedium,
  },
  link: {
    lineHeight: 20,
    fontFamily: Fonts.WorkSansBold,
  },
  submitBtn: {
    marginTop: 43,
  },
});
