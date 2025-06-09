import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useField } from 'formik';
import React from 'react';
import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

import { Fonts } from '../theme/fonts';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

interface Props {
  name: string;
  label: string;
  onChange?: () => void;
  textStyle?: TextStyle;
  containerStyle?: TextStyle;
}

const CheckboxField = ({ name, label, onChange, containerStyle }: Props) => {
  const themeStyles = useThemeStyles();
  const [field, , helpers] = useField(name);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => {
        helpers.setValue(!field.value);
        if (onChange) {
          onChange();
        }
      }}
    >
      <View
        style={[
          themeStyles.checkbox,
          field.value ? themeStyles.themeBtnColor : themeStyles.checkBoxBorder,
        ]}
      >
        {field.value && (
          <FontAwesome6
            name={'check'}
            size={12}
            iconStyle={'solid'}
            style={[themeStyles.textDefault]}
          />
        )}
      </View>
      <Text
        style={[
          styles.label,
          themeStyles.textSupporting,
          field.value && styles.fontWeight400,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckboxField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontFamily: Fonts.WorkSansBold,
    marginLeft: 10,
    fontSize: 14,
  },
  fontWeight400: {
    fontFamily: Fonts.WorkSansRegular,
  },
});
