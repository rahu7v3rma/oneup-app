import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FaceIdIcon } from '../../assets/svgs';
import { Fonts } from '../theme/fonts';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import Text from './text';

const LoginButton = ({
  onPress,
  title,
  showFaceIDIcon,
  loading = false,
}: {
  onPress: () => void;
  title: string;
  showFaceIDIcon?: boolean;
  loading?: boolean;
}) => {
  const themeStyles = useThemeStyles();

  return (
    <LinearGradient
      colors={['#04BA6A', '#04BA6A']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0.0, y: 0 }}
      style={[styles.button, themeStyles.themeBtnColor]}
    >
      <TouchableOpacity
        onPress={loading ? undefined : onPress}
        disabled={loading}
        style={styles.innerButton}
      >
        {loading ? (
          <ActivityIndicator color={themeStyles.textSupporting.color} />
        ) : (
          <Text style={[styles.buttonText, themeStyles.themeBtnTextColor]}>
            {title}
          </Text>
        )}
        {showFaceIDIcon && !loading && (
          <View style={styles.faceicon}>
            <FaceIdIcon />
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
  },
  innerButton: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.WorkSansSemiBold,
    textTransform: 'uppercase',
  },
  faceicon: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 10,
  },
});
