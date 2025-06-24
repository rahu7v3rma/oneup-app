import { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import useAppDispatch from '../../../hooks/useAppDispatch';
import { fetchScoreDetails, useSportSelectors } from '../../../reducers/match';
import {
  GameRecapTable,
  GameRecapTableHeader,
} from '../../../shared/GameRecapTable';
import GameScoreBar from '../components/GameScoreBar';
import { Team } from '../components/Team';

import QuarterScoreSummary from './components/QuarterScoreSummary';

interface LiveGameProps {
  scores: {
    id: number;
    score_id: number;
    api_event_id: number;
    home_team_score: number;
    away_team_score: number;
    home_score_quarter1: number;
    home_score_quarter2: number;
    home_score_quarter3: number;
    home_score_quarter4: number;
    home_score_overtime: number;
    away_score_quarter1: number;
    away_score_quarter2: number;
    away_score_quarter3: number;
    away_score_quarter4: number;
    away_score_overtime: number;
    has_started: boolean;
    is_in_progress: boolean;
    is_over: boolean;
    has_1st_quarter_started: boolean;
    has_2nd_quarter_started: boolean;
    has_3rd_quarter_started: boolean;
    has_4th_quarter_started: boolean;
    point_spread_away_team_moneyline: number;
    point_spread_home_team_moneyline: number;
    event: number;
  };
  awayTeam: Team;
  homeTeam: Team;
}

const LiveGame = ({ awayTeam, homeTeam, scores }: LiveGameProps) => {
  const dispatch = useAppDispatch();
  const { scoreDetails, teams } = useSportSelectors();

  useEffect(() => {
    if (scores?.id) {
      dispatch(fetchScoreDetails(scores.id));
    }
  }, [dispatch, scores?.id]);

  if (!scores) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Score data not available</Text>
      </View>
    );
  }

  const teamData = [
    {
      image: homeTeam.logo,
      teamName: homeTeam.name,
      record:
        homeTeam.record?.A && homeTeam.record?.B
          ? `${homeTeam.record.A}-${homeTeam.record.B}`
          : '0-0',
      scores: [
        scores.home_score_quarter1 || 0,
        scores.home_score_quarter2 || 0,
        scores.home_score_quarter3 || 0,
        scores.home_score_quarter4 || 0,
      ],
      total: scores.home_team_score || 0,
    },
    {
      image: awayTeam.logo,
      teamName: awayTeam.name,
      record:
        awayTeam.record?.A && awayTeam.record?.B
          ? `${awayTeam.record.A}-${awayTeam.record.B}`
          : '0-0',
      scores: [
        scores.away_score_quarter1 || 0,
        scores.away_score_quarter2 || 0,
        scores.away_score_quarter3 || 0,
        scores.away_score_quarter4 || 0,
      ],
      total: scores.away_team_score || 0,
    },
  ];

  const scoreItems = [
    {
      label: 'TIME OF POSSESION',
      homeValue: scores.point_spread_home_team_moneyline,
      awayValue: scores.point_spread_away_team_moneyline,
      isTime: false,
      reverse: false,
    },
    {
      label: 'TOTAL YARDS',
      homeValue: homeTeam.score,
      awayValue: awayTeam.score,
      isTime: false,
      reverse: false,
    },
  ];

  return (
    <View>
      <View>
        <GameRecapTableHeader />
        <GameRecapTable data={teamData} />
      </View>
      <ScrollView style={styles.recapView}>
        <QuarterScoreSummary
          scoreDetails={scoreDetails}
          teams={teams}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          scores={scores}
        />
      </ScrollView>
      <View>
        <GameScoreBar data={scoreItems} />
      </View>
    </View>
  );
};

export default LiveGame;

const styles = StyleSheet.create({
  recapView: { marginTop: 25 },
  container: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
