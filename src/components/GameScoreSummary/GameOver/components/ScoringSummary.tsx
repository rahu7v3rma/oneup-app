import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import useAppDispatch from '../../../../hooks/useAppDispatch';
import {
  fetchScoreDetails,
  useSportSelectors,
} from '../../../../reducers/match';
import type { ThemeColors } from '../../../../theme/colors';
import { Fonts } from '../../../../theme/fonts';
import { useTheme } from '../../../../theme/ThemeProvider';
import type { ScoringPlay } from '../../../../types/match';
import { renderLogo } from '../../../../utils/logoRenderer';

import Accordion from './accordion';

interface ScoringSummaryProps {
  scoreId?: number;
}

interface QuarterData {
  quarter: string;
  plays: ScoringPlay[];
}

const ScoringSummaryAccordionHeader = ({
  teamLogo,
  title,
  subtitle,
  homeScore,
  awayScore,
}: {
  teamLogo: string;
  title: string;
  subtitle: string;
  homeScore: number;
  awayScore: number;
}) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.accordionHeaderContainer}>
      <View style={styles.accordionItemTitleContainer}>
        {renderLogo(teamLogo, styles, 24, 24)}
        <View style={styles.accordionItemTitleTextContainer}>
          <Text style={styles.accordionItemTitle}>{title}</Text>
          <Text style={styles.accordionItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.accordionItemCountContainer}>
        <Text style={styles.accordionItemCountUnread}>{homeScore}</Text>
        <Text style={styles.accordionItemCountRead}>{awayScore}</Text>
      </View>
    </View>
  );
};

const ScoringSummaryAccordionContent = ({ play }: { play: ScoringPlay }) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  return (
    <View style={styles.accordionItemContentContainer}>
      <View style={styles.accordionItemContentItemContainer}>
        <Text style={styles.accordionItemContentTime}>
          {play.time_remaining}
        </Text>
        <Text style={styles.accordionItemContentText}>
          {play.play_description}
        </Text>
      </View>
    </View>
  );
};

const ScoringSummary = ({ scoreId }: ScoringSummaryProps) => {
  const { themeColors } = useTheme();
  const styles = createStyles(themeColors);
  const dispatch = useAppDispatch();
  const { scoreDetails, scoreDetailsLoading, teams } = useSportSelectors();
  const [expandedQuarters, setExpandedQuarters] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (scoreId) {
      dispatch(fetchScoreDetails(scoreId));
    }
  }, [dispatch, scoreId]);

  const toggleQuarter = (quarter: string) => {
    setExpandedQuarters((prev) => ({
      ...prev,
      [quarter]: !prev[quarter],
    }));
  };

  if (scoreDetailsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={themeColors.textWhite} />
      </View>
    );
  }

  if (
    !scoreDetails ||
    !scoreDetails.scoring_plays ||
    scoreDetails.scoring_plays.length === 0
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.scoringSummaryText}>Scoring Summary</Text>
        <View style={styles.divider} />
        <Text style={styles.noDataText}>No scoring data available</Text>
      </View>
    );
  }

  // Group plays by quarter
  const playsByQuarter: Record<string, ScoringPlay[]> = {};
  scoreDetails.scoring_plays.forEach((play) => {
    if (!playsByQuarter[play.quarter]) {
      playsByQuarter[play.quarter] = [];
    }
    playsByQuarter[play.quarter].push(play);
  });

  // Convert to array for rendering
  const quarters: QuarterData[] = Object.keys(playsByQuarter).map(
    (quarter) => ({
      quarter,
      plays: playsByQuarter[quarter],
    }),
  );

  // Sort quarters
  quarters.sort((a, b) => {
    const quarterOrder: Record<string, number> = {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      OT: 5,
    };
    return quarterOrder[a.quarter] - quarterOrder[b.quarter];
  });

  const getQuarterLabel = (quarter: string) => {
    switch (quarter) {
      case '1':
        return '1st Quarter';
      case '2':
        return '2nd Quarter';
      case '3':
        return '3rd Quarter';
      case '4':
        return '4th Quarter';
      case 'OT':
        return 'Overtime';
      default:
        return `${quarter} Quarter`;
    }
  };

  const getTeamLogo = (teamAbbr: string) => {
    const team = Object.values(teams).find(
      (t) => t.short_name === teamAbbr || t.full_name.includes(teamAbbr),
    );

    return team?.logo_url || '';
  };

  const getScoringTypeTitle = (play: ScoringPlay) => {
    if (play.play_description.includes('field goal')) {
      return 'Field Goal';
    } else if (play.play_description.includes('touchdown')) {
      return 'Touchdown';
    } else {
      return 'Score';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoringSummaryText}>Scoring Summary</Text>
      <View style={styles.divider} />

      {quarters.map((quarter) => (
        <View key={quarter.quarter}>
          <TouchableOpacity
            style={styles.quarterContainer}
            onPress={() => toggleQuarter(quarter.quarter)}
          >
            <Text style={styles.quarterText}>
              {getQuarterLabel(quarter.quarter)}
            </Text>
            <FontAwesome6
              name={
                expandedQuarters[quarter.quarter]
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={12}
              style={styles.quarterIcon}
              iconStyle="solid"
            />
          </TouchableOpacity>

          {expandedQuarters[quarter.quarter] && (
            <Accordion
              items={quarter.plays.map((play) => ({
                id: play.scoring_play_id,
                header: (
                  <ScoringSummaryAccordionHeader
                    teamLogo={getTeamLogo(play.team)}
                    title={getScoringTypeTitle(play)}
                    subtitle={`${play.team} - ${play.time_remaining}`}
                    homeScore={play.home_score}
                    awayScore={play.away_score}
                  />
                ),
                content: <ScoringSummaryAccordionContent play={play} />,
              }))}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const createStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    loadingContainer: {
      width: '100%',
      paddingVertical: 20,
      alignItems: 'center',
    },
    scoringSummaryText: {
      fontSize: 13,
      fontFamily: Fonts.RobotoRegular,
      color: themeColors.textWhite,
    },
    divider: {
      width: '100%',
      height: 1,
      marginTop: 5,
      backgroundColor: themeColors.inputPlaceholderClr,
    },
    quarterContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 10,
      marginRight: 10,
      marginBottom: 12,
    },
    quarterText: {
      fontSize: 13,
      fontFamily: Fonts.RobotoRegular,
      color: themeColors.textWhite,
    },
    accordionItemTitle: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.textWhite,
    },
    accordionItemSubtitle: {
      fontSize: 8,
      marginTop: 2,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
    },
    accordionItemTitleTextContainer: {
      flexDirection: 'column',
    },
    accordionItemCountContainer: {
      flexDirection: 'row',
      gap: 10,
      position: 'absolute',
      right: 5,
      alignSelf: 'center',
    },
    accordionItemCountUnread: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.textWhite,
    },
    accordionItemCountRead: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
    },
    accordionItemContentContainer: {
      flexDirection: 'column',
      gap: 10,
    },
    accordionItemContentItemContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    accordionItemContentTime: {
      fontSize: 10,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
    },
    accordionItemContentText: {
      fontSize: 8.8,
      fontFamily: Fonts.WorkSansRegular,
      color: themeColors.inputPlaceholderClr,
      width: '84%',
    },
    accordionItemTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    accordionHeaderContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    quarterIcon: {
      color: themeColors.inputPlaceholderClr,
    },
    teamLogo: {
      width: 24,
      height: 24,
    },
    logoPlaceholder: {
      width: 24,
      height: 24,
      backgroundColor: '#ddd',
      borderRadius: 4,
    },
    noDataText: {
      fontSize: 12,
      fontFamily: Fonts.RobotoRegular,
      color: themeColors.inputPlaceholderClr,
      marginTop: 10,
    },
  });
};

export default ScoringSummary;
