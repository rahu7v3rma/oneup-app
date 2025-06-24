import Button from '@shared/button';
import { FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemeStyles } from 'styles';

import DateInputField from '../../../shared/dateInput';
import InputField from '../../../shared/inputField';
import { Fonts } from '../../../theme/fonts';
import { useThemeStyles } from '../../../theme/ThemeStylesProvider';

export interface IStepTwo {
  handleSubmit: () => void;
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

export const StepTwo: FC<IStepTwo> = ({ handleSubmit }) => {
  const themeStyles = useThemeStyles();

  const styles = getStyles(themeStyles);

  return (
    <ScrollView style={styles.stepOneContainer}>
      <Text style={styles.largeText}>Let's get some details about you</Text>
      <View style={styles.formContainer}>
        <InputField name="firstName" placeholder="First Name" />
        <InputField name="lastName" placeholder="Last Name" />
        <DateInputField name="birthDay" placeHolder="Date of Birth" />
      </View>
      <View style={styles.buttonView}>
        <Button size="lg" title="Next" onPress={handleSubmit} />
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
      gap: 15,
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
      textAlign: 'center',
      fontWeight: 500,
      lineHeight: 14,
      fontSize: 14,
      letterSpacing: 0,
    },
    containerWithValidation: {
      marginTop: 20,
      flexDirection: 'row',
      paddingHorizontal: 32,
      justifyContent: 'center',
      columnGap: 1,
      flexWrap: 'wrap',
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 4,
    },
    cell: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 4,
    },
    rulesText: {
      color: 'white',
      fontFamily: Fonts.WorkSansRegular,
      fontWeight: 500,
      lineHeight: 12,
      fontSize: 12,
      letterSpacing: 0,
      textAlign: 'left',
    },
    textUnderButton: {
      textAlign: 'center',
      fontFamily: Fonts.WorkSansRegular,
      fontSize: 14,
      lineHeight: 14,
    },
    buttonView: {
      marginTop: 27,
    },
  });
