import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import useEmojiReaction from '../hooks/useEmojiReaction';

import EmojiPicker from './EmojiPicker';

type EmojiReactionButtonProps = {
  onReactionChange?: (emoji: any) => void;
  initialEmoji?: any;
  style?: object;
};

/**
 * A reusable emoji reaction button that can be added to any component
 */
const EmojiReactionButton = ({
  onReactionChange,
  initialEmoji,
  style,
}: EmojiReactionButtonProps) => {
  const {
    showEmojiPicker,
    selectedEmoji,
    scaleAnim,
    emojis,
    toggleEmojiPicker,
    handleEmojiSelect,
    clearEmoji,
  } = useEmojiReaction({
    initialEmoji,
    onReactionChange,
  });

  const renderReactionIcon = () => {
    if (selectedEmoji) {
      return <Text style={styles.emojiText}>{selectedEmoji.emoji}</Text>;
    }

    return <Text style={styles.defaultEmoji}>❤️</Text>;
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={toggleEmojiPicker}
        onLongPress={clearEmoji}
        style={styles.button}
      >
        {renderReactionIcon()}
      </TouchableOpacity>

      {showEmojiPicker && (
        <EmojiPicker
          emojis={emojis}
          scaleAnim={scaleAnim}
          onSelectEmoji={handleEmojiSelect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 8,
    borderRadius: 20,
  },
  defaultEmoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  emojiText: {
    fontSize: 20,
  },
});

export default EmojiReactionButton;
