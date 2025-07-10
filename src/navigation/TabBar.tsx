import FeedIcon from '@components/icons/tabNavigation/FeedIcon';
import MessageIcon from '@components/icons/tabNavigation/MessageIcon';
import PlayIcon from '@components/icons/tabNavigation/PlayIcon';
import ScoreIcon from '@components/icons/tabNavigation/ScoreIcon';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const styles = useThemeStyles();

  const getIcon = (name: string, isFocused: boolean) => {
    const color = isFocused
      ? styles.textPrimary.color
      : styles.textSupporting.color;
    const size = 30;

    switch (name) {
      case 'Feed':
        return <FeedIcon color={color} size={size} />;
      case 'Play':
        return <PlayIcon color={color} size={size} />;
      case 'Scores':
        return <ScoreIcon color={color} size={size} />;
      case 'Messages':
        return <MessageIcon color={color} size={size} />;
    }
  };

  return (
    <View
      style={[
        styles.flexRow,
        styles.alignItemsEnd,
        styles.p4,
        styles.appHeaderBG,
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={[styles.flex1, styles.alignItemsCenter, styles.gap2]}
            onPress={onPress}
          >
            {getIcon(route.name, isFocused)}
            <Text style={isFocused ? styles.textPrimary : styles.textMuted}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
