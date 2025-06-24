import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { gameRecapData } from '../../constants';
import {
  GameRecapTable,
  GameRecapTableHeader,
} from '../../shared/GameRecapTable';
import { useTheme } from '../../theme/ThemeProvider';

const AfterGameRecap: React.FC = () => {
  const { themeColors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeContainer, { backgroundColor: themeColors.appBG }]}
    >
      <GameRecapTableHeader />
      <GameRecapTable data={gameRecapData} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default AfterGameRecap;
