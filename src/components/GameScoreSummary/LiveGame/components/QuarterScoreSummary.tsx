import type { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '../../../../shared/text';
import { useThemeStyles } from '../../../../theme/ThemeStylesProvider';
import type { ScoringPlay } from '../../../../types/match';
import { renderLogo } from '../../../../utils/logoRenderer';
import { Team } from '../../components/Team';

type Props = {
  scoreDetails?: {
    scoring_plays: ScoringPlay[];
  } | null;
  teams?: Record<string, any>;
  homeTeam: Team;
  awayTeam: Team;
  scores: {
    has_1st_quarter_started: boolean;
    has_2nd_quarter_started: boolean;
    has_3rd_quarter_started: boolean;
    has_4th_quarter_started: boolean;
    is_in_progress: boolean;
  };
};

const QuarterScoreSummary: FunctionComponent<Props> = ({
  scoreDetails,
  teams,
  scores,
}) => {
  const stylesTheme = useThemeStyles();

  const getCurrentQuarter = () => {
    if (!scores.has_1st_quarter_started) return 'Pre-Game';
    if (scores.has_4th_quarter_started) return '4th Quarter';
    if (scores.has_3rd_quarter_started) return '3rd Quarter';
    if (scores.has_2nd_quarter_started) return '2nd Quarter';
    if (scores.has_1st_quarter_started) return '1st Quarter';
    return '1st Quarter';
  };

  const getTeamLogo = (teamAbbr: string) => {
    const team = Object.values(teams || {}).find(
      (t: any) => t.short_name === teamAbbr || t.full_name.includes(teamAbbr),
    );
    return team?.logo_url || '';
  };

  // Get recent plays (last 5 plays or current quarter plays)
  const getDisplayPlays = () => {
    if (
      !scoreDetails?.scoring_plays ||
      scoreDetails.scoring_plays.length === 0
    ) {
      return [];
    }

    // For live games, show the most recent plays (last 5)
    const allPlays = [...scoreDetails.scoring_plays].reverse();
    return allPlays.slice(0, 5);
  };

  const displayPlays = getDisplayPlays();
  const currentQuarter = getCurrentQuarter();

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
      <Text>{currentQuarter}</Text>
      <View style={[styles.card, stylesTheme.appBG, stylesTheme.mt4]}>
        {displayPlays.length > 0 ? (
          displayPlays.map((play) => {
            const teamLogo = getTeamLogo(play.team);
            return (
              <View
                key={`scores-${play.scoring_play_id}`}
                style={[
                  stylesTheme.flexRow,
                  styles.rowItems,
                  stylesTheme.alignItemsCenter,
                ]}
              >
                {renderLogo(teamLogo, styles, 20, 20)}
                <Text
                  style={[stylesTheme.themeInputPlacholderColor, styles.text]}
                >
                  {play.time_remaining}
                </Text>
                <Text
                  style={[
                    styles.description,
                    stylesTheme.themeInputPlacholderColor,
                  ]}
                >
                  {play.play_description}
                </Text>
                <Text style={styles.text}>{play.score}</Text>
                <Text
                  style={[stylesTheme.themeInputPlacholderColor, styles.text]}
                >
                  {`${play.away_score}-${play.home_score}`}
                </Text>
              </View>
            );
          })
        ) : (
          <View
            style={[
              stylesTheme.flexRow,
              styles.rowItems,
              stylesTheme.alignItemsCenter,
            ]}
          >
            <View style={styles.logoPlaceholder} />
            <Text style={[stylesTheme.themeInputPlacholderColor, styles.text]}>
              --:--
            </Text>
            <Text
              style={[
                styles.description,
                stylesTheme.themeInputPlacholderColor,
              ]}
            >
              {scores.is_in_progress
                ? 'No recent scoring plays'
                : 'Game not started yet'}
            </Text>
            <Text style={styles.text}>--</Text>
            <Text style={[stylesTheme.themeInputPlacholderColor, styles.text]}>
              --
            </Text>
          </View>
        )}
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
  teamLogo: {
    width: 20,
    height: 20,
  },
  logoPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
});

export default QuarterScoreSummary;
