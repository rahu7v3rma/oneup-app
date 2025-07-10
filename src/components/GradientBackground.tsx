import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useTheme } from '../theme/ThemeProvider';

interface GradientBackgroundProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  style,
  children,
}) => {
  const { themeColors } = useTheme();
  const { gradientStart, gradientEnd } = themeColors.appBGGradient;

  return (
    <View style={[styles.container, style, { backgroundColor: gradientEnd }]}>
      <LinearGradient
        colors={[gradientStart, gradientEnd]}
        style={styles.topGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.4]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
});
