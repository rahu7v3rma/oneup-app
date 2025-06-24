import { useState, useEffect } from 'react';
import { Animated } from 'react-native';

export type Emoji = {
  id: string;
  emoji: string;
  name: string;
  reactionType: string;
};

export const defaultEmojis: Emoji[] = [
  { id: '1', emoji: '❤️', name: 'heart', reactionType: 'love' },
  { id: '2', emoji: '‼️', name: 'alert', reactionType: 'double_exclamation' },
  { id: '3', emoji: '🔥', name: 'fire', reactionType: 'fire' },
  { id: '4', emoji: '👎🏼', name: 'dislike', reactionType: 'dislike' },
  { id: '5', emoji: '👍', name: 'like', reactionType: 'like' },
  { id: '6', emoji: '😂', name: 'laughing', reactionType: 'cry_laugh' },
];

type UseEmojiReactionProps = {
  initialEmoji?: Emoji | null;
  onReactionChange?: (emoji: Emoji | null) => void;
  customEmojis?: Emoji[];
  currentReactionType?: string | null;
};

const useEmojiReaction = ({
  initialEmoji = null,
  onReactionChange,
  customEmojis,
  currentReactionType = null,
}: UseEmojiReactionProps = {}) => {
  const emojis = customEmojis || defaultEmojis;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(
    initialEmoji,
  );
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const matchingEmoji = currentReactionType
      ? emojis.find((e) => e.reactionType === currentReactionType) || null
      : null;
    setSelectedEmoji(matchingEmoji);
  }, [currentReactionType, emojis]);

  const toggleEmojiPicker = () => {
    if (!showEmojiPicker) {
      setShowEmojiPicker(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowEmojiPicker(false);
      });
    }
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    if (selectedEmoji && selectedEmoji.reactionType === emoji.reactionType) {
      clearEmoji();
      return;
    }

    setSelectedEmoji(emoji);
    if (onReactionChange) {
      onReactionChange(emoji);
    }
    toggleEmojiPicker();
  };

  const clearEmoji = () => {
    setSelectedEmoji(null);
    if (onReactionChange) {
      onReactionChange(null);
    }
    toggleEmojiPicker();
  };

  return {
    showEmojiPicker,
    selectedEmoji,
    scaleAnim,
    emojis,
    toggleEmojiPicker,
    handleEmojiSelect,
    clearEmoji,
  };
};

export default useEmojiReaction;
