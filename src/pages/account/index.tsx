import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { AuthContext } from '../../context/authContext';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const CARD_BG = '#181A20';
const BUTTON_TEXT = '#181A20';
const MENU_ICON = 'ellipsis';
const PENCIL_ICON = 'pencil';
const CARD_WIDTH = Dimensions.get('window').width - 32;

const AccountSchema = Yup.object().shape({
  email: Yup.string()
    .email('User email not on file. Please try again.')
    .required('Please enter your email'),
  display_name: Yup.string().required('Please enter your display name'),
});

const Account = () => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const navigation = useNavigation<any>();
  const { user, updateUser } = useContext(AuthContext);
  const [image] = useState<any | null>(null);
  const onSaveChanges = async (values: {
    email: string;
    display_name: string;
  }) => {
    const success = await updateUser(image, values.email, values.display_name);
    if (success) navigation.goBack();
  };
  const fetchedUser = {
    email: user?.email || '',
    display_name: user?.display_name || '',
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
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Account
        </Text>
        <TouchableOpacity style={styles.menuBtn}>
          <FontAwesome6
            name={MENU_ICON}
            size={22}
            color={themeColors.text}
            iconStyle="solid"
          />
        </TouchableOpacity>
      </View>
      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <View style={styles.profilePicWrapper}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require('../../../assets/images/default-profile-image.png')
            }
            style={styles.profilePic}
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => {}}>
            <View
              style={[
                styles.editCircle,
                { backgroundColor: themeColors.appBG },
              ]}
            >
              <FontAwesome6
                name={PENCIL_ICON}
                size={14}
                color={themeColors.btnBG}
                iconStyle="solid"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Form */}
      <Formik<{ email: string; display_name: string }>
        initialValues={fetchedUser}
        onSubmit={onSaveChanges}
        validationSchema={AccountSchema}
      >
        {({ handleSubmit, values }) => (
          <>
            <View style={{ flex: 1, paddingHorizontal: 16, marginTop: 8 }}>
              {/* Email */}
              <Text style={styles.sectionLabel}>Email</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#8F8184"
                  value={values.email}
                  editable={false}
                />
              </View>
              {/* User name */}
              <Text style={styles.sectionLabel}>User Name</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  placeholder="User Name"
                  placeholderTextColor="#8F8184"
                  value={values.email}
                  editable={false}
                />
              </View>
            </View>
            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[themeColors.btnBG, themeColors.primary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButton}
                >
                  <Text
                    style={[
                      styles.saveButtonText,
                      { color: themeColors.appBG },
                    ]}
                  >
                    SAVE CHANGES
                  </Text>
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
    profileContainer: {
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 24,
    },
    profilePicWrapper: {
      position: 'relative',
      width: 120,
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profilePic: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#222',
    },
    editIcon: {
      position: 'absolute',
      right: 8,
      bottom: 8,
    },
    editCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: CARD_BG,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
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
      marginBottom: 20,
    },
    saveButton: {
      borderRadius: 14,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      width: CARD_WIDTH,
      alignSelf: 'center',
    },
    saveButtonText: {
      color: BUTTON_TEXT,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 1,
      fontFamily: Fonts.RobotoMedium,
    },
  });
};

export default Account;
