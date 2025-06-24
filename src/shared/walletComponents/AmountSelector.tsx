import Button from '@shared/button';
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AmountSelectorProps {
  selected: number;
  onSelect: (amount: number) => void;
  options?: number[];
}

const AmountSelector: React.FC<AmountSelectorProps> = ({
  selected,
  onSelect,
  options = [25, 50, 100, 200],
}) => {
  return (
    <View style={styles.container}>
      {options.map((amount) => (
        <Button
          key={amount}
          title={`$${amount}`}
          variant={selected === amount ? 'solid' : 'outline'}
          onPress={() => onSelect(amount)}
          style={styles.button}
          size="sm"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});

export default AmountSelector;
