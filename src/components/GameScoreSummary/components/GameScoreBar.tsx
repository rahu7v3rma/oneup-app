import { FlatList, StyleSheet, View } from 'react-native';

import ScoreBar, { ScoreBarProps } from '../../../components/Scorebar';

type Props = {
  data: ScoreBarProps[];
};

const GameScoreBar = ({ data }: Props) => {
  const styles = getStyles();
  return (
    <View style={styles.gameScoreBar}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: ScoreBarProps }) => (
          <ScoreBar {...item} />
        )}
      />
    </View>
  );
};

export default GameScoreBar;

const getStyles = () =>
  StyleSheet.create({
    gameScoreBar: {
      padding: 10,
      backgroundColor: '#1B2470',
      borderRadius: 10,
    },
  });
