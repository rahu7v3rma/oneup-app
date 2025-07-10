import Button from '@shared/button';
import Text from '@shared/text';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import DateInputField from '../../../shared/dateInput';
import InputField from '../../../shared/inputField';
import { useThemeStyles } from '../../../theme/ThemeStylesProvider';

export interface IStepTwo {
  handleSubmit: () => void;
  isSubmitting: boolean;
}
/**
 * StepTwo Component
 *
 * A functional React Native component that renders the second step of a multi-step form.
 * It collects basic user information including first name, last name, and date of birth.
 *
 * Props:
 * - handleSubmit (function): A callback function that gets called when the "Next" button is pressed.
 *
 * Usage:
 * <StepTwo handleSubmit={() => console.log('Submitted')} />
 *
 * This component uses shared UI components such as InputField, DateInputField, and Button.
 * It also consumes theme styles via the `useThemeStyles` hook and custom fonts from the `Fonts` module.
 *
 * Styles:
 * - Flex layout with vertical column direction.
 * - Responsive typography using custom fonts (RobotoBold and WorkSansRegular).
 * - Center-aligned header text and clean spacing between fields.
 */

export const StepTwo: FC<IStepTwo> = ({ handleSubmit, isSubmitting }) => {
  const themeStyles = useThemeStyles();

  return (
    <>
      <Text style={themeStyles.authTitle}>Account details</Text>
      <View style={styles.formContainer}>
        <InputField name="firstName" placeholder="First name" />
        <InputField name="lastName" placeholder="Last name" />
        <DateInputField name="birthDay" placeHolder="DOB" />
        <InputField name="phone" placeholder="Phone" numbersOnly />
      </View>
      <View style={styles.buttonView}>
        <Button
          size="lg"
          title="Continue"
          onPress={handleSubmit}
          loading={isSubmitting}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'center',
  },
});
