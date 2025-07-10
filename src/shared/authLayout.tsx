import React, { FunctionComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import AppLogo from '../../assets/svgs/appLogo';
import AppLogoSmaller from '../../assets/svgs/appLogoSmaller';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

type Props = {
  children: React.ReactNode;
  logoSmall?: boolean;
  showLogo?: boolean;
};

const AuthLayout: FunctionComponent<Props> = ({
  children,
  logoSmall = true,
  showLogo = true,
}: Props) => {
  const themeStyles = useThemeStyles();

  return (
    <LinearGradient
      colors={['#070F17', '#070F17']}
      start={{ x: 1, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={themeStyles.flex1}
    >
      <ScrollView
        style={themeStyles.flex1}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {showLogo && (
          <View style={styles.logo}>
            {logoSmall ? <AppLogoSmaller /> : <AppLogo />}
          </View>
        )}
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  logo: {
    alignItems: 'center',
    marginTop: 50,
  },
});
