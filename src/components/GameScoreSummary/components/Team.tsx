import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { StyleSheet, Text, View } from 'react-native';

import { ThemeColors } from '../../../theme/colors';
import { Fonts } from '../../../theme/fonts';
import { useTheme } from '../../../theme/ThemeProvider';
import { useThemeStyles } from '../../../theme/ThemeStylesProvider';
import { renderLogo } from '../../../utils/logoRenderer';

type GameStatus = 'before' | 'live' | 'final' | 'scheduled';

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
  const themeStyles = useThemeStyles();

  return (
    <View style={styles.team}>
      <View>
        {renderLogo(team.logo, styles, 56, 56)}
        <Text style={styles.abbreviation}>{team.shortName}</Text>
      </View>
      <View style={styles.scoreContainer}>
        {status === 'before' && (
          <Text
            style={styles.record}
          >{`${team.record!.A} - ${team.record!.B}`}</Text>
        )}
        {status !== 'before' && <Text style={styles.score}>{team.score}</Text>}
        {status === 'final' && !lost ? (
          <FontAwesome6
            name="caret-left"
            size={12}
            color={themeStyles.themeTextColor.color}
            iconStyle="solid"
          />
        ) : (
          <View />
        )}
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
    teamLogo: {
      width: 56,
      height: 56,
    },
    record: {
      color: themeColor.text,
      fontSize: 16,
      fontFamily: Fonts.RobotoRegular,
      letterSpacing: 0,
    },
    playIcon: {
      width: 10,
    },
    logoPlaceholder: {
      width: 40,
      height: 38,
      marginRight: 10,
      backgroundColor: '#ddd', // Optional: Add a background color
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
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
