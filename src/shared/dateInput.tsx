import DateTimePicker from '@react-native-community/datetimepicker';
import { useField } from 'formik';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';

import CalendarIcon from '../../assets/svgs/calendarIcon';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

interface Props {
  name: string;
  placeHolder: string;
  minimumDate: Date;
}

const DateInputField = ({ name, placeHolder, minimumDate }: Props) => {
  const [field, meta, helpers] = useField(name);
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setPickerDate(selectedDate);
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      helpers.setValue(formattedDate);
      if (Platform.OS === 'android') {
        setShowPicker(false);
      }
    }
  };

  const isEmpty = !field.value;

  return (
    <View style={styles.inputContainer}>
      <Pressable
        style={[
          styles.inputWrapper,
          themeStyles.ph4,
          themeStyles.input,
          meta.touched && meta.error ? themeStyles.errorInputBorder : {},
        ]}
        onPress={() => setShowPicker(true)}
      >
        <TextInput
          style={[themeStyles.flex1, themeStyles.inputText]}
          value={field.value}
          editable={false}
          placeholder=""
          pointerEvents="none"
        />
        {isEmpty && (
          <View style={styles.placeholderContainer}>
            <Text
              style={[
                styles.placeholderLine1,
                themeStyles.inputText,
                themeStyles.textSupporting,
                { color: themeColors.mutedText },
              ]}
            >
              {placeHolder}
            </Text>
            <Text
              style={[
                styles.placeholderLine2,
                themeStyles.inputText,
                themeStyles.textSupporting,
                { color: themeColors.mutedText },
              ]}
            >
              MM / DD / YYYY
            </Text>
          </View>
        )}
        <CalendarIcon />
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={minimumDate}
          textColor={themeColors.text}
        />
      )}
      {meta.touched && meta.error && (
        <Text style={[styles.errorText, themeStyles.errorText]}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export default DateInputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 56,
    position: 'relative',
  },
  placeholderContainer: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  placeholderLine1: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '500',
  },
  placeholderLine2: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  errorText: {
    marginTop: 8,
    alignSelf: 'center',
  },
});
