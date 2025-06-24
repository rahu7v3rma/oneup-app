import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DividerWithText = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#5D5D7C',
  },
  text: {
    marginHorizontal: 12,
    color: '#C5C5FF',
    fontWeight: 'bold',
  },
});

export default DividerWithText;
