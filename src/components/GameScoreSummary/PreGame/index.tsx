import { StyleSheet, View } from 'react-native';

import Text from '../../../shared/text';
import { Fonts } from '../../../theme/fonts';
import PreGameScoreBar from '../components/GameScoreBar';
import ScoreTable, { ScoreItem } from '../components/ScoreTable';

interface PreGameProps {
  eventDetails: {
    bet_point_spread: number;
    bet_over_under: number;
    bet_home_team_money_line: number;
    bet_away_team_money_line: number;
  };
  awayTeamLogo: string;
  homeTeamLogo: string;
  gameLabel?: string;
}

const PreGame = ({
  eventDetails,
  awayTeamLogo,
  homeTeamLogo,
  gameLabel,
}: PreGameProps) => {
  const styles = getStyles();
  const homeSpread = eventDetails.bet_point_spread.toFixed(1);
  const awaySpreadValue = eventDetails.bet_point_spread * -1;
  const awaySpread = awaySpreadValue.toFixed(1);
  const formattedAwaySpread =
    awaySpreadValue > 0 ? `+${awaySpread}` : awaySpread;
  const label = gameLabel || 'Game 1: Team A vs Team B';

  const tableData: Array<ScoreItem> = [
    {
      logo: homeTeamLogo,
      spread: homeSpread,
      total_points: eventDetails.bet_over_under.toFixed(1),
      money_line: eventDetails.bet_home_team_money_line.toString(),
    },
    {
      logo: awayTeamLogo,
      spread: formattedAwaySpread,
      total_points: eventDetails.bet_over_under.toFixed(1),
      money_line: eventDetails.bet_away_team_money_line.toString(),
    },
  ];

  const spreadValue = [
    {
      label,
      homeValue: eventDetails.bet_point_spread, // number
      awayValue: awaySpreadValue, // number
      isTime: false,
      reverse: false,
    },
  ];

  const pointsValue = [
    {
      label,
      homeValue: eventDetails.bet_over_under, // number
      awayValue: eventDetails.bet_over_under, // number
      isTime: false,
      reverse: false,
    },
  ];

  const moneylineValue = [
    {
      label,
      homeValue: eventDetails.bet_home_team_money_line, // number
      awayValue: eventDetails.bet_away_team_money_line, // number
      isTime: false,
      reverse: false,
    },
  ];

  return (
    <View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Betting Lines</Text>
        <ScoreTable tableData={tableData} />
      </View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Spread</Text>
        <PreGameScoreBar data={spreadValue} />
      </View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Total Points</Text>
        <PreGameScoreBar data={pointsValue} />
      </View>
      <View style={styles.dataView}>
        <Text style={styles.heading}>Moneyline</Text>
        <PreGameScoreBar data={moneylineValue} />
      </View>
    </View>
  );
};

export default PreGame;

const getStyles = () =>
  StyleSheet.create({
    dataView: { marginBottom: 9 },
    heading: {
      fontSize: 13,
      marginBottom: 9,
      fontFamily: Fonts.RobotoMedium,
      fontWeight: 400,
    },
  });
