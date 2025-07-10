import Icon from '@react-native-vector-icons/ionicons';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { MessageState } from '../../../types/GameChat';
import CardBgGradient from '../../CardBgGradient';

interface GameChatListProps {
  messages: MessageState[];
  isLoadingMessages: boolean;
  likingMessages: Set<string>;
  themeColors: any;
  flatListRef: React.RefObject<FlatList | null>;
  onLikeToggle: (message: MessageState) => void;
  onLongPress: (
    message: MessageState,
    position: { x: number; y: number },
  ) => void;
  formatDateTime: (date: Date) => string;
  currentDateTime: Date;
  onLayoutChatView?: (layout: any) => void;
}

// Move MessageRow outside the main component to avoid re-creation issues
const MessageRow = ({
  item,
  index,
  messages,
  likingMessages,
  themeColors,
  onLikeToggle,
  onLongPress,
  formatDateTime,
  styles,
}: {
  item: MessageState;
  index: number;
  messages: MessageState[];
  likingMessages: Set<string>;
  themeColors: any;
  onLikeToggle: (message: MessageState) => void;
  onLongPress: (
    message: MessageState,
    position: { x: number; y: number },
  ) => void;
  formatDateTime: (date: Date) => string;
  styles: any;
}) => {
  if (item.dateSeparator) {
    return (
      <View style={styles.dateSeparatorContainer}>
        <Text style={styles.dateSeparatorText}>{item.dateSeparator}</Text>
      </View>
    );
  }

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

  const handleMessageLongPress = (event: any) => {
    console.log('Message long pressed:', item.id);
    const { pageY, pageX } = event.nativeEvent;
    onLongPress(item, {
      x: Math.max(0, pageX - 150),
      y: Math.max(0, pageY - 100),
    });
  };

  return (
    <View style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}>
      <View
        style={[
          styles.messageContent,
          isMe ? styles.contentMe : styles.contentOther,
        ]}
      >
        {!isMe && showUsername && (
          <Text style={styles.usernameText}>{item.username}</Text>
        )}

        {/* Message bubble as Pressable */}
        <CardBgGradient
          style={isMe ? styles.cardBgGradientMe : styles.cardBgGradientOther}
        >
          <Pressable
            onPress={() => console.log('Message pressed:', item.id)}
            onLongPress={handleMessageLongPress}
            delayLongPress={300}
            style={({ pressed }) => [
              styles.bubble,
              isMe ? styles.bubbleMe : styles.bubbleOther,
              pressed && styles.pressedBubble,
            ]}
          >
            {item.replyTo && item.replyText && (
              <View
                style={[
                  styles.replyBubble,
                  isMe ? styles.replyBubbleMe : styles.replyBubbleOther,
                  styles.replyBubbleWithMargin,
                  isMe
                    ? styles.replyBubbleMeRadius
                    : styles.replyBubbleOtherRadius,
                ]}
              >
                {item.replyTo && (
                  <Text
                    style={[
                      styles.replyToText,
                      { color: themeColors.textGreen },
                    ]}
                  >
                    {item.replyTo}
                  </Text>
                )}
                <Text
                  style={styles.replyBubbleText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.replyText}
                </Text>
              </View>
            )}
            {isMe ? (
              <View style={styles.messageContainerMe}>
                <Text
                  style={[
                    styles.messageText,
                    styles.messageTextMe,
                    item.replyTo && styles.messageTextWithReply,
                    item.replyTo && styles.messageTextWithReplyMargin,
                    styles.messageTextFlex,
                  ]}
                >
                  {item.text}
                </Text>
                {item.timestamp && (
                  <Text
                    style={[
                      styles.timestampText,
                      styles.timestampMe,
                      styles.timestampMeMargin,
                    ]}
                  >
                    {formatDateTime(new Date(item.timestamp))}
                  </Text>
                )}
              </View>
            ) : (
              <>
                <Text
                  style={[
                    styles.messageText,
                    item.replyTo && styles.messageTextWithReply,
                    item.replyTo && styles.messageTextWithReplyMargin,
                  ]}
                >
                  {item.text}
                </Text>
                {item.timestamp && (
                  <Text style={[styles.timestampText, styles.timestampOther]}>
                    {formatDateTime(new Date(item.timestamp))}
                  </Text>
                )}
              </>
            )}
          </Pressable>
        </CardBgGradient>

        {/* Like button, outside the message bubble's Pressable to avoid overlap */}
        {item.likes != null && item.likes > 0 && (
          <View pointerEvents="box-none">
            <Pressable
              style={[styles.likePillFloat, styles.likePillFloatEnd]}
              onPress={() => onLikeToggle(item)}
              disabled={isLiking}
            >
              <Icon
                name="heart-outline"
                size={11}
                color={item.isLiked ? themeColors.textGreen : themeColors.text}
              />
              <Text style={styles.likePillTextOverlay}>{item.likes}</Text>
              {isLiking && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={styles.activityIndicator}
                />
              )}
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const GameChatList: React.FC<GameChatListProps> = ({
  messages,
  isLoadingMessages,
  likingMessages,
  themeColors,
  flatListRef,
  onLikeToggle,
  onLongPress,
  formatDateTime,
  onLayoutChatView,
}) => {
  const styles = getStyles(themeColors);
  const chatViewRef = useRef<View>(null);
  const [_, setChatViewLayout] = useState<any>(null);

  const renderMessageRow = useCallback(
    ({ item, index }: { item: MessageState; index: number }) => (
      <MessageRow
        item={item}
        index={index}
        messages={messages}
        likingMessages={likingMessages}
        themeColors={themeColors}
        onLikeToggle={onLikeToggle}
        onLongPress={onLongPress}
        formatDateTime={formatDateTime}
        styles={styles}
      />
    ),
    [
      messages,
      likingMessages,
      themeColors,
      onLikeToggle,
      onLongPress,
      formatDateTime,
      styles,
    ],
  );

  if (isLoadingMessages) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <View
      ref={chatViewRef}
      style={styles.chatViewContainer}
      onLayout={(e) => {
        setChatViewLayout(e.nativeEvent.layout);
        if (onLayoutChatView) onLayoutChatView(e.nativeEvent.layout);
      }}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        scrollEventThrottle={16}
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
    </View>
  );
};

const getStyles = (themeColors: import('../../../theme/colors').ThemeColors) =>
  StyleSheet.create({
    dateTimeHeader: {
      backgroundColor: '#181C4A',
      paddingVertical: 8,
      alignItems: 'center',
    },
    dateTimeText: {
      color: themeColors.textWhite,
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
      position: 'relative',
    },
    rowOther: { justifyContent: 'flex-start', paddingLeft: 16 },
    rowMe: { justifyContent: 'flex-end', paddingRight: 16 },
    avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 8 },
    messageContent: {
      flexDirection: 'column',
      maxWidth: '75%',
      position: 'relative',
    },
    contentOther: { alignItems: 'flex-end' },
    contentMe: { alignItems: 'flex-start' },
    usernameText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      alignSelf: 'flex-start',
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
      color: themeColors.textWhite,
    },
    replyLabelMe: {
      color: themeColors.textWhite,
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
      backgroundColor: '#f0f0f0',
      borderRadius: 6,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginBottom: 6,
      maxWidth: '100%',
    },
    replyBubbleMe: {
      backgroundColor: '#22262E',
      minHeight: 70,
      justifyContent: 'center',
    },
    replyBubbleOther: {
      backgroundColor: '#22262E',
      minHeight: 70,
      justifyContent: 'center',
    },
    replyBubbleText: {
      color: themeColors.textSupporting,
      fontSize: 14,
      marginTop: 5,
    },
    bubble: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingTop: 7,
      paddingBottom: 13,
      minWidth: 300,
      minHeight: 70,
      position: 'relative',
      zIndex: 1, // Ensure the reply bubble appears above the replied text
      justifyContent: 'center',
    },
    bubbleOther: {
      borderTopLeftRadius: 0,
    },
    bubbleMe: {
      borderTopRightRadius: 0,
    },
    messageText: {
      color: themeColors.textWhite,
      fontSize: 14,
      marginTop: 5,
      marginLeft: 5,
    },
    messageTextMe: {
      color: themeColors.textWhite,
      fontSize: 14,
      marginTop: 5,
      marginLeft: 5,
    },
    messageTextWithReply: {
      marginTop: -4, // Negative margin to create overlap
    },
    likePillFloat: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.charcoalBlue,
      borderRadius: 9,
      paddingHorizontal: 5,
      paddingVertical: 2,
      zIndex: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    likePillFloatEnd: {
      right: -12,
      bottom: -7,
    },
    likePillTextOverlay: {
      color: themeColors.textWhite,
      fontSize: 11,
      marginLeft: 2,
      fontWeight: '500',
    },
    activityIndicator: {
      marginLeft: 4,
    },
    timestampText: {
      color: themeColors.slateGray,
      fontSize: 11,
      marginTop: 10,
    },
    timestampMe: {
      alignSelf: 'flex-end',
      textAlign: 'right',
      fontSize: 12,
      color: themeColors.slateGray,
    },
    timestampOther: {
      alignSelf: 'flex-start',
      textAlign: 'left',
      marginLeft: 5,
      fontSize: 12,
      color: themeColors.slateGray,
    },
    cardBgGradientMe: {
      borderRadius: 6,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 6,
    },
    cardBgGradientOther: {
      borderRadius: 6,
      borderTopRightRadius: 6,
      borderTopLeftRadius: 0,
    },
    pressedBubble: {
      opacity: 0.5,
    },
    replyBubbleWithMargin: {
      marginBottom: 5,
    },
    replyBubbleMeRadius: {
      borderTopRightRadius: 0,
    },
    replyBubbleOtherRadius: {
      borderTopLeftRadius: 0,
    },
    replyToText: {
      fontWeight: 'bold',
      fontSize: 12,
      marginBottom: 2,
    },
    messageContainerMe: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    messageTextWithReplyMargin: {
      marginTop: 5,
    },
    messageTextFlex: {
      flexShrink: 1,
      flexGrow: 1,
    },
    timestampMeMargin: {
      marginLeft: 8,
      flexShrink: 0,
    },
    chatViewContainer: {
      flex: 1,
    },
  }) as any;

export default GameChatList;
