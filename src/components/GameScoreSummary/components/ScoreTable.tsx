import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemeStyles } from 'styles';

import Text from '../../../shared/text';
import { Fonts } from '../../../theme/fonts';
import { useThemeStyles } from '../../../theme/ThemeStylesProvider';
import { renderLogo } from '../../../utils/logoRenderer';

export type ScoreItem = {
  logo: string | number;
  spread: string;
  total_points: string;
  money_line: string;
};

const ScoreTable = ({ tableData }: { tableData: Array<ScoreItem> }) => {
  const themeStyles = useThemeStyles();
  const styles = getStyles(themeStyles);

  const renderItem = ({ item }: { item: ScoreItem }) => (
    <View style={styles.tableRow}>
      <View style={styles.iconTitle}>
        {renderLogo(item.logo, styles, 24, 24)}
      </View>
      <View style={styles.headerCell}>
        <Text style={styles.cellText}>{item.spread}</Text>
      </View>
      <View style={styles.headerCell}>
        <Text style={styles.cellText}>{item.total_points}</Text>
      </View>
      <View style={styles.headerCell}>
        <Text style={styles.cellText}>{item.money_line}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.iconTitle}>{''}</Text>
        <Text style={styles.headerTitle}>{'Spread'}</Text>
        <Text style={styles.headerTitle}>{'Total Points'}</Text>
        <Text style={styles.headerTitle}>{'Moneyline'}</Text>
      </View>
      <FlatList
        data={tableData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const getStyles = (themeStyles: ThemeStyles) =>
  StyleSheet.create({
    tableContainer: {
      ...themeStyles.card,
      padding: 10,
    },
    logoContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tableHeader: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      marginBottom: 8,
    },
    tableRow: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      marginBottom: 4,
    },
    iconTitle: {
      flex: 0.4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoPlaceholder: {
      width: 24,
      height: 24,
      backgroundColor: '#ddd',
      borderRadius: 4,
    },
    teamLogo: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
    },
    headerTitle: {
      flex: 1,
      fontSize: 8,
      lineHeight: 14,
      fontFamily: Fonts.RobotoMedium,
      textAlign: 'center',
      fontWeight: '500',
    },
    headerCell: {
      flex: 1,
      backgroundColor: themeStyles.appBG.backgroundColor,
      marginHorizontal: 1.5,
      padding: 4.5,
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cellText: {
      fontSize: 8,
      lineHeight: 14,
      fontFamily: Fonts.WorkSansMedium,
      textAlign: 'center',
      fontWeight: '500',
    },
  });

export default ScoreTable;
