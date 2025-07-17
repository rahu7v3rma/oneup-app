// import DateTimePicker from '@react-native-community/datetimepicker';
import { useField } from 'formik';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import CalendarIcon from '../../assets/svgs/calendarIcon';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

interface Props {
  name: string;
  placeholder: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DateInputField = ({
  name,
  placeholder,
  minimumDate,
  maximumDate,
}: Props) => {
  const [field, meta, helpers] = useField(name);
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      const boundedDate = new Date(
        Math.max(
          minimumDate?.getTime() || -Infinity,
          Math.min(maximumDate?.getTime() || Infinity, selectedDate.getTime()),
        ),
      );
      const formatted = `${String(boundedDate.getMonth() + 1).padStart(2, '0')}/${String(
        boundedDate.getDate(),
      ).padStart(2, '0')}/${boundedDate.getFullYear()}`;
      helpers.setValue(formatted);
    }
  };

  const getInitialDate = () => {
    const parts = field.value?.split('/');
    if (parts?.length === 3) {
      const [month, day, year] = parts.map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        if (minimumDate && parsedDate < minimumDate) {
          return minimumDate;
        }
        if (maximumDate && parsedDate > maximumDate) {
          return maximumDate;
        }
        return parsedDate;
      }
    }
    return minimumDate || new Date();
  };

  const isEmpty = !field.value;

  return (
    <View style={styles.inputContainer}>
      <LinearGradient
        colors={['#151A20', '#1B2128']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View
          style={[
            Platform.OS === 'ios' ? styles.inputViewIos : styles.inputView,
            themeStyles.inputStyle,
            styles.transparent,
          ]}
        >
          <Pressable
            style={[
              themeStyles.ph4,
              themeStyles.input,
              styles.inputWrapper,
              meta.touched && meta.error ? themeStyles.errorInputBorder : {},
              styles.transparent,
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Text
              style={[
                themeStyles.flex1,
                themeStyles.textSupporting,
                themeStyles.inputText,
                { color: isEmpty ? themeColors.slateGray : themeColors.text },
              ]}
            >
              {isEmpty ? placeholder : field.value}
            </Text>

            <CalendarIcon />
          </Pressable>
        </View>
      </LinearGradient>

      {showPicker && (
        <DateTimePickerModal
          isVisible={showPicker}
          mode="date"
          date={getInitialDate()}
          onConfirm={(date) => handleChange(null, date)}
          onCancel={() => setShowPicker(false)}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
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
    height: 70,
    borderRadius: 16,
  },
  gradientContainer: {
    borderRadius: 8,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
  },
  errorText: {
    marginTop: 4,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 125,
    textAlignVertical: 'bottom',
  },
  inputView: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  inputViewIos: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
