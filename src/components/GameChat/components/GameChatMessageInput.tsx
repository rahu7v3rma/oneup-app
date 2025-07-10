import type React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

import HandCoin from '../../../../assets/svgs/chatSVGs/handCoin.svg';
import Send from '../../../../assets/svgs/chatSVGs/Send.svg';
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
  onInputKeyPress,
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.plusButton}>
          <HandCoin width={20} height={20} />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={replyTo ? 'Write a reply...' : 'Type message...'}
          placeholderTextColor="#707077"
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
          <Send width={23} height={23} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#141B22',
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  replyPreviewContent: {
    flex: 1,
    marginRight: 8,
  },
  replyPreviewLabel: {
    color: '#fff',
    fontSize: 12,
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
  },
  plusButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 24,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
  },
});

export default GameChatMessageInput;
