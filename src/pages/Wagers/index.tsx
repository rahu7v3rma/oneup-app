import { StyleSheet, View } from 'react-native';
import { ThemeColors } from 'theme/colors';

import { useTheme } from '../../theme/ThemeProvider';

const Wagers = () => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return <View style={styles.wagerView} />;
};

export default Wagers;

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({ wagerView: { backgroundColor: colors.appBG, flex: 1 } });
