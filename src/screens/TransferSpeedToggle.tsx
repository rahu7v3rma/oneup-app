import Icon from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { darkColors } from '../theme/colors';
import { Fonts } from '../theme/fonts';

export default function TransferSpeedToggle() {
  const [selected, setSelected] = useState('standard');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, selected === 'instant' && styles.selectedCard]}
        onPress={() => setSelected('instant')}
      >
        <View style={styles.iconWrapper}>
          <Icon name="flash" size={24} color="#4ade80" />
        </View>
        <Text style={styles.title}>Instant</Text>
        <Text style={styles.subtitle}>1.5% Fee (Max $10.00)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, selected === 'standard' && styles.selectedCard]}
        onPress={() => setSelected('standard')}
      >
        <View style={styles.iconWrapper}>
          <Icon name="business-outline" size={24} color="#4ade80" />
        </View>
        <Text style={styles.title}>1–3 Biz Days</Text>
        <Text style={styles.subtitle}>No Fees</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    padding: 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  card: {
    width: 180,
    height: 180,
    borderColor: darkColors.mutedText,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    borderColor: darkColors.primary,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: darkColors.cardBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: darkColors.text,
    fontSize: 12,
    marginTop: 12,
    fontFamily: Fonts.WorkSansMedium,
  },
  subtitle: {
    color: darkColors.mutedText,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Fonts.WorkSansMedium,
  },
});
