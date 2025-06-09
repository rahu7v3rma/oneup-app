import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Betting2, Eagle } from './assets/svgs';
import ScoreTable from './src/components/ScoreTable';
import { useTheme } from './src/theme/ThemeProvider';

export default function OneupApp() {
  const { themeColors } = useTheme();
  const data = [
    {
      icon: Eagle,
      spread: '-3.5',
      total_points: 'O40',
      money_line: '+340',
    },
    {
      icon: Betting2,
      spread: '+3.5',
      total_points: 'U40',
      money_line: '-340',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.appBG }]}>
      <StatusBar backgroundColor={themeColors.appBG} />
      <SafeAreaView>
        <ScoreTable tableData={data} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? undefined : 40,
  },
});
