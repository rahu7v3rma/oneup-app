import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const TOGGLE_WIDTH = 50;
const TOGGLE_HEIGHT = 30;
const THUMB_SIZE = 28;

const CustomToggleButton = ({callBack}) => {
  const [isOn, setIsOn] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const toggleSwitch = () => {
    const toValue = isOn ? 0 : TOGGLE_WIDTH - THUMB_SIZE;

    Animated.timing(translateX, {
      toValue,
      duration: 250,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
    callBack(!isOn)
    setIsOn(!isOn);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <View style={styles.toggleContainer}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]}>
          <Image
            source={isOn?require('../../assets/pngs/greenCoin.png'):require('../../assets/pngs/goldCoin.png')} // 🔁 your uploaded logo
            style={styles.thumbImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    backgroundColor: '#2D2F33', // dark background
    padding: 1,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
});

export default CustomToggleButton;
