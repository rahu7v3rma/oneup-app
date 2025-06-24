import { RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '@shared/backButton';
import TopProfileBar from '@shared/TopProfileBar';
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import tokenService from '../../api/services/token.service';
import GameChatActionMenu from '../../components/GameChat/components/GameChatActionMenu';
import GameChatDivider from '../../components/GameChat/components/GameChatDivider';
import GameChatGameInfo from '../../components/GameChat/components/GameChatGameInfo';
import GameChatHeader from '../../components/GameChat/components/GameChatHeader';
import GameChatList from '../../components/GameChat/components/GameChatList';
import GameChatMessageInput from '../../components/GameChat/components/GameChatMessageInput';
import { AuthContext } from '../../context/authContext';
import { streamChatService } from '../../services/streamChat';
import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { Message } from '../../types/GameChat';
import { COMMON } from '../../utils/common';

type RootStackParamList = {
  GameChat: {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    gameTime: string;
    gameDate: string;
    gameType: string;
  };
  Messages: undefined;
};

type GameChatProps = {
  route: RouteProp<RootStackParamList, 'GameChat'>;
};

/**
 * A functional component that renders a game chat screen with real-time messaging capabilities.
 * Features include:
 * - Game information header with team logos and match details
 * - Chat messages with support for likes, replies, and user avatars
 * - Message input with keyboard handling
 * - Auto-scrolling to latest messages
 * - Date separators for message grouping
 * - Integration with Stream Chat for real-time messaging
 *
 * @returns {JSX.Element} A SafeAreaView containing the complete game chat interface
 */
const GameChatScreen: React.FC<GameChatProps> = ({ route }) => {
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const styles = createStyles(themeColors);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<any>>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    gameId,
    homeTeam,
    awayTeam,
    homeTeamLogo,
    awayTeamLogo,
    gameTime,
    gameDate,
    gameType,
  } = route.params;
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const currentUserRef = useRef<any>(null);
  // State for messages and input
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [channel, setChannel] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  const [likingMessages, setLikingMessages] = useState<Set<string>>(new Set());

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const messagesLength = messages.length;

  const { user } = useContext(AuthContext);
  const [isCheckingAvatar, setIsCheckingAvatar] = useState(false);
  const lastSyncedAvatarRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format current date/time like in the UI
  const formatDateTime = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dayName} ${time}`;
  };

  const parseGameDateTime = (eventTime: string, eventDate: string): Date => {
    try {
      if (!eventTime || !eventDate) return new Date();

      const year = new Date().getFullYear();
      type MonthKey =
        | 'JAN'
        | 'FEB'
        | 'MAR'
        | 'APR'
        | 'MAY'
        | 'JUN'
        | 'JUL'
        | 'AUG'
        | 'SEP'
        | 'OCT'
        | 'NOV'
        | 'DEC';
      const monthMap: Record<MonthKey, number> = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
      };

      // Parse date
      const dateMatch = eventDate.match(/([A-Z]{3}), ([A-Z]{3}) (\d+)/);
      const [monthNum, day] = dateMatch
        ? [monthMap[dateMatch[2] as MonthKey], parseInt(dateMatch[3], 10)]
        : eventDate
            .split('/')
            .map((val, i) =>
              i === 0 ? parseInt(val, 10) : parseInt(val, 10) - 1,
            );

      // Parse time
      const [_, hours, minutes, period] =
        eventTime.match(/(\d+):(\d+) (AM|PM)/) || [];
      if (!hours || !minutes || !period) return new Date();

      let h = parseInt(hours, 10);
      h =
        period === 'PM' && h !== 12
          ? h + 12
          : period === 'AM' && h === 12
            ? 0
            : h;

      const date = new Date(year, monthNum, day, h, parseInt(minutes, 10));
      return isNaN(date.getTime()) ? new Date() : date;
    } catch (error) {
      console.error('Error parsing game time:', error);
      return new Date();
    }
  };

  // Add a ref to store all messages for parent lookup
  const allMessagesRef = useRef<Map<string, any>>(new Map());

  // FIXED: Format messages with proper parent message lookup
  const formatMessage = useCallback((msg: any, userInfo: any): Message => {
    const isMe = msg.user.id === userInfo?.id;
    const hasParent = !!msg.parent_id;

    // Extract like information
    const likeCount = msg.reaction_counts?.like || 0;
    const userReactions = msg.own_reactions || [];
    const isLiked = userReactions.some(
      (reaction: any) => reaction.type === 'like',
    );

    let avatarUri;
    if (msg.user.image) {
      avatarUri = msg.user.image.startsWith('http')
        ? msg.user.image
        : `${COMMON.imageBaseUrl}${msg.user.image}`;
    }

    // Store this message for future parent lookups
    allMessagesRef.current.set(msg.id, msg);

    // Fix: Look up parent message from our stored messages
    let replyReference, replyText;
    if (hasParent) {
      // First try to get parent from the message itself
      let parentMsg = msg.parent_message || msg.parent || msg.quoted_message;

      // If not found, look it up from our stored messages
      if (!parentMsg && msg.parent_id) {
        parentMsg = allMessagesRef.current.get(msg.parent_id);
        console.log(
          'Looking up parent from stored messages:',
          msg.parent_id,
          parentMsg,
        );
      }

      if (parentMsg) {
        replyReference =
          parentMsg.user?.name ||
          parentMsg.user?.display_name ||
          parentMsg.user?.id ||
          'Unknown User';
        replyText = parentMsg.text || parentMsg.message || '';
        console.log('Found parent data:', { replyReference, replyText });
      } else {
        console.log('No parent message found for ID:', msg.parent_id);
        // Set fallback values
        replyReference = 'Unknown User';
        replyText = 'Original message not available';
      }
    }

    const formattedMessage = {
      id: msg.id,
      text: msg.text,
      isMe,
      username: msg.user.name,
      avatar: avatarUri ? { uri: avatarUri } : undefined,
      timestamp: new Date(msg.created_at),
      parentId: msg.parent_id,
      replyTo: replyReference,
      replyText: replyText,
      likes: likeCount,
      isLiked: isLiked,
      likeState: {
        isLiked,
        likeCount,
        userLikes:
          msg.latest_reactions
            ?.filter((r: any) => r.type === 'like')
            ?.map((r: any) => r.user?.id) || [],
      },
    };

    if (hasParent) {
      console.log('Formatted message with reply:', formattedMessage);
    }

    return formattedMessage;
  }, []);

  useEffect(() => {
    if (currentUser && messages.length > 0) {
      console.log('Re-formatting messages with updated currentUser');
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          const isMe =
            msg.username === currentUser.name ||
            (msg.username &&
              currentUser.display_name &&
              msg.username === currentUser.display_name);

          return {
            ...msg,
            isMe,
          };
        }),
      );
    }
  }, [currentUser, messages.length]);

  const initializeChat = useCallback(async () => {
    try {
      setIsConnecting(true);
      setIsLoadingMessages(true);

      const connected = await streamChatService.connectUser();
      if (!connected) {
        Alert.alert('Error', 'Failed to connect to chat');
        navigation.goBack();
        return;
      }

      const presentUser = streamChatService.getCurrentUser();
      setCurrentUser(presentUser);
      currentUserRef.current = presentUser;

      const gameData = {
        eventId: gameId,
        homeTeamName: homeTeam,
        awayTeamName: awayTeam,
        gameStatus: 'live' as const,
        gameTime: parseGameDateTime(gameTime, gameDate),
        homeTeamLogo,
        awayTeamLogo,
        gameType,
      };

      const gameChannel =
        await streamChatService.createOrJoinGameChannel(gameData);
      setChannel(gameChannel);

      const response = await gameChannel.query({
        messages: { limit: 30 },
      });

      // First, store all messages in our ref for parent lookup
      response.messages.forEach((msg: any) => {
        allMessagesRef.current.set(msg.id, msg);
      });

      // Fetch replies for each message with replies
      let allMessages = [...response.messages];
      for (const msg of response.messages) {
        if (msg.reply_count > 0) {
          try {
            const repliesResponse = await gameChannel.getReplies(msg.id);
            repliesResponse.messages.forEach((reply: any) => {
              allMessagesRef.current.set(reply.id, reply);
            });
            allMessages = allMessages.concat(repliesResponse.messages);
          } catch (err) {
            console.error('Failed to fetch replies for', msg.id, err);
          }
        }
      }

      // Sort all messages by created_at (oldest first)
      allMessages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      // Then format messages (now parent lookup will work)
      const formattedMessages = allMessages.map((msg: any) =>
        formatMessage(msg, presentUser),
      );
      setMessages(formattedMessages);
      setIsLoadingMessages(false);

      const handleNewMessage = (event: any) => {
        const newMessage = formatMessage(event.message, currentUserRef.current);
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev; // Skip if already exists
          }
          return [...prev, newMessage];
        });

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      };

      const handleMessageUpdated = (event: any) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === event.message.id
              ? formatMessage(event.message, currentUserRef.current)
              : msg,
          ),
        );
      };

      const handleReactionNew = (event: any) => {
        console.log('New reaction:', event.reaction);
        if (event.reaction.type === 'like') {
          // The event.message object has the updated reaction counts.
          // Re-format the message from the event to get the correct state.
          const updatedMessage = formatMessage(
            event.message,
            currentUserRef.current,
          );
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg,
            ),
          );
        }
      };

      const handleReactionDeleted = (event: any) => {
        console.log('Reaction deleted:', event.reaction);
        if (event.reaction.type === 'like') {
          // The event.message object has the updated reaction counts.
          // Re-format the message from the event to get the correct state.
          const updatedMessage = formatMessage(
            event.message,
            currentUserRef.current,
          );
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg,
            ),
          );
        }
      };

      const handleMessageDeleted = (event: any) => {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== event.message.id),
        );
      };

      gameChannel.on('message.new', handleNewMessage);
      gameChannel.on('message.updated', handleMessageUpdated);
      gameChannel.on('message.deleted', handleMessageDeleted);
      gameChannel.on('reaction.new', handleReactionNew);
      gameChannel.on('reaction.deleted', handleReactionDeleted);

      console.log('Chat initialized successfully');
    } catch (error) {
      setIsLoadingMessages(false);
      console.error('Failed to initialize chat:', error);
      Alert.alert('Error', 'Failed to initialize chat');
    } finally {
      setIsConnecting(false);
    }
  }, [
    gameId,
    awayTeam,
    awayTeamLogo,
    gameTime,
    gameDate,
    gameType,
    homeTeam,
    homeTeamLogo,
    navigation,
    formatMessage,
  ]);

  useEffect(() => {
    const initialize = async () => {
      await initializeChat();
    };
    initialize();

    return () => {
      if (channel) {
        channel.off('message.new');
        channel.off('message.updated');
        channel.off('message.deleted');
        channel.off('reaction.new');
        channel.off('reaction.deleted');
        channel.off();
      }
    };
  }, [
    gameId,
    awayTeam,
    awayTeamLogo,
    gameTime,
    gameType,
    homeTeam,
    homeTeamLogo,
    channel,
    initializeChat,
  ]);

  useEffect(() => {
    if (flatListRef.current && messagesLength > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messagesLength, isLoadingMessages]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !channel) return;

    try {
      // Clear input immediately for better UX
      setInputValue('');

      // Prepare message data
      const messageData: any = {
        text: trimmed,
      };

      // Add parent message if replying
      if (replyTo) {
        messageData.parent_id = replyTo.id;
      }

      // Send message through Stream Chat
      const response = await channel.sendMessage(messageData);
      console.log('Message sent successfully:', response);

      // Clear reply state
      setReplyTo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
      // Restore input value if sending failed
      setInputValue(trimmed);
    }
  };

  // Handle like toggle
  const handleLikeToggle = async (message: Message) => {
    if (likingMessages.has(message.id)) return; // Prevent double-tapping

    setLikingMessages((prev) => new Set(prev).add(message.id));

    try {
      // The event listeners ('reaction.new', 'reaction.deleted') will handle the UI update.
      // We no longer need to manually update state here.
      await streamChatService.toggleMessageLike(message.id, message.parentId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      Alert.alert('Error', 'Failed to update like');
    } finally {
      setLikingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(message.id);
        return newSet;
      });
    }
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
    setShowActionMenu(false);
    setSelectedMessage(null);
    inputRef.current?.focus();
  };

  const handleWagers = () => {
    console.log('wagers clicked!');
  };

  const handleReport = () => {
    console.log('report clicked!');
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // Handle long press with action menu
  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setShowActionMenu(true);
  };

  const handleCloseActionMenu = () => {
    setShowActionMenu(false);
    setSelectedMessage(null);
  };

  const handleInputKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSend();
    }
  };

  const displayTitle = `${homeTeam} @ ${awayTeam}`;

  useEffect(() => {
    const checkAndSyncAvatar = async () => {
      if (isCheckingAvatar) return;

      try {
        setIsCheckingAvatar(true);
        const { userData } = await tokenService.getTokenData();

        if (
          userData?.avatar &&
          userData.avatar !== lastSyncedAvatarRef.current
        ) {
          const fullAvatarUrl = `${COMMON.imageBaseUrl}${userData.avatar}`;

          // Only update Stream Chat user, don't force channel updates
          await streamChatService.updateUserAvatar(fullAvatarUrl);

          // Update local state once
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isMe ? { ...msg, avatar: { uri: fullAvatarUrl } } : msg,
            ),
          );

          lastSyncedAvatarRef.current = userData.avatar;
        }
      } catch (error) {
        console.error('Error syncing avatar:', error);
      } finally {
        setIsCheckingAvatar(false);
      }
    };
    checkAndSyncAvatar();
  }, [user?.avatar, isCheckingAvatar]);

  return (
    <SafeAreaView style={[themeStyles.flex1, styles.container]} edges={['top']}>
      {/* Top bar */}
      <View style={[themeStyles.flexRow, styles.topBar]}>
        <BackButton />
        <TopProfileBar showSearchIcon={false} />
      </View>

      {/* Header actions */}
      <GameChatHeader
        displayTitle={displayTitle}
        themeStyles={themeStyles}
        onStarPress={() => console.log('Star pressed')}
        onMenuPress={() => console.log('Menu pressed')}
      />

      {/* Game info */}
      <GameChatGameInfo
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeTeamLogo={homeTeamLogo}
        awayTeamLogo={awayTeamLogo}
        gameDate={gameDate}
        gameTime={gameTime}
        gameType={gameType}
      />

      {/* Divider */}
      <GameChatDivider />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 40}
      >
        {/* Chat list */}
        <GameChatList
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          likingMessages={likingMessages}
          themeColors={themeColors}
          flatListRef={flatListRef}
          onLikeToggle={handleLikeToggle}
          onLongPress={handleLongPress}
          formatDateTime={formatDateTime}
          currentDateTime={currentDateTime}
        />

        {/* Message input */}
        <GameChatMessageInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          replyTo={replyTo}
          isConnecting={isConnecting}
          inputRef={inputRef}
          onSend={handleSend}
          onCancelReply={handleCancelReply}
          onInputKeyPress={handleInputKeyPress}
        />
      </KeyboardAvoidingView>

      {/* Action Menu */}
      <GameChatActionMenu
        showActionMenu={showActionMenu}
        selectedMessage={selectedMessage}
        onCloseActionMenu={handleCloseActionMenu}
        onLikeToggle={handleLikeToggle}
        onReply={handleReply}
        onWagers={handleWagers}
        onReport={handleReport}
      />
    </SafeAreaView>
  );
};

const createStyles = (themeColors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.appBG,
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    topBar: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 12,
      backgroundColor: '#181C4A',
    },
  });

export default GameChatScreen;
