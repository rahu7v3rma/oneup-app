import Button from '@shared/button';
import { FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThemeStyles } from 'styles';

import InputField from '../../../shared/inputField';
import SelectInput from '../../../shared/selectInput';
import { Fonts } from '../../../theme/fonts';
import { useThemeStyles } from '../../../theme/ThemeStylesProvider';

export interface IStepThree {
  handleSubmit: () => void;
  states: Array<string>;
  isSubmitting: boolean;
}

/**
 * StepThree Component
 *
 * A React Native functional component representing the third step of a multi-step form.
 * This step collects additional user details including phone number, addresses, city, state, and zipcode.
 *
 * Props:
 * - handleSubmit (function): Function to be called when the "Next" button is pressed.
 * - states (Array<string>): A list of U.S. states (or other region names) used in the state dropdown.
 *
 * Usage:
 * <StepThree handleSubmit={onSubmit} states={['CA', 'NY', 'TX']} />
 *
 * Dependencies:
 * - InputField: Shared component for text inputs.
 * - SelectInput: Shared dropdown select input component.
 * - Button: Shared button component for form actions.
 * - useThemeStyles: Custom hook providing theme-aware styles.
 * - Fonts: Module that holds custom font family references.
 *
 * Features:
 * - Responsive two-column layout for state and zipcode.
 * - Centralized layout with styled headings.
 * - Uses custom fonts and theming for consistent UI.
 */
export const StepThree: FC<IStepThree> = ({
  handleSubmit,
  states,
  isSubmitting,
}) => {
  const themeStyle = useThemeStyles();
  const styles = getStyles(themeStyle);

  return (
    <ScrollView style={styles.stepOneContainer}>
      <Text style={styles.largeText}>Last little bit of info about you</Text>
      <View style={styles.formContainer}>
        <InputField name="phone" placeholder="Phone Number" />
        <InputField name="address1" placeholder="Address 1" />
        <InputField name="address2" placeholder="Address 2" />
        <InputField name="city" placeholder="City" />
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <SelectInput name="state" placeholder="State" options={states} />
          </View>
          <View style={styles.inputGroup}>
            <InputField name="zipcode" placeholder="Zipcode" />
          </View>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Button
          size="lg"
          title="Next"
          onPress={handleSubmit}
          loading={isSubmitting}
        />
      </View>
    </ScrollView>
  );
};

const getStyles = (themeStyle: ThemeStyles) =>
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
      ...themeStyle.textSupporting,
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
    inputContainer: { display: 'flex', flexDirection: 'row', gap: 14 },
    inputGroup: { flex: 1 },
    buttonView: { marginTop: 27 },
  });
