import { CommonActions, useNavigation } from '@react-navigation/native';
import Button from '@shared/button';
import { AuthContext } from 'context/authContext';
import { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import FeedCard from '../shared/FeedCard';

export default function FeedScreen() {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <FeedCard
        feedDetails={{
          id: '1',
          username: 'Top News',
          title: 'Cowboys, McCarthy Part Ways',
          content:
            'Dallas to look for a new HC after both sides couldn’t agree to contract; Bears, Saints linked to coach.',
          imageUrl: '',
          isLiked: false,
          likesCount: 70,
        }}
      />

      <Button
        style={styles.button}
        color="danger"
        title={'logout'}
        onPress={async () => {
          const success = await signOut();
          if (success) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            );
          }
        }}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20 },
  button: { marginTop: 20 },
});
