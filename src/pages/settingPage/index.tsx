import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import Spacer from '@shared/Spacer';
import { FC, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import FACE_ID from '../../../assets/svgs/faceId.svg';
import LOCK from '../../../assets/svgs/lock.svg';
import LOGOUT from '../../../assets/svgs/log_out.svg';
import TUTORIAL from '../../../assets/svgs/onboardingTutorial.svg';
import USER from '../../../assets/svgs/user.svg';
import VERFICATION from '../../../assets/svgs/verfication_card.svg';
import WALLET from '../../../assets/svgs/wallet.svg';
import { AuthContext } from '../../context/authContext';
import MenuHeader from '../../shared/MenuHeader';
import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import Header from '@shared/header';

const CARD_BG = '#181A20';
const ICON_GREEN = '#04BA6A';
const CHEVRON_GRAY = '#2F363C';
const REMOVE_RED = '#FF4B5C';

const options1 = [
  { title: 'Account', imageUrl: USER, onPressKey: 'Account' },
  { title: 'Wallet', imageUrl: WALLET, onPressKey: 'WalletNav' },
  { title: 'Onboarding Tutorial', imageUrl: TUTORIAL, onPressKey: null },
];

const options2 = [
  { title: 'Change password', imageUrl: LOCK, onPressKey: 'ChangePassword' },
  { title: 'Face ID', imageUrl: FACE_ID, onPressKey: null },
  { title: 'Verification', imageUrl: VERFICATION, onPressKey: null },
];

export const SettingsPage: FC = () => {
  const navigation = useNavigation<any>();
  const { themeColors } = useTheme();
  const { signOut } = useContext(AuthContext);

  const handleOptionPress = (key: string | null) => {
    if (!key) return;
    navigation.navigate(key);
  };

  const handleRemove = () => {
    Alert.alert('Log out', 'Are you sure you want to log out ?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };
  const styles = createStyles(themeColors);
  return (
    <LinearGradient colors={['#070F17', '#070F17']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Overlay to mimic radial gradient */}
        <View style={styles.radialOverlay} />
        {/* Header */}
        <Header title={'Settings'} />
        <Spacer multiplier={0.1} />
        {/* Options */}
        <View style={styles.labelRow}>
          <Text style={styles.headerText}>Preferences</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options1.map((opt) => {
            const IconComponent = opt.imageUrl;
            return (
              <TouchableOpacity
                key={opt.title}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOptionPress(opt.onPressKey)}
              >
                <View style={styles.iconContainer}>
                  <IconComponent width={22} height={22} color={ICON_GREEN} />
                </View>
                <Text style={styles.cardText}>{opt.title}</Text>
                <Icon
                  name={'chevron-right' as any}
                  size={12}
                  color={CHEVRON_GRAY}
                  iconStyle="solid"
                  style={styles.chevron}
                />
              </TouchableOpacity>
            );
          })}
        </View>
          <Spacer multiplier={0.1} />
        <View style={styles.labelRow}>
          <Text style={styles.headerText}>Security</Text>
        </View>

        <View style={styles.securityOptionsContainer}>
          {options2.map((opt) => {
            const IconComponent = opt.imageUrl;
            return (
              <TouchableOpacity
                key={opt.title}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOptionPress(opt.onPressKey)}
              >
                <View style={styles.iconContainer}>
                  <IconComponent width={22} height={22} color={ICON_GREEN} />
                </View>
                <Text style={styles.cardText}>{opt.title}</Text>
                <Icon
                  name={'chevron-right' as any}
                  size={12}
                  color={CHEVRON_GRAY}
                  iconStyle="solid"
                  style={styles.chevron}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Remove Button */}
        <View style={styles.removeContainer}>
          <TouchableOpacity
            key="Log out"
            style={styles.card}
            activeOpacity={0.85}
            onPress={handleRemove}
          >
            <View style={styles.iconContainer}>
              <LOGOUT width={22} height={22} color={ICON_GREEN} />
            </View>
            <Text style={styles.cardText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  const ScreenHeight = Dimensions.get('window').height;
  return StyleSheet.create({
    radialOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(41, 47, 55, 0.5)',
      opacity: 0.5,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 25,
      paddingBottom: 5,
    },
    headerText: {
      color: themeColors.textSupporting,
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 14,
      fontFamily: Fonts.InterBold,
      letterSpacing: 0.01,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingHorizontal: 10,
      marginTop: 5,
      marginBottom: 8,
    },
    backBtn: {
      position: 'absolute',
      left: 20,
      zIndex: 2,
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#fff',
      textAlign: 'center',
      fontFamily: Fonts.RobotoMedium,
    },
    optionsContainer: {
      paddingHorizontal: 16,
      marginTop: 8,
    },
    securityOptionsContainer: {
      paddingHorizontal: 16,
      marginTop: 4,
    },
    card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 6,
      paddingHorizontal: 16,
      paddingVertical: 15,
      height: 50,
      backgroundColor: themeColors.charcoalBlue,
    },
    iconContainer: {
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    cardText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 14,
      flex: 1,
      fontFamily: Fonts.InterSemiBold,
      letterSpacing: 0.01,
    },
    chevron: {
      marginLeft: 8,
    },
    removeContainer: {
      marginTop: ScreenHeight * 0.2,
      paddingHorizontal: 16,
    },
    removeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: CARD_BG,
      borderRadius: 8,
      marginBottom: 6,
      paddingHorizontal: 6,
      height: 40,
    },
    removeText: {
      color: REMOVE_RED,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 1,
      fontFamily: Fonts.RobotoMedium,
    },
  });
};
