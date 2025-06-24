import { Text, Image, View, StyleSheet } from 'react-native';

import { ICommand } from '../interfaces/comand.interface';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import { CenterElement } from './CenterElement';

export interface ICommandProps {
  firsCommand: ICommand;
  secondCommand: ICommand;
  status: string;
  desc: string;
  winner?: boolean;
}

export function Tournament({
  firsCommand,
  secondCommand,
  status,
  desc,
  winner,
}: ICommandProps) {
  const themeStyle = useThemeStyles();
  return (
    <View style={[styles.tournamentContainer]}>
      <View
        style={[
          themeStyle.flexColumn,
          themeStyle.alignItemsCenter,
          styles.commandSection,
        ]}
      >
        <Image
          style={[styles.commandLogo]}
          source={{ uri: firsCommand.logo }}
        />
        <View
          style={[themeStyle.alignItemsCenter, styles.commandTextContainer]}
        >
          <Text
            style={[
              themeStyle.alignItemsCenter,
              themeStyle.themeTextColor,
              styles.commandText,
            ]}
          >
            {firsCommand.name}
          </Text>
        </View>
      </View>
      <View style={styles.points}>
        <Text style={[themeStyle.themeTextColor, styles.pointsText]}>
          {firsCommand.point}
        </Text>
      </View>
      <CenterElement status={status} desc={desc} winner={winner} />
      <View style={styles.points}>
        <Text style={[themeStyle.themeTextColor, styles.pointsText]}>
          {firsCommand.point}
        </Text>
      </View>
      <View
        style={[
          themeStyle.flexColumn,
          themeStyle.alignItemsCenter,
          styles.commandSection,
        ]}
      >
        <Image
          style={[styles.commandLogo]}
          source={{ uri: secondCommand.logo }}
        />
        <View
          style={[themeStyle.alignItemsCenter, styles.commandTextContainer]}
        >
          <Text
            style={[
              themeStyle.alignItemsCenter,
              themeStyle.themeTextColor,
              styles.commandText,
            ]}
          >
            {secondCommand.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tournamentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginBottom: 25,
  },
  commandSection: {
    alignContent: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  points: {
    textAlign: 'center',
    alignContent: 'center',
    flex: 1,
  },
  pointsText: {
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'center',
  },
  commandTextContainer: {
    alignContent: 'center',
    marginTop: 14,
  },
  commandText: {
    fontSize: 14,
    lineHeight: 14,
  },
  commandLogo: {
    width: 56,
    height: 56,
  },
});
