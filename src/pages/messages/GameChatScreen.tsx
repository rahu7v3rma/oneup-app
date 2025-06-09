import TopProfileBar from '@components/TopProfileBar';
import Icon from '@react-native-vector-icons/ionicons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '@shared/backButton';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageSourcePropType,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import { useTheme } from '../../theme/ThemeProvider';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

// Placeholder assets
const userAvatar1 = require('../../../assets/images/user1.png');
const userAvatar2 = require('../../../assets/images/user2.png');
const team1Logo = require('../../../assets/pngs/philadelphia-eagles-logo.png');
const team2Logo = require('../../../assets/pngs/washington-commanders-logo.png');

type RootStackParamList = {
  GameChat: { gameId: string };
};

type GameChatProps = {
  route: RouteProp<RootStackParamList, 'GameChat'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'GameChat'>;
};

type Message = {
  id: string;
  avatar?: ImageSourcePropType;
  text: string;
  isMe: boolean;
  likes?: number;
  replyTo?: string;
  replyText?: string;
  dateSeparator?: string;
  username?: string;
};

const mockMessages: Message[] = [
  { id: 'date1', text: '', isMe: false, dateSeparator: 'Fri 3:42 PM' },
  {
    id: '1',
    avatar: userAvatar1,
    text: 'Keep the MO going brother!',
    isMe: false,
    username: 'Noobmaster',
  },
  {
    id: '2',
    avatar: userAvatar1,
    text: 'This is another example of long text with two lines.',
    isMe: false,
    likes: 77,
    username: 'Noobmaster',
  },
  { id: '3', text: 'Keep the MO going brother!', isMe: true },
  {
    id: '4',
    text: 'This is another example of long text with two lines.',
    isMe: true,
  },
  {
    id: '5',
    avatar: userAvatar2,
    text: 'Keep the MO going brother!',
    isMe: false,
    username: 'BlitzASmallWorld',
  },
  {
    id: '6',
    avatar: userAvatar2,
    text: 'This is another example of long text with two lines.',
    isMe: false,
    likes: 5,
    replyTo: 'BlitzASmallWorld',
    replyText: 'Keep the MO going brother!',
    username: 'BlitzASmallWorld',
  },
];

/**
 * A functional component that renders a game chat screen with real-time messaging capabilities.
 * Features include:
 * - Game information header with team logos and match details
 * - Chat messages with support for likes, replies, and user avatars
 * - Message input with keyboard handling
 * - Auto-scrolling to latest messages
 * - Date separators for message grouping
 *
 * @returns {JSX.Element} A SafeAreaView containing the complete game chat interface
 */
const GameChatScreen: React.FC<GameChatProps> = ({ route }) => {
  const { themeColors } = useTheme();
  const themeStyles = useThemeStyles();
  const styles = createStyles(themeColors);
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList<any>>(null);
  const { gameId } = route.params;

  console.log(gameId);

  // State for messages and input
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (flatListRef.current) {
      // Add a small delay to allow layout to update before scrolling
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const newMessage = {
      id: uuid.v4(),
      text: trimmed,
      isMe: true,
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleInputKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSend();
    }
  };

  const renderDateSeparator = (label: string) => (
    <View>
      <Text style={styles.dateSeparatorText}>{label}</Text>
    </View>
  );

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
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
    return (
      <View style={[styles.messageRow, isMe ? styles.rowMe : styles.rowOther]}>
        {!isMe && <Image source={item.avatar!} style={styles.avatar} />}
        <View
          style={[
            styles.messageContent,
            isMe ? styles.contentMe : styles.contentOther,
          ]}
        >
          {!isMe && showUsername && (
            <Text style={styles.usernameText}>{item.username}</Text>
          )}
          {/* Reply label and bubble above main bubble */}
          {item.replyTo && (
            <View style={styles.replyStack}>
              <Text
                style={styles.replyLabel}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Replied to{' '}
                <Text style={styles.replyLabelUsername}>{item.replyTo}</Text>
              </Text>
              <View style={styles.replyBubble}>
                <Text
                  style={styles.replyBubbleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.replyText}
                </Text>
              </View>
            </View>
          )}
          <View
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
          </View>
          {/* Like pill outside and overlapping bubble */}
          {item.likes != null && (
            <View style={[styles.likePillFloat, styles.likePillFloatEnd]}>
              <Icon name="heart-outline" size={11} color="#fff" />
              <Text style={styles.likePillTextOverlay}>{item.likes}</Text>
            </View>
          )}
        </View>
        {isMe && <Image source={item.avatar!} style={styles.avatar} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={[themeStyles.flex1, styles.container]} edges={['top']}>
      {/* Top bar */}
      <View style={[themeStyles.flexRow, styles.topBar]}>
        <BackButton />
        <TopProfileBar showSearchIcon={false} />
      </View>

      {/* Header actions */}
      <View style={[themeStyles.flexRow, styles.headerRow]}>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="star-outline" size={24} color="#8F8184" />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Titans @ Falcons</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="ellipsis-horizontal" size={24} color="#8F8184" />
        </TouchableOpacity>
      </View>

      {/* Game info */}
      <View style={styles.gameInfo}>
        <View style={styles.teamsRow}>
          <View style={styles.teamBlock}>
            <Image source={team1Logo} style={styles.teamLogo} />
            <Text style={styles.teamCode}>PHL</Text>
          </View>
          <View style={styles.separatorLine} />
          <View style={styles.timeBlock}>
            <Text style={styles.gameDate}>SUN, 12/01</Text>
            <Text style={styles.gameTime}>1:00 PM</Text>
            <Text style={styles.gameChannel}>CBS</Text>
          </View>
          <View style={styles.separatorLine} />
          <View style={styles.teamBlock}>
            <Image source={team2Logo} style={styles.teamLogo} />
            <Text style={styles.teamCode}>WSH</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 40}
      >
        {/* Chat list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item, index }) => renderMessage({ item, index })}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {/* Message input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.plusButton}>
              <Icon name="add-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Good morning…"
              placeholderTextColor="#FFFFFF"
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSend}
              onKeyPress={handleInputKeyPress}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/**
 * A function to create styles for a component using the provided theme colors.
 *
 * @param themeColors - An object where keys are the names of the colors and
 *   values are the color codes.
 * @returns Returns a StyleSheet object containing the styles for the component.
 */
const createStyles = (themeColors: Record<string, string>) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.appBG,
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    inputContainer: {
      backgroundColor: '#1B2470',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    topBar: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 12,
      backgroundColor: '#181C4A',
    },

    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#181C4A',
    },
    headerIcon: { marginHorizontal: 8 },
    headerTitleBlock: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    gameInfo: { alignItems: 'center', paddingVertical: 8 },
    teamsRow: { flexDirection: 'row', alignItems: 'center' },
    teamBlock: { alignItems: 'center' },
    teamLogo: { width: 56, height: 56, resizeMode: 'contain' },
    teamCode: { marginTop: 4, color: '#fff', fontSize: 14, fontWeight: 'bold' },
    separatorLine: {
      width: 50,
      height: 2,
      backgroundColor: '#A4A4A4',
      marginHorizontal: 12,
    },
    timeBlock: { alignItems: 'center' },
    gameDate: { color: '#A4A4A4', fontSize: 12, marginBottom: 2 },
    gameTime: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 2,
    },
    gameChannel: { color: '#A4A4A4', fontSize: 12 },

    divider: {
      height: 1,
      backgroundColor: '#353A6D',
      width: '90%',
      alignSelf: 'center',
      marginVertical: 8,
    },

    chatList: {
      paddingBottom: 20,
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

    replyStack: {
      marginBottom: 2,
      alignSelf: 'flex-start',
      maxWidth: '80%',
    },
    replyLabel: {
      color: '#fff',
      fontSize: 12,
      marginBottom: 2,
      marginLeft: 4,
    },
    replyLabelUsername: {
      color: '#fff',
      fontWeight: 'bold',
    },
    replyBubble: {
      backgroundColor: '#E6E6EA',
      borderRadius: 10,
      paddingVertical: 7,
      paddingHorizontal: 14,
      marginBottom: 4,
      alignSelf: 'flex-start',
      maxWidth: 260,
    },
    replyBubbleText: {
      color: '#45435D',
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
    },
    bubbleOther: {},
    bubbleMe: { backgroundColor: '#2ECC8B' },

    messageText: { color: '#fff', fontSize: 15 },
    messageTextMe: { color: '#181C4A' },
    messageTextWithReply: { marginTop: 2 },

    likesContainer: {
      flexShrink: 0,
      marginLeft: 8,
      marginBottom: 6,
      justifyContent: 'flex-end',
    },
    likePill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1B2470',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    likePillText: { color: '#fff', fontSize: 14, marginLeft: 4 },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    plusButton: { marginRight: 8 },
    input: {
      flex: 1,
      backgroundColor: '#F7F7FC99',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      color: '#FFFFFF',
      fontSize: 16,
    },
    sendButton: { marginLeft: 8 },

    dateSeparatorText: {
      marginHorizontal: 8,
      color: '#A4A4A4',
      fontSize: 13,
      fontWeight: '500',
      alignSelf: 'center',
    },

    likePillOverlay: { display: 'none' },
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

    usernameText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 13,
      marginBottom: 2,
      marginLeft: 2,
    },
  });

export default GameChatScreen;
