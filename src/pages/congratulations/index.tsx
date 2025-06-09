import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Logo from '../../../assets/svgs/logo';
import { RootStackParamList } from '../../navigation';
import Button from '../../shared/button';
import CrossButton from '../../shared/crossButton';
import Heading from '../../shared/heading';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * A functional component that renders a congratulations screen.
 *
 * This screen includes:
 * - A logo at the top.
 * - A heading to display a congratulatory message.
 * - Two buttons for navigation: "Make a Deposit" and "Go to Home."
 * - A cross button to navigate back.
 *
 * The component utilizes theme-based styling for consistency across the app.
 *
 * @returns {JSX.Element} A styled congratulations screen component.
 */

const Congratulations = () => {
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();

  const navigation = useNavigation<RootNavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.appBG }]}>
      <CrossButton onPress={() => navigation.goBack()} />
      <View style={styles.contentContainer}>
        <View>
          <View style={styles.logoContainer}>
            <Logo width={94} height={94} />
          </View>
          <Heading style={[styles.title, themeStyles.textSupporting]}>
            Congrats you’re all set!
          </Heading>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            size="lg"
            style={themeStyles.w100}
            title="Make a Deposit"
            onPress={() => {
              // Handle deposit action here
            }}
          />
          <Button
            size="lg"
            variant="outline"
            style={[themeStyles.mt4, themeStyles.w100]}
            textStyle={themeStyles.textDefault}
            title="Go to Home"
            onPress={() => {
                   navigation.dispatch(
                     CommonActions.reset({
                       index: 0,
                       routes: [{ name: 'AppNavigator' }],
                     }),
                   );
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  goToHomeButton: {
    borderWidth: 2,
    marginTop: 10,
  },
  logoContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Congratulations;
