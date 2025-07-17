import Icon from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { ThemeColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

interface AmountInputBoxProps {
  value: number; // Changed from 'any' to 'number' for type safety
  editable?: boolean;
  inputType: 'addmoney' | 'transfer';
  onChange: (val: number) => void;
  onEditPress?: () => void;
}

const AmountInputBox: React.FC<AmountInputBoxProps> = ({
  value,
  onChange,
  onEditPress,
  inputType,
  editable = true,
}) => {
  const themeStyles = useThemeStyles();
  const theme = useTheme();
  const styles = getStyles(theme.themeColors);

  return (
    <View style={styles.container}>
      <View style={themeStyles.flexRow}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          style={styles.input}
          value={value.toString()} // Convert number to string for TextInput
          onChangeText={(val) => {
            const parsedValue = parseFloat(val);
            onChange(isNaN(parsedValue) ? 0 : parsedValue); // Parse string to number
          }}
          keyboardType="numeric"
          editable={editable} // Apply editable prop to TextInput
        />
        {inputType === 'addmoney' &&
          !editable && ( // Show edit icon only when not editable
            <TouchableOpacity onPress={onEditPress} style={styles.icon}>
              <Icon name="pencil" size={20} color={theme.themeColors.gray1} />
            </TouchableOpacity>
          )}
      </View>
      {inputType === 'transfer' && (
        <Text style={styles.availBalance}>Available Balance: $25,000.00</Text>
      )}
    </View>
  );
};

const getStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      backgroundColor: themeColors.cardBG,
      borderRadius: 10,
      padding: 16,
      marginBottom: 13,
    },
    dollar: {
      color: themeColors.text,
      fontFamily: Fonts.WorkSansMedium,
      fontSize: 20,
    },
    input: {
      color: themeColors.text,
      fontSize: 24,
      fontFamily: Fonts.WorkSansMedium,
      marginLeft: 8,
      minWidth: 20,
    },
    icon: { marginTop: 10 },
    availBalance: {
      color: themeColors.text,
      fontSize: 8,
      lineHeight: 14,
      fontFamily: Fonts.WorkSansSemiBold,
    },
  });
};

export default AmountInputBox;
