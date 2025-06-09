import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import Text from '../shared/text';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);

type Props = Record<string, never>;

interface WeekItem {
  startDate: string;
  endDate: string;
  weekNumber: number;
  isCurrentWeek: boolean;
}

const getWeeks = (): WeekItem[] => {
  const weeks: WeekItem[] = [];
  const today = dayjs();
  const currentYear = today.year();

  let firstWeekStart = dayjs(`${currentYear}-01-01`).startOf('week');

  while (firstWeekStart.year() <= currentYear) {
    const startOfWeek = firstWeekStart;
    const endOfWeek = startOfWeek.endOf('week');

    if (startOfWeek.year() > currentYear) break;

    weeks.push({
      startDate: startOfWeek.format('MMM D'),
      endDate: endOfWeek.format('D'),
      weekNumber: startOfWeek.isoWeek(),
      isCurrentWeek:
        startOfWeek.isoWeek() === today.isoWeek() &&
        startOfWeek.year() === today.year(),
    });

    firstWeekStart = firstWeekStart.add(1, 'week');
  }

  return weeks;
};

const WeeklyCalendar: FunctionComponent<Props> = () => {
  const themStyles = useThemeStyles();
  const { themeColors } = useTheme();
  const weeks = getWeeks();
  const flatListRef = useRef<FlatList<WeekItem>>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    const index = weeks.findIndex((week) => week.isCurrentWeek);
    setCurrentIndex(index);
  }, [weeks]);

  const onListLayout = () => {
    if (currentIndex !== null && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const renderItem = ({ item }: { item: WeekItem }) => (
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
            color: item.isCurrentWeek
              ? themeColors.textWhite
              : themeColors.inputPlaceholderClr,
          },
        ]}
      >
        {item.isCurrentWeek ? 'CURRENT' : `${item.startDate}–${item.endDate}`}
      </Text>
      <Text
        style={[
          styles.weekNumber,
          {
            color: item.isCurrentWeek
              ? themeColors.textWhite
              : themeColors.inputPlaceholderClr,
          },
        ]}
      >
        Week {item.weekNumber}
      </Text>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={weeks}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      onLayout={onListLayout}
      getItemLayout={(_, index) => ({
        length: 82,
        offset: 82 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  weekItem: {
    width: 70,
    height: 24,
    marginHorizontal: 6,
  },
  weekText: {
    fontSize: 6,
    lineHeight: 14,
  },
  weekNumber: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 14,
  },
});

export default WeeklyCalendar;
