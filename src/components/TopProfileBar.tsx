import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import BackButton from '../shared/backButton';
import { useThemeStyles } from '../theme/ThemeStylesProvider';
import { AuthContext } from '../context/authContext';
import { BaseURLForImages } from '../api/utils/api-client';

type TopNavbarProps = {
  label?: string;
  showSearchIcon?: boolean;
  profileImage?: string;
  backButton?: boolean;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
};

/**
 * TopProfileBar component displays a top navigation section
 * with optional search and notification icons and a profile image.
 *
 * @param showSearchIcon - Whether to show the search icon
 * @param profileImage - Optional profile image URL
 * @param onSearchPress - Callback for search icon press
 * @param onNotificationPress - Callback for notification icon press
 * @param onProfilePress - Callback for profile image press
 */

const TopProfileBar = (props: TopNavbarProps) => {
  const {
    backButton,
    label,
    showSearchIcon,
    onSearchPress,
    onNotificationPress,
    onProfilePress,
  } = props;
  const styles = useThemeStyles();
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  return (
    <View
      style={[
        styles.flexRow,
        styles.justifyContentBetween,
        styles.alignItemsCenter,
        styles.ph4,
      ]}
    >
      <View>
        {backButton && (
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
        <Text style={[styles.textSupporting, styles.fontWeigthMedium]}>
          {label}
        </Text>
      </View>
      <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap4]}>
        {showSearchIcon && (
          <TouchableOpacity onPress={onSearchPress}>
            <Icon name="search-outline" size={24} style={styles.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onNotificationPress}>
          <Icon
            name="notifications-outline"
            size={24}
            style={styles.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>onProfilePress? onProfilePress() : navigation.navigate('SetttingsNav'as never)}>
          <Image
            source={
               user?.avatar? {uri: BaseURLForImages + user?.avatar} : require('../../assets/images/default-profile-image.png') 
            }
            width={36}
            height={36}
            style={[styles.br20]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopProfileBar;
