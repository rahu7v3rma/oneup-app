import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
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
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={themeStyles.flex1}
    >
      <View style={styles.container}>
        {showLogo && (
          <View style={styles.logo}>
            {logoSmall ? <AppLogoSmaller /> : <AppLogo />}
          </View>
        )}
        {children}
      </View>
    </LinearGradient>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  logo: {
    alignItems: 'center',
    marginTop: 50,
  },
});
