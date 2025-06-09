import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { Fonts } from '../theme/fonts';
import { useThemeStyles } from '../theme/ThemeStylesProvider';
import { Team } from '../types/match';

interface Props {
  team: Team;
}

export const TeamInfo: React.FC<Props> = ({ team }) => {
  const themeStyles = useThemeStyles();
  return (
    <View style={styles.row}>
      <Image source={team.logo} style={styles.logo} />
      <View style={styles.innerContainer}>
        <View style={styles.nameRecord}>
          <Text
            style={[
              styles.teamName,
              themeStyles.themeTextColor,
              team.GameOver && themeStyles.gameOverText,
            ]}
          >
            {team.name}
          </Text>

          {!team.GameOver && (
            <Text
              style={[
                [styles.record, !team.GameOver && themeStyles.themeTextColor],
              ]}
            >
              {team.record}
            </Text>
          )}
        </View>
        {!team.hasNotPlayed && (
          <View style={styles.scoreSection}>
            <Text
              style={[
                styles.score,
                themeStyles.themeTextColor,
                team.GameOver && themeStyles.gameOverText,
              ]}
            >
              {team.score}
            </Text>
            {!team.hasPossession && !team.GameOver ? (
              <View style={styles.playIcon}>
                <FontAwesome6
                  name="caret-left"
                  size={12}
                  color={themeStyles.themeTextColor.color}
                  iconStyle="solid"
                />
              </View>
            ) : (
              <View style={styles.playIcon} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 38,
    marginRight: 10,
    resizeMode: 'contain',
  },
  teamName: {
    fontFamily: Fonts.WorkSansRegular,
    fontSize: 11,
  },
  record: {
    fontSize: 9,
    paddingLeft: 6,
    fontFamily: Fonts.WorkSansRegular,
    top: 1,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 15,
    fontFamily: Fonts.WorkSansRegular,
    marginRight: 4,
  },
  playIcon: {
    width: 10,
  },
  nameRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
