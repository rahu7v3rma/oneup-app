import Icon from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { darkColors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

interface AmountInputBoxProps {
  value: any;
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
  return (
    <View style={styles.container}>
      <View style={themeStyles.flexRow}>
        <Text style={styles.dollar}>$</Text>
        <TextInput
          style={[styles.input]}
          value={value}
          onChangeText={(val: any) => onChange(val)}
          keyboardType="numeric"
        />
        {inputType === 'addmoney' && editable && (
          <TouchableOpacity onPress={onEditPress} style={styles.icon}>
            <Icon name="pencil" size={10} color={darkColors.text} />
          </TouchableOpacity>
        )}
      </View>
      {inputType === 'transfer' && (
        <Text style={styles.availBalance}>Available Balance: $25,000.00</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkColors.cardBG,
    borderRadius: 10,
    padding: 16,
    marginBottom: 13,
  },
  dollar: {
    color: darkColors.text,
    fontFamily: Fonts.WorkSansMedium,
    fontSize: 20,
  },
  input: {
    color: darkColors.text,
    fontSize: 24,
    fontFamily: Fonts.WorkSansMedium,
    marginLeft: 8,
    minWidth: 20,
  },
  icon: { marginTop: 10 },
  availBalance: {
    color: darkColors.text,
    fontSize: 8,
    lineHeight: 14,
    fontFamily: Fonts.WorkSansSemiBold,
  },
});

export default AmountInputBox;
