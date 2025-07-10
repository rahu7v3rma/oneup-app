import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

import OneUpLogo from '../../assets/svgs/oneUp/oneUpLogo.svg';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

type PlayHeaderProps = {
  label?: string;
  containerStyle?: ViewStyle;
};

const PlayHeader: React.FC<PlayHeaderProps> = ({
  label = 'Play',
  containerStyle,
}) => {
  const styles = useThemeStyles();

  return (
    <View
      style={[
        styles.flexRow,
        styles.justifyContentBetween,
        styles.alignItemsCenter,
        styles.ph4,
        styles.pv4,
        containerStyle,
      ]}
    >
      <View style={[styles.flexRow, styles.alignItemsCenter]}>
        <OneUpLogo width={59} height={35.05} />
        <Text style={[styles.textInterSemiBold]}>{label}</Text>
      </View>
    </View>
  );
};

export default PlayHeader;
