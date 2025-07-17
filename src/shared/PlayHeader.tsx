import React from 'react';
import { Text, View, ViewStyle, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import OneUpLogo from '../../assets/svgs/oneUp/oneUpLogo.svg';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import CustomToggleButton from './CustomToggleButton';

type PlayHeaderProps = {
  label?: string;
  containerStyle?: ViewStyle;
  toggalCallBack?: (value: boolean) => void;
  goldCoinBalance?: number;
  sweepCoinBalance?: number;
  selectedCoinType?: 'gold' | 'sweep';
  onCoinTypeChange?: (type: 'gold' | 'sweep') => void;
};

const PlayHeader: React.FC<PlayHeaderProps> = ({
  label = 'Play',
  containerStyle,
  toggalCallBack,
  goldCoinBalance = 0,
  sweepCoinBalance = 0,
  selectedCoinType = 'gold',
  onCoinTypeChange,
}) => {
  const styles = useThemeStyles();
  const navigation = useNavigation();

  const getCurrentBalance = () => {
    return selectedCoinType === 'gold' ? goldCoinBalance : sweepCoinBalance;
  };

  const handleCoinTypeToggle = () => {
    const newType = selectedCoinType === 'gold' ? 'sweep' : 'gold';
    onCoinTypeChange?.(newType);
  };

  const handlePlusButtonPress = () => {
    navigation.navigate('BuyCoin' as never);
  };

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
      {/* Left: 1UP + Label */}
      <View style={[styles.flexRow, styles.alignItemsCenter]}>
        <OneUpLogo width={40} height={24} />
        <Text
          style={[
            styles.ml2,
            styles.textWhite,
            styles.textSemiBold,
            styles.fontSize16,
          ]}
        >
          {label}
        </Text>
      </View>

      <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
        <TouchableOpacity onPress={handleCoinTypeToggle}>
          <Text style={[styles.textWhite, styles.textSemiBold, { fontSize: 12 }]}>
            {getCurrentBalance().toLocaleString()}
          </Text>
        </TouchableOpacity>

        <View style={[styles.gap2, styles.flexRow]}>
          <CustomToggleButton callBack={(value) => toggalCallBack?.(value)} />
          <TouchableOpacity onPress={handlePlusButtonPress}>
            <Image
              source={require('../../assets/pngs/plusbtn.png')}
              style={styles.plusbtn}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PlayHeader;
