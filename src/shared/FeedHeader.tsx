import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import OneUpLogo from '../../assets/svgs/oneUp/oneUpLogo.svg';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import BackButton from './backButton';

type FeedHeaderProps = {
  label?: string;
  showBackButton?: boolean;
  onHamburgerPress?: () => void;
  containerStyle?: ViewStyle;
};

const FeedHeader: React.FC<FeedHeaderProps> = ({
  label = 'Feed',
  showBackButton = false,
  onHamburgerPress,
  containerStyle,
}) => {
  const styles = useThemeStyles();
  const navigation = useNavigation();

  if (showBackButton) {
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
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View
          style={[
            styles.flex1,
            styles.alignItemsCenter,
            styles.flexRow,
            styles.justifyContentCenter,
            styles.gap2,
          ]}
        >
          <OneUpLogo width={39} height={27} />
          <Text style={[styles.textInterSemiBold]}>{label}</Text>
        </View>
        <TouchableOpacity
          onPress={
            onHamburgerPress ||
            (() => navigation.navigate('SetttingsNav' as never))
          }
        >
          <Icon name="menu-sharp" size={24} style={styles.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

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
      <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
        <OneUpLogo width={39} height={27} />
        <Text style={[styles.textInterSemiBold]}>{label}</Text>
      </View>
      <TouchableOpacity
        onPress={
          onHamburgerPress ||
          (() => navigation.navigate('SetttingsNav' as never))
        }
      >
        <Icon name="menu-sharp" size={24} style={styles.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

export default FeedHeader;
