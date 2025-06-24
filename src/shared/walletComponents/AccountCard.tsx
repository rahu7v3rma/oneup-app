import Icon from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

import { darkColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface AccountCardProps {
  icon: ImageSourcePropType;
  name: string;
  subtext: string;
  onPress?: () => void;
  isDivider?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  icon,
  name,
  subtext,
  onPress,
  isDivider = true,
}) => (
  <>
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtext}>{subtext}</Text>
      </View>
      <Icon name="chevron-forward" size={10} color={darkColors.text} />
    </TouchableOpacity>
    {isDivider && <View style={styles.divider} />}
  </>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  icon: { width: 35, height: 25, marginRight: 12 },
  info: { flex: 1 },
  name: {
    color: darkColors.text,
    fontFamily: Fonts.WorkSansMedium,
    fontSize: 12,
  },
  subtext: {
    color: darkColors.text,
    fontFamily: Fonts.WorkSansLight,
    fontSize: 10,
  },
  divider: {
    height: 2,
    width: '95%',
    backgroundColor: darkColors.mutedText,
    alignSelf: 'center',
  },
});

export default AccountCard;
