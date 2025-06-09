import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import { RootNavigationProp } from '../../navigation';
import Button from '../../shared/button';
import InputField from '../../shared/inputField';
import PageLayout from '../../shared/pageLayout';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { AuthContext } from '../../context/authContext';

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Please enter your old password'),
  newPassword: Yup.string().required('Please enter your new password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Please enter your new password'),
});

const PasswordStrengthItem = ({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.passwordStrengthItem}>
      <View style={styles.passwordStrengthItemIcon}>
        <FontAwesome6
          name={valid ? 'check' : 'xmark'}
          size={15}
          color={valid ? themeColors.btnBG : themeColors.inputPlaceholderClr}
          iconStyle="solid"
        />
      </View>
      <Text style={styles.passwordStrengthText}>{text}</Text>
    </View>
  );
};

const ChangePassword = () => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation = useNavigation<RootNavigationProp>();
  const { changePassword } = useContext(AuthContext);

  const resetPassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const success = await changePassword(values.oldPassword, values.newPassword);
      
      if (success) {
        // If password change was successful, navigate back
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Toast.show({
        type: 'error',
        text1: 'Change Error',
        text2: 'An unexpected error occurred',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  return (
    <PageLayout title="Change Password" onBack={() => navigation.goBack()}>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={resetPassword}
        validationSchema={ChangePasswordSchema}
      >
        {({ handleSubmit, values, handleChange, errors, touched }) => {
          const oldPassword = values.oldPassword;
          const password = values.newPassword;
          const confirmPassword = values.confirmPassword;
          console.log('this is the old password ', oldPassword)
          console.log('This ia the new password ', password)
          console.log('this is the confirm password ', confirmPassword)
          // Password validation rules
          const rules = {
            hasLetter: { 
              label: 'One letter', 
              valid: /[A-Za-z]/.test(password) 
            },
            hasNumber: { 
              label: 'One number', 
              valid: /[0-9]/.test(password) 
            },
            hasSpecialCharacter: { 
              label: 'Special Character', 
              valid: /[^A-Za-z0-9]/.test(password) 
            },
            has8Characters: { 
              label: '8 Character Minimum', 
              valid: password.length >= 8 
            },
          };
          console.log(rules);
          const isSaveDisabled =
            !oldPassword ||
            !rules.hasLetter.valid ||
            !rules.hasNumber.valid ||
            !rules.hasSpecialCharacter.valid ||
            !rules.has8Characters.valid || !(password === confirmPassword);

          return (
            <View style={styles.container}>
              <Text style={[styles.title]}>{'Enter Old Password'}</Text>
              <InputField
                name="oldPassword"
                placeholder="Password"
                secureTextEntry={true}
                onChange={handleChange('oldPassword')}
              />
              <View style={styles.newPasswordContainer}>
                <Text style={[styles.title]}>{'New Password'}</Text>
                <InputField
                  name="newPassword"
                  placeholder="Password"
                  secureTextEntry={true}
                  onChange={handleChange('newPassword')}
                  containerStyle={{ marginBottom: 14 }}
                />
                <InputField
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  errorMessage={
                    touched.confirmPassword ? errors.confirmPassword : undefined
                  }
                  onChange={handleChange('confirmPassword')}
                />
              </View>
              
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthColumn}>
                  <PasswordStrengthItem 
                    valid={rules.hasLetter.valid} 
                    text={rules.hasLetter.label} 
                  />
                  <PasswordStrengthItem 
                    valid={rules.hasNumber.valid} 
                    text={rules.hasNumber.label} 
                  />
                </View>
                <View style={styles.passwordStrengthColumn}>
                  <PasswordStrengthItem 
                    valid={rules.hasSpecialCharacter.valid} 
                    text={rules.hasSpecialCharacter.label} 
                  />
                  <PasswordStrengthItem 
                    valid={rules.has8Characters.valid} 
                    text={rules.has8Characters.label} 
                  />
                </View>
              </View>
              
              <Button
                title="Save"
                onPress={handleSubmit}
                style={styles.saveButton}
                disabled={isSaveDisabled}
              />
            </View>
          );
        }}
      </Formik>
    </PageLayout>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    title: {
      fontSize: 13,
      color: themeColors.textWhite,
      fontFamily: Fonts.RobotoRegular,
      marginBottom: 14,
      marginLeft: 3,
    },
    container: {
      paddingVertical: 30,
    },
    newPasswordContainer: {
      marginTop: 20,
    },
    passwordStrengthContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      gap: 20,
    },
    passwordStrengthColumn: {
      flexDirection: 'column',
      gap: 10,
    },
    passwordStrengthText: {
      fontSize: 12,
      fontFamily: Fonts.WorkSansMedium,
      color: themeColors.textWhite,
    },
    passwordStrengthItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    saveButton: {
      marginTop: 30,
    },
    passwordStrengthItemIcon: {
      width: 14,
    },
  });
};

export default ChangePassword;
