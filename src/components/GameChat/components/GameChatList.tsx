import Icon from '@react-native-vector-icons/ionicons';
import type React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { MessageState } from '../../../types/GameChat';

interface GameChatListProps {
  messages: MessageState[];
  isLoadingMessages: boolean;
  likingMessages: Set<string>;
  themeColors: any;
  flatListRef: React.RefObject<FlatList | null>;
  onLikeToggle: (message: MessageState) => void;
  onLongPress: (message: MessageState) => void;
  formatDateTime: (date: Date) => string;
  currentDateTime: Date;
}

const GameChatList: React.FC<GameChatListProps> = ({
  messages,
  isLoadingMessages,
  likingMessages,
  themeColors,
  flatListRef,
  onLikeToggle,
  onLongPress,
  formatDateTime,
  currentDateTime,
}) => {
  const userAvatar1 = require('../../../../assets/images/user1.png');

  const renderDateSeparator = (label: string) => (
    <View style={styles.dateSeparatorContainer}>
      <Text style={styles.dateSeparatorText}>{label}</Text>
    </View>
  );

  const renderMessage = ({
    item,
    index,
  }: {
    item: MessageState;
    index: number;
  }) => {
    if (item.dateSeparator) return renderDateSeparator(item.dateSeparator);

    const isMe = item.isMe;
    let showUsername = false;

    if (!isMe && item.username) {
      if (
        index === 0 ||
        (messages[index - 1] && messages[index - 1].username !== item.username)
      ) {
        showUsername = true;
      }
    }

    const isLiking = likingMessages.has(item.id);

    return (
      <View style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && (
          <Image source={item.avatar || userAvatar1} style={styles.avatar} />
        )}
        <View
          style={[
            styles.messageContent,
            isMe ? styles.contentMe : styles.contentOther,
          ]}
        >
          {!isMe && showUsername && (
            <Text style={styles.usernameText}>{item.username}</Text>
          )}

          {/* Fixed: Better reply display logic */}
          {/* Fixed: Better reply display logic with consistent alignment */}
          {item.replyTo && item.replyText && (
            <View
              style={[
                styles.replyStack,
                isMe ? styles.replyStackMe : styles.replyStackOther,
              ]}
            >
              <Text
                style={[
                  styles.replyLabel,
                  isMe ? styles.replyLabelMe : styles.replyLabelOther,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Replied to{' '}
                <Text style={styles.replyLabelUsername}>{item.replyTo}</Text>
              </Text>
              <View
                style={[styles.replyBubble, isMe && styles.isMeReplyBubble]}
              >
                <Text
                  style={styles.replyBubbleText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.replyText}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            onLongPress={() => onLongPress(item)}
            style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
          >
            <Text
              style={[
                styles.messageText,
                isMe && styles.messageTextMe,
                item.replyTo && styles.messageTextWithReply,
              ]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>

          {item.likes != null && item.likes > 0 && (
            <TouchableOpacity
              style={[styles.likePillFloat, styles.likePillFloatEnd]}
              onPress={() => onLikeToggle(item)}
              disabled={isLiking}
            >
              <Icon name="heart-outline" size={11} color="#fff" />
              <Text style={styles.likePillTextOverlay}>{item.likes}</Text>
              {isLiking && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={styles.activityIndicator}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
        {isMe && (
          <Image source={item.avatar || userAvatar1} style={styles.avatar} />
        )}
      </View>
    );
  };

  if (isLoadingMessages) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.dateTimeHeader}>
        <Text style={styles.dateTimeText}>
          {formatDateTime(currentDateTime)}
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item, index }) => renderMessage({ item, index })}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => {
          if (!isLoadingMessages) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        ListEmptyComponent={
          <View style={styles.noMessagesContainer}>
            <Text style={styles.noMessagesText}>No messages yet</Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  dateTimeHeader: {
    backgroundColor: '#181C4A',
    paddingVertical: 8,
    alignItems: 'center',
  },
  dateTimeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  noMessagesText: {
    color: '#A4A4A4',
    fontSize: 16,
  },
  chatList: {
    paddingBottom: 20,
  },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorText: {
    marginHorizontal: 8,
    color: '#A4A4A4',
    fontSize: 13,
    fontWeight: '500',
    alignSelf: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    paddingHorizontal: 12,
    position: 'relative',
  },
  rowOther: { justifyContent: 'flex-start' },
  rowMe: { justifyContent: 'flex-end', paddingRight: 2 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 8 },
  messageContent: { flexDirection: 'column', maxWidth: '75%' },
  contentOther: { alignItems: 'flex-start' },
  contentMe: { alignItems: 'flex-end' },
  usernameText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
    marginLeft: 2,
  },
  replyStack: {
    marginBottom: -8, // Reduced from 2 to create overlap
    maxWidth: '100%',
  },
  replyStackOther: {
    alignSelf: 'flex-start',
  },
  replyStackMe: {
    alignSelf: 'flex-end',
  },
  replyLabel: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 4,
  },
  replyLabelOther: {
    color: '#fff',
  },
  replyLabelMe: {
    color: '#fff',
    textAlign: 'right',
    marginRight: 4,
    marginLeft: 0,
  },
  replyLabelUsername: {
    fontWeight: 'bold',
  },
  isMeReplyBubble: {
    alignSelf: 'flex-end',
  },
  replyBubble: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 7,
    paddingBottom: 10,
    paddingHorizontal: 14,
    marginBottom: 0, // Reduced from 4 to 0 for tighter spacing
    maxWidth: 260,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  replyBubbleText: {
    color: '#000',
    fontSize: 15,
  },
  bubble: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 13,
    backgroundColor: '#45435D',
    minWidth: 60,
    minHeight: 36,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1, // Ensure the reply bubble appears above the replied text
  },
  bubbleOther: {},
  bubbleMe: { backgroundColor: '#2ECC8B' },
  messageText: { color: '#fff', fontSize: 15 },
  messageTextMe: { color: '#181C4A' },
  messageTextWithReply: {
    marginTop: -4, // Negative margin to create overlap
  },
  likePillFloat: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2470',
    borderRadius: 9,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
  },
  likePillFloatEnd: {
    right: -12,
    bottom: -7,
  },
  likePillTextOverlay: {
    color: '#fff',
    fontSize: 11,
    marginLeft: 2,
    fontWeight: '500',
  },
  activityIndicator: {
    marginLeft: 4,
  },
});

export default GameChatList;
