import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

import { darkColors } from '../theme/colors';

interface AmountInputBoxProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  editable?: boolean;
  onEditPress?: () => void;
}

const AmountInputBox: React.FC<AmountInputBoxProps> = ({
  label,
  value = '50',
  onChange,
  editable = true,
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <View style={styles.contentContainer}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={value}
              onChangeText={onChange}
              editable={editable}
              keyboardType="numeric"
              style={styles.inputText}
              placeholder="0"
              placeholderTextColor={darkColors.slateGray}
            />
            <Image
              source={require('../../assets/pngs/whiteCoin.png')}
              style={styles.coinIcon}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEditPress}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/pngs/edit.png')}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AmountInputBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginRight: /2,
  },
  inputBox: {
    backgroundColor: darkColors.charcoalBlue,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    color: darkColors.slateGray,
    fontSize: 12,
    marginRight: 10,
    fontWeight: '400',
    maxWidth: '40%',
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%',
  },
  inputText: {
    flex: 1,
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
  },
  coinIcon: {
    width: 16,
    height: 16,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: 11,
    width: 11,
  },
});
