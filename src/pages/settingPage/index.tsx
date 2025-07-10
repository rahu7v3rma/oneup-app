import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { FC, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../../context/authContext';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const CARD_BG = '#181A20';
const ICON_GREEN = '#04BA6A';
const CHEVRON_GRAY = '#8F8184';
const REMOVE_RED = '#FF4B5C';

const options = [
  { title: 'Account', iconName: 'user', onPressKey: 'Account' },
  { title: 'Wallet', iconName: 'wallet', onPressKey: 'WalletNav' },
  { title: 'Onboarding Tutorial', iconName: 'hand-pointer', onPressKey: null },
  { title: 'Change password', iconName: 'lock', onPressKey: 'ChangePassword' },
  { title: 'Face ID', iconName: 'face-id', onPressKey: null },
  { title: 'Verification', iconName: 'id-card', onPressKey: null },
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
    Alert.alert('Remove', 'Are you sure you want to remove your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.appBG }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="arrow-left"
            size={22}
            color={themeColors.text}
            iconStyle="solid"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.title}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => handleOptionPress(opt.onPressKey)}
          >
            <View style={styles.iconContainer}>
              <Icon
                name={opt.iconName as any}
                size={22}
                color={ICON_GREEN}
                iconStyle="solid"
              />
            </View>
            <Text style={styles.cardText}>{opt.title}</Text>
            <Icon
              name={'chevron-right' as any}
              size={16}
              color={CHEVRON_GRAY}
              iconStyle="solid"
              style={styles.chevron}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Remove Button */}
      <View style={styles.removeContainer}>
        <TouchableOpacity
          style={styles.removeCard}
          onPress={handleRemove}
          activeOpacity={0.85}
        >
          <Text style={styles.removeText}>REMOVE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 18,
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
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 18,
    height: 80,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    fontFamily: Fonts.WorkSansRegular,
  },
  chevron: {
    marginLeft: 8,
  },
  removeContainer: {
    marginBottom: 24,
  },
  removeCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  removeText: {
    color: REMOVE_RED,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: Fonts.RobotoMedium,
  },
});
