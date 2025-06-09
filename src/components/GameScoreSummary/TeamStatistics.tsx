import { StyleSheet, Text, View } from 'react-native';

import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';

import { GameStatus } from './Team';

type LiveGameInfo = { whichHalf: string; time: Date; description: string };

type TeamStatisticsProps = {
  status: GameStatus;
  broadCasterName: string;
  gameTime: Date;
  liveGameInfo?: LiveGameInfo;
};

const formatGameDateTime = (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return {
    date: formattedDate, // e.g., "Sun, 12/01"
    time: formattedTime, // e.g., "1:00 PM"
  };
};

const TeamStatistics = ({
  status,
  gameTime,
  broadCasterName,
  liveGameInfo,
}: TeamStatisticsProps) => {
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);
  return (
    <View>
      {/* Before */}
      {status === 'before' && (
        <View style={styles.gameStatsInfo}>
          <Text style={styles.slimLabel}>
            {formatGameDateTime(gameTime).date}
          </Text>
          <Text style={styles.semiBoldLabel}>
            {formatGameDateTime(gameTime).time}
          </Text>
          <Text style={styles.broadcasterName}>{broadCasterName}</Text>
        </View>
      )}

      {/* Live */}

      {status === 'live' && liveGameInfo && (
        <View style={styles.gameStatsInfo}>
          <View>
            <Text style={styles.slimLabel}>{liveGameInfo.whichHalf}</Text>
            <Text style={styles.semiBoldLabel}>
              {formatGameDateTime(liveGameInfo.time).time}
            </Text>
          </View>
          <Text style={styles.broadcasterName}>{broadCasterName}</Text>
          <View style={styles.gameStatsInfo}>
            <Text style={styles.semiBoldLabel}>
              {liveGameInfo.description.split(',')[0]},
            </Text>
            <Text style={styles.semiBoldLabel}>
              {liveGameInfo.description.split(',')[1]}
            </Text>
          </View>
        </View>
      )}

      {/* Final */}

      {status === 'final' && (
        <View style={styles.gameStatsInfo}>
          <Text style={styles.semiBoldLabel}>Final</Text>
          <Text style={styles.slimLabel}>
            {formatGameDateTime(gameTime).date}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (themeColor: ThemeColors) => {
  return StyleSheet.create({
    gameStatsInfo: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
    },
    slimLabel: {
      fontFamily: Fonts.WorkSansRegular,
      fontSize: 6,
      color: themeColor.text,
      letterSpacing: 0,
      textAlign: 'center',
    },
    livePreview: {
      fontFamily: Fonts.RobotoRegular,
      fontSize: 16,
      letterSpacing: 0,
      verticalAlign: 'middle',
      color: themeColor.text,
    },
    semiBoldLabel: {
      fontFamily: Fonts.WorkSansSemiBold,
      fontSize: 10,
      textAlign: 'center',
      color: themeColor.text,
      letterSpacing: 0,
    },
    broadcasterName: {
      color: themeColor.text,
      fontSize: 6,
      fontFamily: Fonts.WorkSansRegular,
      letterSpacing: 0,
      textAlign: 'center',
    },
  });
};

export { TeamStatistics };
export type { LiveGameInfo };
