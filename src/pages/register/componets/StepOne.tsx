import { useNavigation } from '@react-navigation/native';
import Button from '@shared/button';
import { useFormikContext } from 'formik';
import { FC } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Cross from '../../../../assets/svgs/cros';
import Mark from '../../../../assets/svgs/mark';
import InputField from '../../../shared/inputField';
import { defaultStyles, ThemeStyles } from '../../../styles';
import { Fonts } from '../../../theme/fonts';
import { useThemeStyles } from '../../../theme/ThemeStylesProvider';

export interface IStepOne {
  handleSubmit: () => void;
}
/**
 * StepOne Component
 *
 * The first step in the multi-step registration form for the 1-UP app.
 * This component collects the user's email, display name, password, and password confirmation.
 * It also provides real-time password validation feedback based on defined rules.
 *
 * Props:
 * - handleSubmit (function): Function to be called when the "Next" button is pressed.
 *
 * Features:
 * - Utilizes Formik context to access the password field in real-time.
 * - Displays validation indicators (using icons) for:
 *   - Minimum 8 characters
 *   - At least one letter
 *   - At least one number
 *   - At least one special character
 * - Themed text and custom fonts (`RobotoBold`, `WorkSansLight`, `WorkSansRegular`) for UI consistency.
 * - Informational footer with sign-in and policy links styled with dynamic theme colors.
 *
 * Dependencies:
 * - `InputField`: Shared input component for form fields.
 * - `Button`: Shared button for submitting the form.
 * - `Cross` and `Mark`: SVG icons used for password rule validation.
 * - `useThemeStyles`: Hook for accessing theme-aware text and color styles.
 * - `useFormikContext`: Provides access to Formik state, especially the `password` value.
 */

export const StepOne: FC<IStepOne> = ({ handleSubmit }) => {
  const navigation = useNavigation();
  const themeStyle = useThemeStyles();
  const styles = getStyles(themeStyle);
  const { values } = useFormikContext<{ password: string }>();
  const password = values.password || '';

  const rules = {
    minLength: { label: '8 Character Minimum', valid: password.length >= 8 },
    letter: { label: 'One letter', valid: /[a-zA-Z]/.test(password) },
    number: { label: 'One number', valid: /[0-9]/.test(password) },
    special: { label: 'Special Character', valid: /[@$!%*?&#]/.test(password) },
  };

  return (
    <ScrollView style={[styles.stepOneContainer]}>
      <Text style={styles.largeText}>Create your account</Text>
      <Text style={styles.littleText}>
        Join 1-UP and get 50% FREE match on initial deposit.
      </Text>
      <View style={styles.formContainer}>
        <InputField name="email" placeholder="Email" />
        <InputField name="nickname" placeholder="Display Name" />
        <InputField
          name="password"
          placeholder="Password"
          secureTextEntry={true}
        />
        <InputField
          name="confirmPassword"
          placeholder="Confirm Password"
          secureTextEntry={true}
        />
      </View>
      <View style={styles.containerWithValidation}>
        <View style={[styles.column, styles.width]}>
          <View style={styles.cell}>
            {rules.letter.valid ? <Mark /> : <Cross />}
            <Text style={styles.rulesText}>{rules.letter.label}</Text>
          </View>
          <View style={styles.cell}>
            {rules.number.valid ? <Mark /> : <Cross />}
            <Text style={styles.rulesText}>{rules.number.label}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.cell}>
            {rules.special.valid ? <Mark /> : <Cross />}
            <Text style={styles.rulesText}>{rules.special.label}</Text>
          </View>
          <View style={styles.cell}>
            {rules.minLength.valid ? <Mark /> : <Cross />}
            <Text style={styles.rulesText}>{rules.minLength.label}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Button size="lg" title="Next" onPress={handleSubmit} />
      </View>
      <View style={styles.textUnderContainer}>
        <View style={[defaultStyles.flexRow, defaultStyles.gap1]}>
          <Text style={[themeStyle.textSupporting, styles.textUnderButton]}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={[styles.bgColor, styles.textUnderButton]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            themeStyle.textSupporting,
            styles.textUnderButton,
            themeStyle.mt25,
          ]}
        >
          {' '}
          By using the 1-UP app you agree to our{' '}
          <Text style={styles.legalLink}>Terms of Services</Text> &{' '}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (themeStyles: ThemeStyles) =>
  StyleSheet.create({
    stepOneContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    formContainer: {
      marginTop: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    },
    largeText: {
      ...themeStyles.textSupporting,
      fontWeight: '700',
      fontSize: 30,
      lineHeight: 39,
      letterSpacing: -0.3,
      textAlign: 'center',
      fontFamily: Fonts.RobotoBold,
      paddingHorizontal: 15,
    },
    littleText: {
      ...themeStyles.textSupporting,
      textAlign: 'center',
      fontWeight: 500,
      lineHeight: 17,
      fontSize: 12,
      letterSpacing: 0.12,
    },
    containerWithValidation: {
      marginTop: 20,
      flexDirection: 'row',
      paddingHorizontal: 32,
      justifyContent: 'center',
      columnGap: 14,
      flexWrap: 'wrap',
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 4,
    },
    width: {
      width: 98,
    },
    cell: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 4,
    },
    rulesText: {
      ...themeStyles.textSupporting,
      fontFamily: Fonts.WorkSansLight,
      fontWeight: 500,
      lineHeight: 17,
      fontSize: 12,
      letterSpacing: 0.12,
      textAlign: 'left',
    },
    textUnderContainer: {
      width: 270,
      alignSelf: 'center',
      marginTop: 25,
      display: 'flex',
      alignItems: 'center',
      padding: 0,
      flex: 1,
    },
    textUnderButton: {
      height: 36,
      padding: 0,
      textAlign: 'center',
      fontFamily: Fonts.WorkSansRegular,
      fontSize: 14,
      lineHeight: 14,
      letterSpacing: 0.14,
      alignSelf: 'center',
    },
    bgColor: { color: themeStyles.themeBtnColor.backgroundColor },
    buttonView: {
      marginTop: 20,
    },
    legalLink: {
      fontWeight: 700,
    },
  });
