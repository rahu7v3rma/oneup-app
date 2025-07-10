import { useNavigation } from '@react-navigation/native';
import Button from '@shared/button';
import Text from '@shared/text';
import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Info } from '../../../../assets/svgs';
import InputField from '../../../shared/inputField';
import { defaultStyles } from '../../../styles';
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

  return (
    <>
      <Text style={themeStyle.authTitle}>Create account</Text>
      <Text style={themeStyle.authSubTitle}>
        Join 1UP and get 100 sweepcoins to start playing!
      </Text>
      <View style={styles.formContainer}>
        <View style={styles.content}>
          <InputField name="email" placeholder="Email" value="saad@gmail.com" />
          <InputField name="nickname" placeholder="Display name" value="Saad" />
          <InputField
            name="password"
            placeholder="Password"
            secureTextEntry={true}
            value="J@pan123"
          />
          <InputField
            name="confirmPassword"
            placeholder="Confirm password"
            secureTextEntry={true}
            value="J@pan123"
          />
          <View style={styles.info}>
            <View style={styles.infoIcon}>
              <Info />
            </View>
            <Text style={[themeStyle.pl1, themeStyle.infoText]}>
              Password should be at least 8 characters long, include letters,
              numbers and special characters
            </Text>
          </View>
          <View style={styles.buttonView}>
            <Button size="lg" title="Continue" onPress={handleSubmit} />
          </View>
        </View>
        <View style={styles.footer}>
          <View style={[defaultStyles.flexRow, defaultStyles.gap1]}>
            <Text style={[styles.registerText, themeStyle.footerText]}>
              Already registered?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={themeStyle.textGreen}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  stepOneContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  formContainer: {
    marginTop: 30,
  },
  content: {
    gap: 14,
  },
  info: {
    flexDirection: 'row',
  },
  infoIcon: {
    marginTop: 3,
  },
  footer: {
    width: 270,
    alignSelf: 'center',
    marginTop: 50,
    alignItems: 'center',
  },
  registerText: {
    fontFamily: Fonts.InterRegular,
  },
  buttonView: {
    marginTop: 50,
  },
});
