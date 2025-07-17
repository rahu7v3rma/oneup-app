import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import OneUpLogo from '../../assets/svgs/oneUp/oneUpLogo.svg';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import BackButton from './backButton';

type MenuHeaderProps = {
  title: string;
  navigateTo?: string;
  showBackButton?: boolean;
  onHamburgerPress?: () => void;
  containerStyle?: ViewStyle;
};

const MenuHeader: React.FC<MenuHeaderProps> = ({
  title,
  navigateTo,
  showBackButton = false,
  onHamburgerPress,
  containerStyle,
}) => {
  const styles = useThemeStyles();
  const navigation = useNavigation<any>();

  const handleHamburgerPress = () => {
    if (onHamburgerPress) {
      onHamburgerPress();
    } else if (navigateTo) {
      navigation.navigate(navigateTo);
    } else {
      navigation.goBack();
    }
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
      {showBackButton ? (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ) : (
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
          <OneUpLogo width={39} height={27} />
          <Text style={[styles.textInterSemiBold]}>{title}</Text>
        </View>
      )}
      <TouchableOpacity onPress={handleHamburgerPress}>
        <Icon name="menu-sharp" size={24} style={styles.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

export default MenuHeader;
