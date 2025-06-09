import React, {FunctionComponent, useEffect, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useThemeStyles} from '../theme/ThemeStylesProvider';
import {useTheme} from '../theme/ThemeProvider';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackStyle?: StyleProp<ViewStyle>;
  thumbStyle?: StyleProp<ViewStyle>;
};

const ToggleSwitch: FunctionComponent<Props> = ({
  value,
  onValueChange,
  trackStyle,
  thumbStyle,
}: Props) => {
  const themeStyles = useThemeStyles();
  const {themeColors} = useTheme();

  const thumbPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(thumbPosition, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.circle),
    }).start();
  }, [value, thumbPosition]);

  const interpolatedThumbTranslate = thumbPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        themeStyles.justifyContentCenter,
        {
          backgroundColor: value ? themeColors.btnBG : themeColors.gray1,
        },
        trackStyle,
      ]}>
      <Animated.View
        style={[
          styles.thumb,
          themeStyles.pAbsolute,
          {
            backgroundColor: themeColors.text,
            transform: [{translateX: interpolatedThumbTranslate}],
            borderColor: themeColors.appBG,
          },
          thumbStyle,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 32.93,
    height: 17.96,
    borderRadius: 24,
    paddingHorizontal: 2,
  },
  thumb: {
    width: 17.96,
    height: 17.96,
    borderRadius: 17.96,
    borderWidth: 1.5,
  },
});

export default ToggleSwitch;
