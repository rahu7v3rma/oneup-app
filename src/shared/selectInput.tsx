import { useField } from 'formik';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';

import Check from '../../assets/svgs/check';
import { useTheme } from '../theme/ThemeProvider';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

interface SelectInputProps {
  name: string;
  placeholder: string;
  options: string[];
}
/**
 * SelectInput component for rendering a themed dropdown integrated with Formik.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the Formik field to bind.
 * @param {string} props.placeholder - Placeholder text displayed when no option is selected.
 * @param {string[]} props.options - Array of string options to display in the modal.
 *
 * @returns {JSX.Element} A styled dropdown input with modal-based selection.
 */

const SelectInput = ({ name, placeholder, options }: SelectInputProps) => {
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [field, meta, helpers] = useField(name);

  return (
    <View style={styles.inputContainer}>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.inputWrapper,
          themeStyles.ph4,
          themeStyles.input,
          meta.touched && meta.error ? themeStyles.errorInputBorder : {},
        ]}
      >
        <Text
          style={[
            themeStyles.flex1,
            themeStyles.inputText,
            field.value
              ? themeStyles.inputText
              : { color: themeColors.mutedText },
          ]}
        >
          {field.value || placeholder}
        </Text>
        <Check />
      </Pressable>

      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: themeColors.appBG },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    item === field.value && {
                      backgroundColor: themeColors.mutedBG,
                    },
                  ]}
                  onPress={() => {
                    helpers.setValue(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={themeStyles.inputText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
      {meta.touched && meta.error && (
        <Text style={[styles.errorText, themeStyles.errorText]}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 56,
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 8,
    paddingVertical: 10,
    // Background color is now applied dynamically using themeColors.appBG
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    padding: 14,
  },
  errorText: {
    marginTop: 8,
    alignSelf: 'center',
  },
});
