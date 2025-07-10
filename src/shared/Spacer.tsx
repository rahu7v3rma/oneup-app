import React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';

interface SpacerProps {
  multiplier?: number;
}

export const Spacer: React.FC<SpacerProps> = ({ multiplier = 1 }) => {
  const height = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0;
  return <View style={[styles.spacer, { height: height * multiplier }]} />;
};

const styles = StyleSheet.create({
  spacer: {
    width: '100%',
  },
});

export default Spacer;
