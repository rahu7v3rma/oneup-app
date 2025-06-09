import React from 'react';
import { FlatList, ListRenderItem, View, StyleSheet, Text } from 'react-native';

import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

type TeamScore = {
  image: any;
  teamName: string;
  record: string;
  scores: number[];
  total: number;
};

type GameRecapTableProps = {
  data: TeamScore[];
};

export const GameRecapTable: React.FC<GameRecapTableProps> = ({ data }) => {
  const { themeColors } = useTheme();

  const renderItem: ListRenderItem<TeamScore> = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.leftBoxCard}>
        <View style={styles.logoBox}>{item?.image}</View>
        <Text style={[styles.teamText, { color: themeColors.textWhite }]}>
          {item?.teamName}
        </Text>
        <Text
          style={[styles.record, { color: themeColors.inputPlaceholderClr }]}
        >
          {item?.record}
        </Text>
      </View>
      <View style={styles.rightBoxCard}>
        {item?.scores?.map((score: number, i: number) => (
          <Text
            key={i + '_score'}
            style={[styles.record, { color: themeColors.inputPlaceholderClr }]}
          >
            {score}
          </Text>
        ))}
        <Text
          style={[styles.record, { color: themeColors.inputPlaceholderClr }]}
        >
          {item?.total}
        </Text>
      </View>
    </View>
  );
  return (
    <View
      style={[
        styles.wrapperCard,
        {
          backgroundColor: themeColors.cardBG,
        },
      ]}
    >
      <FlatList
        data={data}
        keyExtractor={(_, index: number) => index + '_team'}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperCard: {
    paddingVertical: 10,
    borderRadius: 16,
  },
  leftBoxCard: {
    width: '50%',
    paddingStart: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightBoxCard: {
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logoBox: {
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 7.5,
  },
  teamText: {
    fontSize: 10,
    fontFamily: Fonts.WorkSansBold,
    lineHeight: 14,
    paddingHorizontal: 12,
  },
  record: {
    fontSize: 10,
    fontFamily: Fonts.WorkSansRegular,
    lineHeight: 14,
  },
});
