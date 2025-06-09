import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

export interface ICenterElementProps {
  status: string;
  desc: string;
  winner?: boolean;
}

export function CenterElement({ desc, winner }: ICenterElementProps) {
  const themeStyles = useThemeStyles();
  return (
    <View style={[styles.centerContainer]}>
      <View style={[styles.container]}>
        <View style={[styles.winnerArrowContainer]}>
          {winner && (
            <FontAwesome6
              name="chevron-left"
              size={14}
              color={themeStyles.themeTextColor.color}
              iconStyle="solid"
            />
          )}
        </View>
        <View style={[styles.centerContainer]}>
          <Text style={[styles.centerText, themeStyles.themeTitleTextColor]}>
            {desc}
          </Text>
        </View>
        <View style={[styles.winnerArrowContainer]}>
          {winner !== undefined && !winner && (
            <FontAwesome6
              name="chevron-right"
              size={14}
              color={themeStyles.themeTextColor.color}
              iconStyle="solid"
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 14,
    lineHeight: 14,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  winnerArrowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
