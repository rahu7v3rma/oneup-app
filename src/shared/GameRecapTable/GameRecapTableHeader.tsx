import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

const headers = ['1st', '2nd', '3rd', '4th', 'TOT'] as const;
export const GameRecapTableHeader: React.FC = () => {
  const { themeColors } = useTheme();
  return (
    <View style={styles.headerRow}>
      <View style={styles.tableHeaderLeft} />
      <View style={styles.tableHeaderRight}>
        {headers?.map((header: string, idx: number) => (
          <Text
            key={idx + '_header'}
            style={[styles.headerText, { color: themeColors.textWhite }]}
          >
            {header}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tableHeaderLeft: {
    flex: 1,
  },
  tableHeaderRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  headerRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 12,
    fontFamily: Fonts.RobotoRegular,
    lineHeight: 14,
  },
});
