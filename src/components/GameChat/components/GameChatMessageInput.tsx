import Icon from '@react-native-vector-icons/ionicons';
import type React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

import { MessageState } from '../../../types/GameChat';

interface GameChatMessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  replyTo: MessageState | null;
  isConnecting: boolean;
  inputRef: React.RefObject<TextInput | null>;
  onSend: () => void;
  onCancelReply: () => void;
  onInputKeyPress: (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
}

const GameChatMessageInput: React.FC<GameChatMessageInputProps> = ({
  inputValue,
  setInputValue,
  replyTo,
  isConnecting,
  inputRef,
  onSend,
  onCancelReply,
  onInputKeyPress,
}) => {
  return (
    <View style={styles.inputContainer}>
      {replyTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyPreviewContent}>
            <Text style={styles.replyPreviewLabel}>
              Replying to {replyTo.username}
            </Text>
            <Text style={styles.replyPreviewText} numberOfLines={1}>
              {replyTo.text}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.replyPreviewCancel}
            onPress={onCancelReply}
          >
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.plusButton}>
          <Icon name="add-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={replyTo ? 'Write a reply...' : 'Good morning…'}
          placeholderTextColor="#FFFFFF"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={onSend}
          onKeyPress={onInputKeyPress}
          returnKeyType="send"
          editable={!isConnecting}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          disabled={isConnecting || !inputValue.trim()}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#1B2470',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  replyPreview: {
    backgroundColor: '#1B2470',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#353A6D',
  },
  replyPreviewContent: {
    flex: 1,
    marginRight: 8,
  },
  replyPreviewLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
  },
  replyPreviewText: {
    color: '#A4A4A4',
    fontSize: 13,
  },
  replyPreviewCancel: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  plusButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F7FC99',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
  },
});

export default GameChatMessageInput;
