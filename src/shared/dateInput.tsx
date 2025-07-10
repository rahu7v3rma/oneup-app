import DateTimePicker from '@react-native-community/datetimepicker';
import { useField } from 'formik';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import CalendarIcon from '../../assets/svgs/calendarIcon';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

interface Props {
  name: string;
  placeHolder: string;
}

const DateInputField = ({ name, placeHolder }: Props) => {
  const [field, meta, helpers] = useField(name);
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = `${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${String(selectedDate.getDate()).padStart(2, '0')}/${selectedDate.getFullYear()}`;
      helpers.setValue(formatted);
    }
  };

  const getInitialDate = () => {
    const parts = field.value?.split('/');
    if (parts?.length === 3) {
      const [month, day, year] = parts;
      const parsedDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date();
  };

  const isEmpty = !field.value;

  return (
    <LinearGradient
      colors={['#151A20', '#1B2128']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.inputContainer}
    >
      <Pressable
        style={[
          styles.inputWrapper,
          themeStyles.ph4,
          themeStyles.input,
          meta.touched && meta.error ? themeStyles.errorInputBorder : {},
          styles.transparent,
        ]}
        onPress={() => setShowPicker(true)}
      >
        {isEmpty ? (
          <View style={styles.placeholderContainer}>
            <View style={themeStyles.flex1}>
              <Text
                style={[
                  themeStyles.inputText,
                  { color: themeColors.slateGray },
                ]}
              >
                {placeHolder}
              </Text>
            </View>
            <View>
              <CalendarIcon />
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={themeStyles.flex1}>
              <Text
                style={[themeStyles.inputText, { color: themeColors.text }]}
              >
                {field.value}
              </Text>
            </View>
            <View>
              <CalendarIcon />
            </View>
          </View>
        )}
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={getInitialDate()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
          textColor={themeColors.text}
        />
      )}
      {meta.touched && meta.error && (
        <Text style={[styles.errorText, themeStyles.errorText]}>
          {meta.error}
        </Text>
      )}
    </LinearGradient>
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
  transparent: {
    backgroundColor: 'transparent',
  },
  placeholderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    alignSelf: 'center',
  },
});
