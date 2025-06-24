import { GameRecapTable, GameRecapTableHeader } from '@shared/GameRecapTable';
import { StyleSheet, View, Text } from 'react-native';

import { Team } from '../components/Team';

import ScoringSummary from './components/ScoringSummary';

interface GameOverProps {
  awayTeam: Team;
  homeTeam: Team;
  scores:
    | {
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
      }
    | null
    | undefined;
}

const GameOver = ({ awayTeam, homeTeam, scores }: GameOverProps) => {
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

  return (
    <View style={styles.container}>
      <View>
        <GameRecapTableHeader />
        <GameRecapTable data={teamData} />
      </View>
      <View style={styles.scoringView}>
        <ScoringSummary scoreId={scores.id} />
      </View>
    </View>
  );
};

export default GameOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoringView: {
    marginTop: 14,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
