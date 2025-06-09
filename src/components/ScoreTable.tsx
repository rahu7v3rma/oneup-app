import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemeStyles } from 'styles';
import { useThemeStyles } from 'theme/ThemeStylesProvider';

import Text from '../shared/text';
import { Fonts } from '../theme/fonts';

type ScoreItem = {
  icon: () => React.JSX.Element;
  spread: string;
  total_points: string;
  money_line: string;
};

const ScoreTable = ({ tableData }: { tableData: Array<ScoreItem> }) => {
  const themeStyles = useThemeStyles();
  const styles = getStyles(themeStyles);
  const renderItem = ({ item }: { item: ScoreItem }) => (
    <View style={styles.tableHeader}>
      <View style={styles.iconTitle}>{item.icon()}</View>
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
    <View>
      <Text style={styles.bettingText}>Betting Lines</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.iconTitle}>{''}</Text>
          <Text style={styles.headerTitle}>{'Spread'}</Text>
          <Text style={styles.headerTitle}>{'Total Points'}</Text>
          <Text style={styles.headerTitle}>{'Moneyline'}</Text>
        </View>
        <FlatList
          data={tableData}
          keyExtractor={(item) => item.spread.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const getStyles = (themeStyles: ThemeStyles) =>
  StyleSheet.create({
    cellText: {
      fontSize: 8,
      lineHeight: 14,
      fontFamily: Fonts.WorkSansMedium,
      textAlign: 'center',
      fontWeight: 500,
    },
    headerCell: {
      flex: 1,
      marginHorizontal: 1.5,
      padding: 4.5,
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconTitle: {
      flex: 0.4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 8,
      lineHeight: 14,
      fontFamily: Fonts.RobotoMedium,
      textAlign: 'center',
      fontWeight: 500,
    },
    tableHeader: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      marginBottom: 3,
    },
    bettingText: {
      fontSize: 13,
      fontFamily: Fonts.RobotoMedium,
      marginLeft: 20,
      fontWeight: 400,
    },
    tableContainer: {
      ...themeStyles.card,
      padding: 10,
      marginHorizontal: 20,
      marginTop: 10,
    },
  });

export default ScoreTable;
