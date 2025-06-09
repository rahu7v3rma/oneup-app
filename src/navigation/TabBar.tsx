import IonIcon from '@react-native-vector-icons/ionicons';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

export const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const styles = useThemeStyles();

  const getIcon = (name: string, isFocused: boolean) => {
    switch (name) {
      case 'Feed':
        return (
          <IonIcon
            name="flash-outline"
            size={24}
            style={isFocused ? styles.textPrimary : styles.textMuted}
          />
        );
      case 'Wagers':
        return (
          <MaterialIcon
            name="toll"
            size={24}
            style={isFocused ? styles.textPrimary : styles.textMuted}
          />
        );
      case 'Scores':
        return (
          <MaterialIcon
            name="scoreboard"
            size={24}
            style={isFocused ? styles.textPrimary : styles.textMuted}
          />
        );
      case 'Messages':
        return (
          <MaterialIcon
            name="chat-bubble-outline"
            size={24}
            style={isFocused ? styles.textPrimary : styles.textMuted}
          />
        );
    }
  };

  return (
    <View
      style={[styles.flexRow, styles.alignItemsEnd, styles.p4, styles.appBG]}
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
