import { View, StyleSheet, Text } from 'react-native';

import { GameStatusEnum } from '../enums/gameStatus';
import { ICommand } from '../interfaces/comand.interface';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import Button from './button';
import { Tournament } from './Tournament';

export interface IGameStatusProps {
  status: GameStatusEnum;
  statusDescription: string;
  firstCommand: ICommand;
  secondCommand: ICommand;
  matchDesc: string;
  winner?: boolean;
}

export function GameStatus({
  firstCommand,
  secondCommand,
  statusDescription,
  status,
  matchDesc,
  winner,
}: IGameStatusProps) {
  const betOnGameClick = () => {};
  const gameChatClick = () => {};

  const themeStyle = useThemeStyles();
  return (
    <View style={[themeStyle.themeContainerColor, styles.commandContainer]}>
      <View style={[styles.statusTextContainer]}>
        <Text style={[styles.statusText, themeStyle.themeTextColor]}>
          {statusDescription}
        </Text>
      </View>
      <Tournament
        firsCommand={firstCommand}
        secondCommand={secondCommand}
        status={status}
        desc={matchDesc}
        winner={winner}
      />
      <View style={[styles.buttonContainer]}>
        {status === GameStatusEnum.scheduled && (
          <Button
            title="Bet on Game"
            onPress={betOnGameClick}
            style={[styles.betButton]}
          />
        )}
        <Button
          title="Game Chat"
          onPress={gameChatClick}
          style={[styles.chatButton]}
          textColor={{ color: '#04BA6A' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  betButton: {
    flex: 1,
  },
  chatButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    color: '#04BA6A',
    borderColor: '#04BA6A',
  },
  commandContainer: {
    marginTop: 25,
    marginBottom: 25,
  },
  statusTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    lineHeight: 20,
    fontSize: 20,
  },
});
