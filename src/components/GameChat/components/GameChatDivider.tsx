import type React from 'react';
import { View, StyleSheet } from 'react-native';

const GameChatDivider: React.FC = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#353A6D',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default GameChatDivider;
