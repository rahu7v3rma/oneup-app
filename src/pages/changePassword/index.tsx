import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { AuthContext } from '../../context/authContext';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const CARD_BG = '#181A20';
const ICON_GREEN = '#04BA6A';
const PLACEHOLDER = '#8F8184';
const BUTTON_GRADIENT = ['#26F07D', '#04BA6A'];
const MENU_ICON = 'bars';
const EYE_ICON = 'eye';
const EYE_SLASH_ICON = 'eye-slash';
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
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome6
            name="arrow-left"
            size={22}
            color={themeColors.text}
            iconStyle="solid"
          />
        </TouchableOpacity>
        <View style={styles.logoTitleRow}>
          <Text style={styles.logo1up}>
            <Text
              style={{
                color: ICON_GREEN,
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              1
            </Text>
            <Text
              style={{ color: '#fff', fontWeight: 'bold', fontStyle: 'italic' }}
            >
              UP
            </Text>
          </Text>
          <Text style={styles.headerTitle}>Change password</Text>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <FontAwesome6
            name={MENU_ICON}
            size={22}
            color={themeColors.text}
            iconStyle="solid"
          />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={resetPassword}
        validationSchema={ChangePasswordSchema}
      >
        {({ handleSubmit, values, handleChange }) => (
          <>
            <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 8 }}>
              {/* Old password */}
              <Text style={styles.sectionLabel}>Old password</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  placeholder="Old password"
                  placeholderTextColor="#8F8184"
                  secureTextEntry={!showOld}
                  value={values.oldPassword}
                  onChangeText={handleChange('oldPassword')}
                />
                <TouchableOpacity onPress={() => setShowOld((v) => !v)}>
                  <FontAwesome6
                    name={showOld ? EYE_ICON : EYE_SLASH_ICON}
                    size={20}
                    color={PLACEHOLDER}
                  />
                </TouchableOpacity>
              </View>

              {/* New password */}
              <Text style={styles.sectionLabel}>New password</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  placeholder="New password"
                  placeholderTextColor="#8F8184"
                  secureTextEntry={!showNew}
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                />
                <TouchableOpacity onPress={() => setShowNew((v) => !v)}>
                  <FontAwesome6
                    name={showNew ? EYE_ICON : EYE_SLASH_ICON}
                    size={20}
                    color={PLACEHOLDER}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  placeholderTextColor="#8F8184"
                  secureTextEntry={!showConfirm}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                  <FontAwesome6
                    name={showConfirm ? EYE_ICON : EYE_SLASH_ICON}
                    size={20}
                    color={PLACEHOLDER}
                  />
                </TouchableOpacity>
              </View>
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

const createStyles = () => {
  return StyleSheet.create({
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 8,
      paddingBottom: 18,
      paddingHorizontal: 16,
    },
    backBtn: {
      padding: 8,
    },
    logoTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      gap: 8,
    },
    logo1up: {
      fontSize: 22,
      fontWeight: 'bold',
      fontStyle: 'italic',
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
      textAlign: 'center',
      fontFamily: Fonts.RobotoMedium,
    },
    menuBtn: {
      padding: 8,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 16,
      marginTop: 20,
    },
    sectionLabel: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 8,
      marginTop: 18,
    },
    inputCard: {
      backgroundColor: CARD_BG,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      height: 56,
      marginBottom: 14,
      color: '#fff',
    },
    input: {
      flex: 1,
      color: '#fff',
      fontSize: 16,
      fontFamily: Fonts.WorkSansRegular,
    },
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 32,
      alignItems: 'center',
    },
    saveButton: {
      borderRadius: 14,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      width: CARD_WIDTH,
      alignSelf: 'center',
      marginBottom: 30,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 1,
      fontFamily: Fonts.RobotoMedium,
    },
  });
};

export default ChangePassword;
