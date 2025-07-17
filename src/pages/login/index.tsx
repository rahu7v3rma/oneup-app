import { CommonActions, useNavigation } from '@react-navigation/native';
import Text from '@shared/text';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';

import { AppLogo } from '../../../assets/svgs';
import { AuthContext } from '../../context/authContext';
import { streamChatService } from '../../services/streamChat';
import CheckboxField from '../../shared/Checkboxfield';
import InputField from '../../shared/inputField';
import LoginButton from '../../shared/loginButton';
import { Fonts } from '../../theme/fonts';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

const { height } = Dimensions.get('window');

const Login = () => {
  const { signIn, isEmailVerified } = useContext(AuthContext);
  const navigation = useNavigation();
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
      // Handle unverified email case if needed
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
    <LinearGradient
      colors={['#070F17', '#070F17']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[themStyles.flex1]}
    >
      <KeyboardAvoidingView
        style={[{ flex: 1 }, styles.container]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.logo}>
              <AppLogo />
            </View>
          </View>
          <Formik
            initialValues={initialValues}
            onSubmit={handleLogin}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, values, setFieldValue }) => (
              <View style={styles.form}>
                <View>
                  <InputField
                    name="email"
                    placeholder="Email"
                    maskEmail={values.enableFaceID}
                  />
                  <View style={themStyles.mt3_1} />
                  {!values.enableFaceID && (
                    <InputField
                      name="password"
                      placeholder="Password"
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
                      textStyle={{
                        ...themStyles.checkBoxText,
                        fontFamily: Fonts.InterRegular,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        values.enableFaceID
                          ? setFieldValue('enableFaceID', !values.enableFaceID)
                          : navigation.navigate('ForgotPassword' as never);
                      }}
                    >
                      <Text style={[styles.forgot, themStyles.textGreen]}>
                        {!values.enableFaceID
                          ? 'Forgot Password?'
                          : 'Use Password'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.registerWrapper}>
                  <View style={styles.submitBtn}>
                    <LoginButton
                      title="Log in"
                      onPress={handleSubmit}
                      showFaceIDIcon={values.enableFaceID}
                      loading={loading}
                    />
                  </View>

                  <View style={styles.footerContainer}>
                    <Text style={[styles.registerText, themStyles.footerText]}>
                      {values.enableFaceID
                        ? 'Not your account?'
                        : 'Don’t have an account?'}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CreateAccount' as never)
                      }
                    >
                      <Text style={[styles.registerNow, themStyles.textGreen]}>
                        {' '}
                        Register Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add padding to ensure content isn't cut off
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: height * 0.1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgot: {
    fontFamily: Fonts.WorkSansSemiBold,
    fontSize: 14,
  },
  registerWrapper: {
    marginTop: 29,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerText: {
    fontFamily: Fonts.InterRegular,
  },
  registerNow: {
    fontFamily: Fonts.InterBold,
  },
  submitBtn: {
    marginBottom: 40,
  },
  container: {
    padding: 24,
  },
  logo: {
    alignItems: 'center',
    marginTop: 60,
  },
});
