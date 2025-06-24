import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Emoji } from '../hooks/useEmojiReaction';

type EmojiPickerProps = {
  emojis: Emoji[];
  scaleAnim: Animated.Value;
  onSelectEmoji: (emoji: Emoji) => void;
  containerStyle?: object;
};

const EmojiPicker = ({
  emojis,
  scaleAnim,
  onSelectEmoji,
  containerStyle,
}: EmojiPickerProps) => {
  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {emojis.map((emoji) => (
        <TouchableOpacity
          key={emoji.id}
          onPress={() => onSelectEmoji(emoji)}
          style={styles.emojiButton}
          accessibilityLabel={`React with ${emoji.name}`}
        >
          <Text style={styles.emojiText}>{emoji.emoji}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: 210,
    padding: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  emojiButton: {
    padding: 5,
  },
  emojiText: {
    fontSize: 22,
  },
});

export default EmojiPicker;
