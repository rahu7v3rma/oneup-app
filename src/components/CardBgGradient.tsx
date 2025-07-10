import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface CardBgGradientProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CardBgGradient: React.FC<CardBgGradientProps> = ({ children, style }) => {
  return (
    <LinearGradient
      colors={['#151A20', '#1B2128']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

export default CardBgGradient;
