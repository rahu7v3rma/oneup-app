import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Fonts } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

type ButtonProps = {
  title: string;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'danger';
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  onPress: () => void;
  loading?: boolean;
  icon?: React.ReactNode; // New icon prop
};

const Button = ({
  title,
  disabled = false,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  style,
  textStyle,
  onPress,
  loading = false,
  icon,
}: ButtonProps) => {
  const { themeColors } = useTheme();

  const getColor = () => {
    switch (color) {
      case 'primary':
        return themeColors.primary;
      case 'secondary':
        return themeColors.secondary;
      case 'danger':
        return themeColors.danger;
      default:
        return themeColors.primary;
    }
  };

  const getButtonSizeStyles = () => {
    switch (size) {
      case 'sm':
        return styles.buttonSmall;
      case 'md':
        return styles.buttonMedium;
      case 'lg':
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  const getTextStyles = () => {
    switch (size) {
      case 'sm':
        return styles.buttonSmallText;
      case 'md':
        return styles.buttonMediumText;
      case 'lg':
        return styles.buttonLargeText;
      default:
        return styles.buttonMediumText;
    }
  };

  const buttonSizeStyles = getButtonSizeStyles();
  const backgroundColor = variant === 'solid' ? getColor() : 'transparent';
  const borderColor = getColor();
  const textSizeStyles = getTextStyles();
  const textColor = variant === 'solid' ? themeColors.text : getColor();
  const opacity = disabled ? 0.6 : 1;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor,
          opacity,
        },
        buttonSizeStyles,
        style,
      ]}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          size={size === 'sm' ? 'small' : 'small'}
          color={textColor}
        />
      ) : (
        <View style={styles.buttonContent}>
          <Text
            style={[
              styles.text,
              {
                color: textColor,
              },
              textSizeStyles,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  buttonSmall: {
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 10,
  },
  buttonMedium: {
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
  },
  buttonLarge: {
    paddingVertical: 18,
    borderRadius: 10,
    fontSize: 16,
  },
  text: {
    fontFamily: Fonts.WorkSansSemiBold,
  },
  buttonSmallText: {
    fontSize: 12,
    lineHeight: 16,
  },
  buttonMediumText: {
    fontSize: 14,
    lineHeight: 18,
  },
  buttonLargeText: {
    fontSize: 16,
    lineHeight: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginLeft: 8,
  },
});
