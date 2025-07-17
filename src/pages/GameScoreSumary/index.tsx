import Spacer from '@shared/Spacer';
import TopProfileBar from '@shared/TopProfileBar';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GameScore from '../../components/GameScoreSummary';
import { ThemeColors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';

const GameScoreSumary = () => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <SafeAreaView style={styles.container}>
      <Spacer multiplier={1} />
      <TopProfileBar backButton />
      <GameScore />
    </SafeAreaView>
  );
};

export default GameScoreSumary;

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: colors.appBG,
    },
  });
