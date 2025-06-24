import Icon from '@react-native-vector-icons/ionicons';
import type React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameChatHeaderProps {
  displayTitle: string;
  themeStyles: any;
  onStarPress?: () => void;
  onMenuPress?: () => void;
}

const GameChatHeader: React.FC<GameChatHeaderProps> = ({
  displayTitle,
  themeStyles,
  onStarPress,
  onMenuPress,
}) => {
  return (
    <View style={[themeStyles.flexRow, styles.headerRow]}>
      <TouchableOpacity style={styles.headerIcon} onPress={onStarPress}>
        <Icon name="star-outline" size={24} color="#8F8184" />
      </TouchableOpacity>
      <View style={styles.headerTitleBlock}>
        <Text style={styles.headerTitle}>{displayTitle}</Text>
      </View>
      <TouchableOpacity style={styles.headerIcon} onPress={onMenuPress}>
        <Icon name="ellipsis-horizontal" size={24} color="#8F8184" />
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
    backgroundColor: '#181C4A',
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
});

export default GameChatHeader;
