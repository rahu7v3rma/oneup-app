import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

import { GameStatusEnum } from '../../enums/gameStatus';
import { ICommand } from '../../interfaces/comand.interface';
import BackButton from '../../shared/backButton';
import { GameStatus } from '../../shared/GameStatus';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

export function GamesPreviewsCard() {
  const navigation = useNavigation();
  const themeStyle = useThemeStyles();
  const userMock = {
    profileImg: 'https://randomuser.me/api/portraits/thumb/men/75.jpg',
  };
  const commands: Array<ICommand> = [
    {
      logo: 'https://assets.stickpng.com/thumbs/58419ba7a6515b1e0ad75a54.png',
      point: '7 - 2',
      status: 'live',
      name: 'I',
    },
    {
      logo: 'https://assets.stickpng.com/thumbs/58419ba7a6515b1e0ad75a54.png',
      point: '7 - 2',
      status: 'live',
      name: 'I',
    },
  ];
  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <ScrollView
      style={[
        themeStyle.themeContainerColor,
        themeStyle.flexColumn,
        styles.container,
      ]}
    >
      <View style={[styles.header, themeStyle.themeContainerColor]}>
        <BackButton onPress={onPressBack} />
        <View style={styles.profileContainer}>
          <View style={[styles.notification]}>
            <Icon name="bell" size={24} color="#978888" />
          </View>
          <Image
            source={{ uri: userMock.profileImg }}
            style={styles.profileIcon}
          />
        </View>
      </View>
      <View style={[themeStyle.themeContainerColor]}>
        <GameStatus
          status={GameStatusEnum.scheduled}
          statusDescription="I vs I"
          matchDesc="now"
          firstCommand={commands[0]}
          secondCommand={commands[1]}
          winner={true}
        />
      </View>
      <View style={[themeStyle.themeContainerColor]}>
        <GameStatus
          status={GameStatusEnum.scheduled}
          statusDescription="I vs I"
          matchDesc="now"
          firstCommand={commands[0]}
          secondCommand={commands[1]}
        />
      </View>
      <View style={[themeStyle.themeContainerColor]}>
        <GameStatus
          status={GameStatusEnum.scheduled}
          statusDescription="I vs I"
          matchDesc="now"
          firstCommand={commands[0]}
          secondCommand={commands[1]}
          winner={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  notification: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
