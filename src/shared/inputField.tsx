import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useField } from 'formik';
import React, { useRef, useState } from 'react';
import {
  Platform,
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
  value,
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
  const inputRef = useRef<TextInput>(null); // Create ref for TextInput

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

    const visibleDomain = domainParts[0].slice(0, 1);
    const maskedDomain = '*'.repeat(Math.max(domainParts[0].length - 1, 2));
    const domainExt = domainParts.slice(1).join('.');

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

  // Handle press on container to focus the input
  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  // Determine if the error text is long (e.g., more than 20 characters)
  const isLongError = meta.touched && meta.error && meta.error.length > 20;

  return (
    <Pressable onPress={handleContainerPress}>
      <View
        style={[
          styles.inputContainer,
          containerStyle,
          isLongError && styles.longErrorContainer,
        ]}
      >
        <LinearGradient
          colors={['#151A20', '#1B2128']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <View
            style={[
              Platform.OS === 'ios' ? styles.inputViewIOS : styles.inputView,
              themeStyles.inputStyle,
              styles.transparent,
            ]}
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
                ref={inputRef} // Attach ref to TextInput
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
    </Pressable>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 70, // Default height
    borderRadius: 16,
  },
  longErrorContainer: {
    height: 90, // Increased height for long error text
  },
  gradientContainer: {
    borderRadius: 8,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  errorText: {
    marginTop: 4,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 14,
    fontFamily: Fonts.InterRegular,
    fontWeight: '400',
    lineHeight: 125,
    textAlignVertical: 'bottom',
  },
  inputView: {
    borderRadius: 16,
  },
  inputViewIOS: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
