import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import React, { FunctionComponent, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import Text from './text';

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);

interface WeekData {
  id: string;
  week: number;
  season: number;
  displayName: string;
  startDate: string;
  endDate: string;
  timeframe: any;
  isCurrentWeek: boolean;
}

type Props = {
  availableWeeks: WeekData[];
  selectedWeek: WeekData | null;
  onWeekSelect: (week: WeekData) => void;
  currentWeekIndex: number;
};

const WeeklyCalendar: FunctionComponent<Props> = ({
  availableWeeks,
  selectedWeek,
  onWeekSelect,
  currentWeekIndex,
}) => {
  const themStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const flatListRef = useRef<FlatList<WeekData>>(null);

  const getItemLayout = (_: any, index: number) => ({
    length: 100,
    offset: 100 * index,
    index,
  });

  useEffect(() => {
    // Scroll to current week when nothing is selected
    if (!selectedWeek && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentWeekIndex,
          animated: true,
          viewPosition: 0.1,
        });
      }, 100);
    }
  }, [selectedWeek, currentWeekIndex]);

  useEffect(() => {
    if (
      availableWeeks.length > 0 &&
      currentWeekIndex >= 0 &&
      flatListRef.current
    ) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentWeekIndex,
          animated: true,
          viewPosition: 0.1,
        });
      }, 500);
    }
  }, [availableWeeks, currentWeekIndex]);

  useEffect(() => {
    if (selectedWeek && flatListRef.current) {
      const index = availableWeeks.findIndex((w) => w.id === selectedWeek.id);
      if (index > -1) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [selectedWeek, availableWeeks]);

  const renderItem = ({ item }: { item: WeekData }) => {
    const isSelected = selectedWeek?.id === item.id;
    const displayDateRange = item.isCurrentWeek
      ? 'CURRENT'
      : `${item.startDate} - ${item.endDate}`;
    return (
      <TouchableOpacity onPress={() => onWeekSelect(item)}>
        <View
          style={[
            styles.weekItem,
            themStyles.justifyContentCenter,
            themStyles.alignItemsCenter,
          ]}
        >
          <Text
            style={[
              styles.weekText,
              {
                color: isSelected
                  ? themeColors.textGreen
                  : themeColors.slateGray,
              },
            ]}
          >
            {displayDateRange}
          </Text>
          <Text
            style={[
              styles.weekNumber,
              {
                color: isSelected
                  ? themeColors.textWhite
                  : themeColors.textSupporting,
              },
            ]}
          >
            {item.displayName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={availableWeeks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      getItemLayout={getItemLayout}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({
            index: info.index,
            animated: true,
            viewPosition: 0.5,
          });
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  weekText: {
    fontSize: 8,
    lineHeight: 14,
    fontWeight: '500',
  },
  weekNumber: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
  },
  container: {
    height: 50,
    fontFamily: 'Inter',
    backgroundColor: '#10151B',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekItem: {
    width: 100,
    height: 55,
    marginHorizontal: 3,
    borderRadius: 8,
    padding: 8,
  },
});

export default WeeklyCalendar;
