import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import { FaceIdIcon } from '../../assets/svgs';
import { Fonts } from '../theme/fonts';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

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
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      disabled={loading}
      style={[styles.button, themeStyles.themeBtnColor]}
    >
      {loading ? (
        <ActivityIndicator color={themeStyles.textSupporting.color} />
      ) : (
        <Text style={[styles.buttonText, themeStyles.textSupporting]}>
          {title}
        </Text>
      )}
      {showFaceIDIcon && !loading && (
        <View style={styles.faceicon}>
          <FaceIdIcon />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default LoginButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: Fonts.WorkSansSemiBold,
  },
  faceicon: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    right: 10,
  },
});
