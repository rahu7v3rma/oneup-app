import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { Eagles } from '../../assets/svgs';
import Text from '../shared/text';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

type Props = Record<string, never>;

const SCORES = [
  {
    id: 1,
    logo: Eagles,
    time: '10:58',
    description:
      '[4th & 13 @ CLE 30] c. Boswell 48 yard field goal attempt is good. Center-C. Kuntz, Holder-C. Waltman',
    score: 99,
    totalScore: 99,
  },
  {
    id: 2,
    logo: Eagles,
    time: '10:58',
    description:
      '[4th & 13 @ CLE 30] c. Boswell 48 yard field goal attempt is good. Center-C. Kuntz, Holder-C. Waltman',
    score: 99,
    totalScore: 99,
  },
  {
    id: 3,
    logo: Eagles,
    time: '10:58',
    description:
      '[4th & 13 @ CLE 30] c. Boswell 48 yard field goal attempt is good. Center-C. Kuntz, Holder-C. Waltman',
    score: 99,
    totalScore: 99,
  },
  {
    id: 4,
    logo: Eagles,
    time: '10:58',
    description:
      '[4th & 13 @ CLE 30] c. Boswell 48 yard field goal attempt is good. Center-C. Kuntz, Holder-C. Waltman',
    score: 99,
    totalScore: 99,
  },
  {
    id: 5,
    logo: Eagles,
    time: '10:58',
    description:
      '[4th & 13 @ CLE 30] c. Boswell 48 yard field goal attempt is good. Center-C. Kuntz, Holder-C. Waltman',
    score: 99,
    totalScore: 99,
  },
];

const QuarterScoreSummary: FunctionComponent<Props> = ({}: Props) => {
  const stylesTheme = useThemeStyles();

  return (
    <View style={stylesTheme.ph4}>
      <Text>Current Drive</Text>
      <View
        style={[
          styles.horizontalLine,
          stylesTheme.themeGrayishBackground,
          stylesTheme.mv2,
        ]}
      />
      <Text>2nd Quarter</Text>
      <View style={[styles.card, stylesTheme.themeInputBg, stylesTheme.mt4]}>
        {SCORES?.map((item) => {
          return (
            <View
              key={`scores-${item?.id}`}
              style={[
                stylesTheme.flexRow,
                styles.rowItems,
                stylesTheme.alignItemsCenter,
              ]}
            >
              <item.logo />
              <Text
                style={[stylesTheme.themeInputPlacholderColor, styles.text]}
              >
                {item?.time}
              </Text>
              <Text
                style={[
                  styles.description,
                  stylesTheme.themeInputPlacholderColor,
                ]}
              >
                {item?.description}
              </Text>
              <Text style={styles.text}>{item?.score}</Text>
              <Text
                style={[stylesTheme.themeInputPlacholderColor, styles.text]}
              >
                {item?.totalScore}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  card: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  rowItems: {
    marginBottom: 10,
    gap: 10,
  },
  text: {
    fontSize: 10,
    lineHeight: 14,
  },
  description: {
    flex: 1,
    fontSize: 8,
    lineHeight: 9,
  },
});

export default QuarterScoreSummary;
