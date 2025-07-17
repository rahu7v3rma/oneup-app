import { useNavigation } from '@react-navigation/native';
import Header from '@shared/header';
import InputField from '@shared/inputField';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { AuthContext } from '../../context/authContext';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const BUTTON_GRADIENT = ['#26F07D', '#04BA6A'];
const CARD_WIDTH = Dimensions.get('window').width - 32;

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Please enter your old password'),
  newPassword: Yup.string().required('Please enter your new password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Please enter your new password'),
});

const ChangePassword = () => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation = useNavigation<any>();
  const { changePassword } = useContext(AuthContext);

  const resetPassword = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const success = await changePassword(
        values.oldPassword,
        values.newPassword,
      );
      if (success) navigation.goBack();
    } catch (error) {
      // handle error
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.appBG }}>
      {/* Header */}
      <Header title={'Change Password'} />

      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={resetPassword}
        validationSchema={ChangePasswordSchema}
      >
        {({ handleSubmit }) => (
          <>
            <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 8 }}>
              {/* Old password */}
              <Text style={styles.sectionLabel}>Old password</Text>
              <InputField
                name="oldPassword"
                placeholder="Old password"
                secureTextEntry={true}
                containerStyle={styles.inputFieldContainer}
              />

              {/* New password */}
              <Text style={styles.sectionLabel}>New password</Text>
              <InputField
                name="newPassword"
                placeholder="New password"
                secureTextEntry={true}
                containerStyle={styles.inputFieldContainer}
              />

              {/* Confirm new password */}
              <InputField
                name="confirmPassword"
                placeholder="Confirm new password"
                secureTextEntry={true}
                containerStyle={styles.inputFieldContainer}
              />
            </View>
            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={BUTTON_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>SAVE PASSWORD</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return {
    sectionLabel: {
      fontFamily: Fonts.InterMedium,
      fontWeight: '500' as const,
      fontSize: 12,
      letterSpacing: 0.01,
      lineHeight: 14,
      color: '#fff',
      marginBottom: 8,
      marginTop: 18,
    },
    inputFieldContainer: {
      marginBottom: 6,
    },
    buttonContainer: {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      bottom: 32,
      alignItems: 'center' as const,
    },
    saveButton: {
      borderRadius: 14,
      height: 56,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      width: CARD_WIDTH,
      alignSelf: 'center' as const,
      marginBottom: 30,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      letterSpacing: 1,
      fontFamily: Fonts.InterMedium,
    },
  };
};

export default ChangePassword;
