import { Image, StyleSheet, Text, View } from 'react-native';

import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

type GameStatus = 'before' | 'live' | 'final';

type Team = {
  name: string;
  shortName: string;
  logo: string;
  score: number;
  record: { A: number; B: number };
};

type TeamScoreProps = {
  isHomeTeam: boolean;
  team: Team;
  status: GameStatus;
  lost?: boolean;
};

const TeamScore = ({ isHomeTeam, team, status, lost }: TeamScoreProps) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors, isHomeTeam, status, lost);
  return (
    <View style={styles.team}>
      <View>
        <Image
          source={require('../../../assets/png/team-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.abbreviation}>{team.shortName}</Text>
      </View>
      <View>
        {status === 'before' && (
          <Text
            style={styles.record}
          >{`${team.record.A} - ${team.record.B}`}</Text>
        )}
        {status !== 'before' && <Text style={styles.score}>{team.score}</Text>}
      </View>
    </View>
  );
};

const getStyles = (
  themeColor: ThemeColors,
  isHomeTeam: boolean,
  status: GameStatus,
  lost?: boolean,
) =>
  StyleSheet.create({
    team: {
      flexDirection: isHomeTeam ? 'row' : 'row-reverse',
      gap: 10,
      alignItems: 'center',
    },
    logo: {
      width: 56,
      height: 56,
    },
    record: {
      color: themeColor.text,
      fontSize: 16,
      fontFamily: Fonts.RobotoRegular,
      letterSpacing: 0,
    },
    score: {
      color:
        status === 'final' && lost
          ? themeColor.inputPlaceholderClr
          : themeColor.text,
      fontSize: 24,
      fontFamily: Fonts.RobotoRegular,
      letterSpacing: 0,
    },
    abbreviation: {
      textAlign: 'center',
      fontFamily: Fonts.WorkSansBold,
      color: themeColor.text,
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0,
    },
  });

export type { GameStatus, Team };
export { TeamScore };
