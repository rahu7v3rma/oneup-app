import { ImageSourcePropType } from 'react-native';

export type Message = {
  id: string;
  avatar?: ImageSourcePropType;
  text: string;
  isMe: boolean;
  likes?: number;
  isLiked?: boolean;
  replyTo?: string;
  replyText?: string;
  dateSeparator?: string;
  username?: string;
  timestamp?: Date;
  parentId?: string;
  likeState?: MessageLikeState;
};

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  display_name?: string;
  avatar?: string;
}

export interface UserChannel {
  id: string;
  name: string;
  type: string;
  lastMessage: {
    text: string;
    user: {
      id: string;
      name: string;
    };
    created_at: string;
  } | null;
  unreadCount: number;
  memberCount: number;
  gameData?: {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    gameTitle: string;
    gameStatus: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    gameTime: string;
    gameType: string;
  };
  lastActivity: string;
  userMessageCount: number;
  lastUserMessage?: {
    text: string;
    created_at: string;
  };
}

export interface MessageLikeState {
  isLiked: boolean;
  likeCount: number;
  userLikes: string[];
}

export interface MessageState {
  id: string;
  text: string;
  isMe: boolean;
  username?: string;
  avatar?: any;
  likes?: number;
  isLiked?: boolean;
  replyTo?: string;
  replyText?: string;
  dateSeparator?: string;
  timestamp?: Date;
  parentId?: string;
}
