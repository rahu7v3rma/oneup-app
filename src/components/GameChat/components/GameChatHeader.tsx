import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import type React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import OneUpLogo from '../../../../assets/svgs/oneUp/oneUpLogo.svg';
import BackButton from '../../../shared/backButton';

interface GameChatHeaderProps {
  displayTitle?: string;
  themeStyles: any;
  showBackButton?: boolean;
  onStarPress?: () => void;
  onMenuPress?: () => void;
  containerStyle?: ViewStyle;
  gameDate?: string;
  gameTime?: string;
  homeTeam?: string;
  awayTeam?: string;
  menuActive?: boolean;
  themeColors?: any;
}

const GameChatHeader: React.FC<GameChatHeaderProps> = ({
  displayTitle,
  themeStyles,
  showBackButton = false,
  onMenuPress,
  containerStyle,
  gameDate,
  gameTime,
  menuActive = false,
  themeColors,
}) => {
  const navigation = useNavigation();

  if (showBackButton) {
    return (
      <View
        style={[
          themeStyles.flexRow,
          themeStyles.justifyContentBetween,
          themeStyles.alignItemsCenter,
          themeStyles.ph4,
          themeStyles.pv4,
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
            themeStyles.flex1,
            themeStyles.alignItemsCenter,
            themeStyles.flexRow,
            themeStyles.justifyContentCenter,
            themeStyles.gap2,
          ]}
        >
          <Text style={[themeStyles.textInterSemiBold, themeStyles.fontSize14]}>
            {displayTitle}
          </Text>
          <View style={styles.gameInfoContainer}>
            <Text
              style={[themeStyles.textSupportingSmall, styles.gameDateText]}
            >
              {' '}
              {gameDate}{' '}
            </Text>
            <Text style={[themeStyles.textInterSemiBold, styles.gameTimeText]}>
              {' '}
              {gameTime}{' '}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onMenuPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name="ellipsis-horizontal"
            size={24}
            style={
              menuActive && themeColors
                ? { color: themeColors.textGreen }
                : themeStyles.textMuted
            }
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        themeStyles.flexRow,
        themeStyles.justifyContentBetween,
        themeStyles.alignItemsCenter,
        themeStyles.ph4,
        themeStyles.pv4,
        themeStyles.bgPrimary,
        containerStyle,
      ]}
    >
      <View style={[styles.logoContainer]}>
        <OneUpLogo width={39} height={27} />
      </View>
      <View style={[styles.centerContainer]}>
        <Text style={[themeStyles.textInterSemiBold]}>Game Chat</Text>
      </View>
      <TouchableOpacity
        onPress={
          onMenuPress || (() => navigation.navigate('SetttingsNav' as never))
        }
      >
        <Icon name="menu-sharp" size={24} style={themeStyles.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerIcon: {
    marginHorizontal: 8,
  },
  headerTitleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 39,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  gameDateText: {
    fontSize: 12,
  },
  gameTimeText: {
    fontSize: 16,
  },
});

export default GameChatHeader;
