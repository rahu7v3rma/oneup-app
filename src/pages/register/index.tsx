import { CommonActions, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, useContext, useState } from 'react';
import { Alert, Dimensions, Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';

import AppLogoSmaller from '../../../assets/svgs/appLogoSmaller';
import { AuthContext } from '../../context/authContext';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

import { StepOne } from './componets/StepOne';
import { StepTwo } from './componets/StepTwo';

/**
 * RegisterPage is a multi-step user registration form component.
 *
 * This component uses Formik for form management and Yup for validation.
 * It includes three steps:
 * 1. User credentials (email, password, nickname)
 * 2. Personal information (name, birthday)
 * 3. Contact details (phone, address, city, state)
 *
 * The form progresses step-by-step with conditional validation and rendering.
 * It utilizes custom step components (StepOne, StepTwo) and a shared BackButton.
 *
 * @component
 * @returns {JSX.Element} A scrollable multi-step form with validation and themed styling.
 */
export const RegisterPage: FC = () => {
  const navigation = useNavigation();
  const { register } = useContext(AuthContext);
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initialValues = {
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDay: '',
    phone: '',
  };

  const isValidDate = (value: string) => {
    const [mm, dd, yyyy] = value.split('/');
    const date = new Date(`${yyyy}-${mm}-${dd}`);
    return (
      date.getFullYear() === Number(yyyy) &&
      date.getMonth() === Number(mm) - 1 &&
      date.getDate() === Number(dd)
    );
  };

  const mmddyyyyRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  const validationSchemaFirstStep = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[@$!%*?&#]/,
        'Password must contain at least one special character',
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    nickname: Yup.string()
      .min(3, 'Nickname must be at least 3 characters')
      .max(20, 'Nickname must be at most 20 characters')
      .matches(
        /^[a-zA-Z0-9_]+$/,
        'Nickname can only contain letters, numbers, and underscores',
      )
      .required('Nickname is required'),
  });

  const validationSchemaSecondStep = Yup.object({
    firstName: Yup.string()
      .min(2, 'First name must be at least 2 characters')
      .max(30, 'First name must be at most 30 characters')
      .matches(
        /^[a-zA-Z\s'-]+$/,
        'First name can only contain letters, spaces, apostrophes, and hyphens',
      )
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(30, 'Last name must be at most 30 characters')
      .matches(
        /^[a-zA-Z\s'-]+$/,
        'Last name can only contain letters, spaces, apostrophes, and hyphens',
      )
      .required('Last name is required'),
    birthDay: Yup.string()
      .required('Date of birth is required')
      .matches(mmddyyyyRegex, 'Date must be in MM/DD/YYYY format')
      .test('is-valid-date', 'Invalid calendar date', isValidDate)
      .test('min-age', 'You must be at least 18 years old', (value) => {
        if (!value || !isValidDate(value)) return false;
        const [mm, dd, yyyy] = value.split('/').map(Number);
        const birthDate = new Date(yyyy, mm - 1, dd);
        const today = new Date(2025, 6, 11); // Current date: July 11, 2025
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        return (
          age >= 18 ||
          (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))
        );
      })
      .test('max-year', 'Birth year cannot be before 1900', (value) => {
        if (!value || !isValidDate(value)) return false;
        const [, , yyyy] = value.split('/').map(Number);
        return yyyy >= 1900;
      }),
    phone: Yup.string()
      .matches(/^\d+$/, 'Phone must contain only digits')
      .min(10, 'Phone must be at least 10 digits')
      .max(15, 'Phone cannot be more than 15 digits')
      .required('Phone number is required'),
  });

  const formatDateForBackend = (dateString: string) => {
    // Convert from MM/DD/YYYY to YYYY-MM-DD
    const [month, day, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleFinalSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);

      // Format the data according to the backend's expected structure
      const formattedData = {
        email: values.email?.trim().toLowerCase(),
        password: values.password,
        first_name: values.firstName?.trim(),
        last_name: values.lastName?.trim(),
        display_name: values.nickname?.trim(),
        date_of_birth: formatDateForBackend(values.birthDay),
        phone_number: values.phone,
        address_1: values.address1,
        address_2: values.address2 || '',
        city: values.city,
        state: values.state,
        zipcode: values.zipcode,
      };

      const success = await register(formattedData);

      if (success) {
        // Navigate to the next screen after successful registration
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'IdentityAcknowledgements' }],
          }),
        );
      }
    } catch (error: any) {
      // Handle API errors
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred during registration.';
      const fieldErrors = error.response?.data?.data || {};

      if (error.response?.data?.code === 'email_already_exists') {
        Alert.alert('Registration Failed', 'This email is already registered.');
      } else if (error.response?.data?.code === 'password_does_not_conform') {
        Alert.alert(
          'Password Error',
          fieldErrors.password?.[0] || 'Password does not meet requirements.',
        );
      } else {
        Alert.alert('Registration Failed', errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (values: any) => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleFinalSubmit(values);
    }
  };

  const getValidationSchema = (currentStep: number) => {
    if (currentStep === 1) {
      return validationSchemaFirstStep;
    }
    if (currentStep === 2) {
      return validationSchemaSecondStep;
    }
    return validationSchemaFirstStep;
  };

  const handleNextClick = async (
    validateForm: any,
    setTouched: any,
    handleSubmit: () => void,
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      setTouched(
        Object.keys(errors).reduce(
          (acc, key) => {
            acc[key] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        ),
      );
      return;
    }

    handleSubmit();
  };

  const ScreenHeight = Dimensions.get('window').height;
  const themeStyles = useThemeStyles();
  return (
    <LinearGradient
      colors={['#070F17', '#070F17']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={themeStyles.flex1}
    >
      <KeyboardAwareScrollView
        style={[{ flex: 1 }, styles.container]}
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === 'ios' ? ScreenHeight * 0.01 : ScreenHeight * 0.1,
        }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.logo}>
            <AppLogoSmaller />
          </View>
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={getValidationSchema(step)}
        >
          {({ handleSubmit, setTouched, validateForm }) => (
            <>
              <StepOne visible={step === 1} handleSubmit={handleSubmit} />
              <StepTwo
                visible={step === 2}
                handleSubmit={() =>
                  handleNextClick(validateForm, setTouched, handleSubmit)
                }
                handleBack={() => setStep(1)}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logo: {
    alignItems: 'center',
    marginTop: 50,
  },
});
