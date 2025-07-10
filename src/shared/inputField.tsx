import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useField } from 'formik';
import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

interface Props {
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  maskEmail?: boolean;
  value?: string;
  onChange?: (text: string) => void;
  errorMessage?: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  numbersOnly?: boolean;
  hideRequiredMessage?: boolean;
}

const InputField = ({
  name,
  placeholder,
  secureTextEntry = false,
  maskEmail = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange,
  label,
  containerStyle,
  keyboardType = 'default',
  numbersOnly = false,
  hideRequiredMessage = false,
}: Props) => {
  const themeStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const [field, meta, helpers] = useField(name);

  const toggleSecureEntry = () => setIsSecure(!isSecure);

  const getMaskedEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (!user || !domain) {
      return email;
    }

    const visibleUser = user.slice(0, 2);
    const maskedUser = '*'.repeat(Math.max(user.length - 2, 2));

    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
      return `${visibleUser}${maskedUser}@${domain}`;
    }

    const domainName = domainParts[0];
    const domainExt = domainParts.slice(1).join('.');

    const visibleDomain = domainName.slice(0, 1);
    const maskedDomain = '*'.repeat(Math.max(domainName.length - 1, 2));

    return `${visibleUser}${maskedUser}@${visibleDomain}${maskedDomain}.${domainExt}`;
  };

  const handleTextChange = (text: string) => {
    if (numbersOnly) {
      // Remove all non-numeric characters
      const numericText = text.replace(/[^0-9]/g, '');
      helpers.setValue(numericText);
    } else {
      helpers.setValue(text);
    }
  };

  const displayValue =
    maskEmail && !isFocused ? getMaskedEmail(field.value) : field.value;

  const getKeyboardType = () => {
    if (numbersOnly) {
      return 'numeric';
    }
    return keyboardType;
  };

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <LinearGradient
        colors={['#151A20', '#1B2128']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={[styles.inputView, themeStyles.inputStyle, styles.transparent]}
        >
          {label && (
            <Text
              style={[styles.labelText, themeStyles.themeInputPlacholderColor]}
            >
              {label}
            </Text>
          )}
          <View
            style={[
              themeStyles.ph4,
              themeStyles.input,
              styles.inputWrapper,
              meta.touched && meta.error ? themeStyles.errorInputBorder : {},
              styles.transparent,
            ]}
          >
            <TextInput
              value={displayValue}
              onChangeText={handleTextChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                helpers.setTouched(true);
              }}
              placeholder={placeholder}
              secureTextEntry={isSecure}
              keyboardType={getKeyboardType()}
              style={[
                themeStyles.flex1,
                themeStyles.textSupporting,
                themeStyles.inputText,
              ]}
              placeholderTextColor={themeColors.slateGray}
              autoCapitalize="none"
            />
            {secureTextEntry && (
              <Pressable onPress={toggleSecureEntry} style={styles.eyeIcon}>
                <FontAwesome6
                  name={isSecure ? 'eye-slash' : 'eye'}
                  size={18}
                  color={themeColors.mintGreen}
                />
              </Pressable>
            )}
          </View>
        </View>
      </LinearGradient>

      {meta.touched &&
        meta.error &&
        (!hideRequiredMessage || !meta.error.includes('required')) && (
          <Text style={[styles.errorText, themeStyles.errorText]}>
            {meta.error}
          </Text>
        )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  errorText: {
    marginTop: 8,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 10,
    fontFamily: Fonts.WorkSansMedium,
  },
  inputView: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
