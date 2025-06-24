import tokenService from '../api/services/token.service';
import { chatClient } from '../lib/streamClient';
import { UserChannel, MessageLikeState, ChatUser } from '../types/GameChat';

class StreamChatService {
  private isConnected = false;
  private currentUser: ChatUser | null = null;
  private currentChannel: any = null;
  private watchedChannels: Set<string> = new Set();
  private rateLimitDelay = 500;
  private channelCache: Map<string, UserChannel> = new Map();
  private cacheExpiry = 5 * 60 * 1000;
  private lastCacheTime = 0;
  private activeRequests = 0;
  private maxConcurrentRequests = 3;
  private requestQueue: Array<() => void> = [];
  private channelMessageListeners: Map<string, () => void> = new Map();
  onUnreadCountUpdate?: (channelId: string, unreadCount: number) => void;
  onChannelUpdate?: (channelId: string, channel: UserChannel) => void;

  private setupMessageListener(channelId: string, channel: any) {
    if (this.channelMessageListeners.has(channelId)) return;

    const listener = async (event: any) => {
      if (!event.message) return;

      const isOwnMessage = event.message.user?.id === this.currentUser?.id;
      const cachedChannel = this.channelCache.get(channelId);

      if (cachedChannel) {
        const lastMessage = {
          text: event.message.text || 'Media message',
          user: {
            id: event.message.user?.id || '',
            name: event.message.user?.name || 'Unknown User',
          },
          created_at:
            event.message.created_at?.toString() || new Date().toISOString(),
        };

        const update: Partial<UserChannel> = {
          lastMessage,
          lastActivity: lastMessage.created_at,
        };

        if (!isOwnMessage) {
          const newUnreadCount = (cachedChannel.unreadCount || 0) + 1;
          update.unreadCount = newUnreadCount;

          this.updateChannelData(channelId, update);
          this.notifyUnreadCountUpdate(channelId, newUnreadCount);
        } else {
          this.updateChannelData(channelId, update);
        }
      }
    };

    channel.on('message.new', listener);
    this.channelMessageListeners.set(channelId, () => {
      channel.off('message.new', listener);
    });
  }

  private notifyUnreadCountUpdate(channelId: string, unreadCount: number) {
    if (this.onUnreadCountUpdate) {
      this.onUnreadCountUpdate(channelId, unreadCount);
    }
  }

  private async throttleRequest<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.activeRequests++;
        try {
          const result = await this.handleRateLimit(fn);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      };

      if (this.activeRequests < this.maxConcurrentRequests) {
        execute();
      } else {
        this.requestQueue.push(execute);
      }
    });
  }

  private processQueue() {
    while (
      this.requestQueue.length > 0 &&
      this.activeRequests < this.maxConcurrentRequests
    ) {
      const nextRequest = this.requestQueue.shift();
      nextRequest!();
    }
  }

  private async handleRateLimit<T>(fn: () => Promise<T>): Promise<T> {
    let attempts = 0;
    const maxAttempts = 5;
    const baseDelay = 1000;

    while (attempts < maxAttempts) {
      try {
        return await fn();
      } catch (error: any) {
        if (error?.code === 9) {
          attempts++;
          const delay = baseDelay * Math.pow(2, attempts) + Math.random() * 500;
          await this.delay(delay);
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Request failed after ${maxAttempts} attempts`);
  }

  async connectUser(): Promise<boolean> {
    try {
      if (chatClient.userID && chatClient.user) {
        const { authToken, userData } = await tokenService.getTokenData();

        if (userData && authToken) {
          this.currentUser = {
            id: authToken,
            name:
              userData.display_name ||
              `${userData.first_name} ${userData.last_name}`.trim(),
            email: userData.email,
            display_name: userData.display_name,
            avatar: userData.avatar,
          };
          this.isConnected = true;
          return true;
        } else {
          console.error('Stream Chat connected but no user data available');
          return false;
        }
      }

      if (this.isConnected && this.currentUser) {
        return true;
      }

      const { authToken, userData } = await tokenService.getTokenData();

      if (!userData || !authToken) {
        console.error('No user data available or missing id');
        return false;
      }

      const chatUser: ChatUser = {
        id: authToken,
        name:
          userData.display_name ||
          `${userData.first_name} ${userData.last_name}`.trim(),
        email: userData.email,
        display_name: userData.display_name,
        avatar: userData.avatar,
      };

      if (!chatClient.userID) {
        await chatClient.connectUser(
          {
            id: chatUser.id.toString(),
            name: chatUser.name,
            image: chatUser.avatar,
            role: 'user',
          },
          chatClient.devToken(chatUser.id.toString()),
        );
      }

      this.isConnected = true;
      this.currentUser = chatUser;
      return true;
    } catch (error) {
      console.error('Failed to connect Stream Chat user:', error);
      return false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheTime < this.cacheExpiry;
  }

  private async getUserParticipationInChannel(channel: any): Promise<{
    hasSentMessage: boolean;
    userMessageCount: number;
    lastUserMessage?: { text: string; created_at: string };
  }> {
    return this.throttleRequest(async () => {
      try {
        let messages = channel.state?.messages || [];

        if (messages.length === 0) {
          try {
            const channelQuery = await channel.query({
              messages: { limit: 100 },
              state: true,
              watch: false,
            });
            messages = channelQuery.messages || [];
          } catch (queryError) {
            return { hasSentMessage: false, userMessageCount: 0 };
          }
        }

        const userMessages = messages.filter(
          (msg: any) => msg.user?.id === chatClient.userID,
        );

        const hasSentMessage = userMessages.length > 0;
        const userMessageCount = userMessages.length;

        let lastUserMessage;
        if (userMessages.length > 0) {
          const lastMsg = userMessages[userMessages.length - 1];
          lastUserMessage = {
            text: lastMsg.text || 'Media message',
            created_at: lastMsg.created_at
              ? lastMsg.created_at.toString()
              : new Date().toISOString(),
          };
        }

        return {
          hasSentMessage,
          userMessageCount,
          lastUserMessage,
        };
      } catch (error) {
        console.error(
          `Error checking user participation in channel ${channel.id}:`,
          error,
        );
        return { hasSentMessage: false, userMessageCount: 0 };
      }
    });
  }

  private async getAccurateUnreadCount(channel: any): Promise<number> {
    try {
      const channelId = channel.id;
      try {
        await channel.watch();
        await channel.query({
          messages: { limit: 50 },
          state: true,
          watch: true,
        });
        this.watchedChannels.add(channelId);
      } catch (watchError) {
        console.error('Channel Watch Failed:', {
          channelId,
          error: watchError,
        });
      }

      const messages = channel.state?.messages || [];
      const currentUserId = chatClient.userID!;

      if (messages.length === 0) {
        return 0;
      }

      const userReadState = channel.state?.read?.[currentUserId];
      let lastReadTime: Date | null = null;

      if (userReadState?.last_read) {
        lastReadTime = new Date(userReadState.last_read);
      }

      const unreadMessages = messages.filter((msg: any) => {
        if (msg.user?.id === currentUserId) {
          return false;
        }

        if (!lastReadTime) {
          return true;
        }

        if (msg.created_at) {
          const messageTime = new Date(msg.created_at);
          const isUnread = messageTime > lastReadTime;
          return isUnread;
        }

        return false;
      });

      const unreadCount = unreadMessages.length;
      return unreadCount;
    } catch (error) {
      console.error('Error getting unread count:', {
        channelId: channel.id,
        error,
      });
      return 0;
    }
  }

  private async forceRefreshChannelUnreadCount(
    channelId: string,
  ): Promise<number> {
    return this.throttleRequest(async () => {
      try {
        const channel = chatClient.channel('livestream', channelId);
        await channel.watch();
        return this.getUnreadCountFromChannelState(channel);
      } catch (error: any) {
        if (error?.code === 9) {
          // Rate limited - return cached value
          const cachedChannel = this.channelCache.get(channelId);
          return cachedChannel?.unreadCount || 0;
        }
        console.error(
          `Failed to refresh unread count for ${channelId}:`,
          error,
        );
        return 0;
      }
    });
  }

  async getUserChannels(forceRefresh = false): Promise<UserChannel[]> {
    try {
      if (!forceRefresh && this.isCacheValid()) {
        return Array.from(this.channelCache.values());
      }
      if (!forceRefresh && this.isCacheValid() && this.channelCache.size > 0) {
        return Array.from(this.channelCache.values()).sort(
          (a, b) =>
            new Date(b.lastActivity).getTime() -
            new Date(a.lastActivity).getTime(),
        );
      }

      const connected = await this.connectUser();
      if (!connected) {
        throw new Error('Failed to connect user to chat');
      }

      const allChannelsMap = new Map<string, any>();
      const userChannels: UserChannel[] = [];

      try {
        const memberChannelsResponse = await chatClient.queryChannels(
          {
            members: { $in: [chatClient.userID!] },
          },
          [{ last_message_at: -1 }],
          {
            limit: 100,
            message_limit: 50,
            member_limit: 100,
            state: true,
            watch: true,
          },
        );

        memberChannelsResponse.forEach((channel) => {
          if (channel.id) {
            allChannelsMap.set(channel.id, channel);
            this.watchedChannels.add(channel.id);
          }
        });

        await this.delay(this.rateLimitDelay);
      } catch (memberError) {
        console.error('Failed to get member channels:', memberError);
      }

      try {
        const publicChannelsResponse = await chatClient.queryChannels(
          {
            type: 'livestream',
          },
          [{ last_message_at: -1 }],
          {
            limit: 100,
            message_limit: 50,
            member_limit: 100,
            state: true,
            watch: false,
          },
        );

        publicChannelsResponse.forEach((channel) => {
          if (channel.id) {
            const channelData = channel.data as any;

            if (
              channel.id.includes('game-') ||
              channelData?.game_id ||
              channelData?.game_title
            ) {
              allChannelsMap.set(channel.id, channel);
            }
          }
        });

        await this.delay(this.rateLimitDelay);
      } catch (publicError) {
        console.error('Failed to get public channels:', publicError);
      }

      try {
        const createdChannelsResponse = await chatClient.queryChannels(
          {
            created_by_id: chatClient.userID!,
          },
          [{ created_at: -1 }],
          {
            limit: 100,
            message_limit: 50,
            member_limit: 100,
            state: true,
            watch: false,
          },
        );

        createdChannelsResponse.forEach((channel) => {
          if (channel.id) {
            allChannelsMap.set(channel.id, channel);
          }
        });

        await this.delay(this.rateLimitDelay);
      } catch (createdError) {
        console.error('Failed to get created channels:', createdError);
      }

      const channelProcessingPromises = Array.from(
        allChannelsMap.entries(),
      ).map(async ([channelId, channel]) => {
        try {
          const participation =
            await this.getUserParticipationInChannel(channel);

          if (!participation.hasSentMessage) {
            return null;
          }

          if (!this.watchedChannels.has(channelId)) {
            try {
              await channel.watch();
              this.watchedChannels.add(channelId);
              this.setupMessageListener(channelId, channel);
              await this.delay(50);
            } catch (watchError) {
              console.error(
                `Could not watch channel ${channelId}:`,
                watchError,
              );
            }
          }

          const messages = channel.state?.messages || [];
          const lastMessage =
            messages.length > 0 ? messages[messages.length - 1] : null;

          let memberCount = 0;
          const channelData = channel.data as any;

          if (channelData && typeof channelData.watcher_count === 'number') {
            memberCount = channelData.watcher_count;
          } else if (channel.state && channel.state.members) {
            memberCount = Object.keys(channel.state.members).length;
          } else if (channel.state && channel.state.watchers) {
            memberCount = Object.keys(channel.state.watchers).length;
          }

          let unreadCount = 0;
          try {
            unreadCount = await this.getAccurateUnreadCount(channel);
          } catch (error: any) {
            if (error?.code === 9) {
              // Use last known value if rate limited
              const cached = this.channelCache.get(channelId);
              unreadCount = cached?.unreadCount || 0;
            } else {
              console.error(
                `Error getting unread count for ${channelId}:`,
                error,
              );
            }
          }

          const gameData =
            channelData && channelData.game_id
              ? {
                  gameId: String(channelData.game_id),
                  homeTeam: String(channelData.home_team || ''),
                  awayTeam: String(channelData.away_team || ''),
                  gameTitle: String(channelData.game_title || ''),
                  gameStatus: String(channelData.game_status || ''),
                  homeTeamLogo: String(channelData.home_team_logo || ''),
                  awayTeamLogo: String(channelData.away_team_logo || ''),
                  gameTime: String(channelData.game_time || ''),
                  gameType: String(channelData.game_type || ''),
                }
              : undefined;

          const processedChannel: UserChannel = {
            id: channelId,
            name: (channelData?.name ||
              channelData?.game_title ||
              channelId) as string,
            type: channel.type,
            lastMessage: lastMessage
              ? {
                  text: lastMessage.text || 'Media message',
                  user: {
                    id: lastMessage.user?.id || '',
                    name: lastMessage.user?.name || 'Unknown User',
                  },
                  created_at: lastMessage.created_at
                    ? lastMessage.created_at.toString()
                    : new Date().toISOString(),
                }
              : null,
            unreadCount: unreadCount,
            memberCount: memberCount > 0 ? memberCount : 1,
            gameData,
            lastActivity: channel.state.last_message_at
              ? typeof channel.state.last_message_at === 'string'
                ? channel.state.last_message_at
                : channel.state.last_message_at.toISOString()
              : new Date().toISOString(),
            userMessageCount: participation.userMessageCount,
            lastUserMessage: participation.lastUserMessage,
          };

          return processedChannel;
        } catch (channelError) {
          console.error(`Error processing channel ${channelId}:`, channelError);
          return null;
        }
      });

      const processedChannels = await Promise.all(channelProcessingPromises);

      processedChannels.forEach((channel) => {
        if (channel) {
          userChannels.push(channel);
        }
      });

      userChannels.sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime(),
      );

      this.channelCache.clear();
      userChannels.forEach((channel) => {
        this.channelCache.set(channel.id, channel);
      });
      this.lastCacheTime = Date.now();

      return userChannels;
    } catch (error) {
      console.error('Failed to fetch user channels:', error);
      return [];
    }
  }

  async markChannelAsRead(channelId: string, channelType = 'livestream') {
    return this.throttleRequest(async () => {
      try {
        const channel = chatClient.channel(channelType, channelId);
        await channel.markRead();

        const cachedChannel = this.channelCache.get(channelId);
        if (cachedChannel) {
          this.updateChannelData(channelId, { unreadCount: 0 });
          cachedChannel.unreadCount = 0;
          this.channelCache.set(channelId, cachedChannel);
        }
      } catch (error) {
        console.error('Failed to mark channel as read:', {
          channelId,
          error,
        });
        throw error;
      }
    });
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const messageTime = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return messageTime.toLocaleDateString();
  }

  async createOrJoinGameChannel(gameData: {
    eventId: string;
    homeTeamName: string;
    awayTeamName: string;
    gameStatus: 'before' | 'live' | 'final';
    gameTime: Date;
    homeTeamLogo?: string;
    awayTeamLogo?: string;
    gameType?: string;
  }): Promise<any> {
    try {
      const connected = await this.connectUser();
      if (!connected) {
        throw new Error('Failed to connect user to chat');
      }

      const channelId = `game-${gameData.eventId}`;
      const gameTitle = `${gameData.homeTeamName} @ ${gameData.awayTeamName}`;

      const channelData: any = {
        name: gameTitle,
        game_id: gameData.eventId,
        home_team: gameData.homeTeamName,
        away_team: gameData.awayTeamName,
        game_status: gameData.gameStatus,
        game_time: gameData.gameTime.toISOString(),
        game_title: gameTitle,
        home_team_logo: gameData.homeTeamLogo || '',
        away_team_logo: gameData.awayTeamLogo || '',
        game_type: gameData.gameType || 'Upcoming Game',
        created_by_id: chatClient.userID!,
      };

      const channel = chatClient.channel('livestream', channelId, channelData);
      await channel.watch();
      if (channel.id) {
        this.watchedChannels.add(channel.id);
      }
      this.currentChannel = channel;
      this.clearCache();
      return channel;
    } catch (error) {
      console.error('Failed to create/join game channel:', error);
      throw error;
    }
  }

  async likeMessage(
    messageId: string,
    parentId?: string,
  ): Promise<MessageLikeState> {
    try {
      if (!this.isUserConnected() || !this.currentChannel) {
        throw new Error('User not connected to chat or no active channel');
      }

      await this.currentChannel.sendReaction(messageId, {
        type: 'like',
        user_id: chatClient.userID!,
      });

      const messageState = await this.getMessageLikeState(messageId, parentId);
      return messageState;
    } catch (error) {
      console.error('Failed to like message:', error);
      throw error;
    }
  }

  async unlikeMessage(
    messageId: string,
    parentId?: string,
  ): Promise<MessageLikeState> {
    try {
      if (!this.isUserConnected() || !this.currentChannel) {
        throw new Error('User not connected to chat or no active channel');
      }

      await this.currentChannel.deleteReaction(
        messageId,
        'like',
        chatClient.userID!,
      );

      const messageState = await this.getMessageLikeState(messageId, parentId);
      return messageState;
    } catch (error) {
      console.error('Failed to unlike message:', error);
      throw error;
    }
  }

  async toggleMessageLike(
    messageId: string,
    parentId?: string,
  ): Promise<MessageLikeState> {
    try {
      const currentState = await this.getMessageLikeState(messageId, parentId);

      if (currentState.isLiked) {
        return await this.unlikeMessage(messageId, parentId);
      } else {
        return await this.likeMessage(messageId, parentId);
      }
    } catch (error) {
      console.error('Failed to toggle message like:', error);
      throw error;
    }
  }

  async getMessageLikeState(
    messageId: string,
    parentId?: string,
  ): Promise<MessageLikeState> {
    try {
      if (!this.currentChannel) {
        throw new Error('No active channel');
      }

      let message = this.currentChannel.state.messages.find(
        (msg: any) => msg.id === messageId,
      );

      // 2. If not found and parentId is provided, try to find in replies
      if (!message && parentId) {
        const repliesResponse = await this.currentChannel.getReplies(parentId);
        message = repliesResponse.messages.find(
          (msg: any) => msg.id === messageId,
        );
      }

      if (!message) {
        const response = await this.currentChannel.query({
          messages: { limit: 100 },
        });
        message = response.messages.find((msg: any) => msg.id === messageId);
      }

      if (!message) {
        throw new Error('Message not found');
      }

      const likeReactions = message.reaction_counts?.like || 0;
      const userReactions = message.own_reactions || [];
      const isLiked = userReactions.some(
        (reaction: any) => reaction.type === 'like',
      );

      const userLikes: string[] = [];
      if (message.latest_reactions) {
        message.latest_reactions
          .filter((reaction: any) => reaction.type === 'like')
          .forEach((reaction: any) => {
            if (reaction.user?.id) {
              userLikes.push(reaction.user.id);
            }
          });
      }

      return {
        isLiked,
        likeCount: likeReactions,
        userLikes,
      };
    } catch (error) {
      console.error('Failed to get message like state:', error);
      return {
        isLiked: false,
        likeCount: 0,
        userLikes: [],
      };
    }
  }

  async refreshAllUnreadCounts(): Promise<UserChannel[]> {
    try {
      const cachedChannels = Array.from(this.channelCache.values());
      const updatedChannels: UserChannel[] = [];

      const batchSize = 10;
      for (let i = 0; i < cachedChannels.length; i += batchSize) {
        const batch = cachedChannels.slice(i, i + batchSize);
        const cids = batch.map((channel) => `${channel.type}:${channel.id}`);

        try {
          const channels = await this.queryChannelsBatch(cids);

          for (const channel of channels) {
            const unreadCount = this.getUnreadCountFromChannelState(channel);
            const cachedChannel = this.channelCache.get(channel.id as string);

            if (cachedChannel) {
              cachedChannel.unreadCount = unreadCount;
              updatedChannels.push(cachedChannel);
            }
          }

          await this.delay(300);
        } catch (batchError) {
          console.error(
            'Failed to refresh batch of unread counts:',
            batchError,
          );
          // Add failed channels without update
          batch.forEach((channel) => updatedChannels.push(channel));
        }
      }

      return updatedChannels;
    } catch (error) {
      console.error('Failed to refresh all unread counts:', error);
      return Array.from(this.channelCache.values());
    }
  }

  private getUnreadCountFromChannelState(channel: any): number {
    const messages = channel.state?.messages || [];
    const currentUserId = chatClient.userID!;

    if (messages.length === 0) {
      return 0;
    }

    const userReadState = channel.state?.read?.[currentUserId];
    let lastReadTime: Date | null = null;

    if (userReadState?.last_read) {
      lastReadTime = new Date(userReadState.last_read);
    }

    return messages.filter((msg: any) => {
      if (msg.user?.id === currentUserId) return false;
      if (!lastReadTime) return true;
      if (!msg.created_at) return false;

      const messageTime = new Date(msg.created_at);
      return messageTime > lastReadTime!;
    }).length;
  }

  private async queryChannelsBatch(cids: string[]) {
    return this.throttleRequest(async () => {
      try {
        return await chatClient.queryChannels(
          { cid: { $in: cids } },
          { last_message_at: -1 } as any,
          {
            state: true,
            watch: false,
            presence: false,
          },
        );
      } catch (error) {
        console.error('Failed to query channels batch:', error);
        return [];
      }
    });
  }

  private updateChannelData(
    channelId: string,
    update: Partial<UserChannel>,
  ): void {
    const cachedChannel = this.channelCache.get(channelId);
    if (cachedChannel) {
      const updatedChannel = { ...cachedChannel, ...update };
      this.channelCache.set(channelId, updatedChannel);

      if (this.onChannelUpdate) {
        this.onChannelUpdate(channelId, updatedChannel);
      }
    }
  }

  async disconnectUser(): Promise<void> {
    try {
      if (chatClient.userID) {
        await chatClient.disconnectUser();
        this.isConnected = false;
        this.currentUser = null;
        this.currentChannel = null;
        this.watchedChannels.clear();
        this.channelMessageListeners.forEach((removeListener) =>
          removeListener(),
        );
        this.channelMessageListeners.clear();
        this.clearCache();
      }
    } catch (error) {
      console.error('Failed to disconnect Stream Chat user:', error);
    }
  }

  getCurrentUser(): ChatUser | null {
    return this.currentUser;
  }

  isUserConnected(): boolean {
    return this.isConnected && !!chatClient.userID;
  }

  clearCache(): void {
    this.channelCache.clear();
    this.lastCacheTime = 0;
  }

  async updateUserAvatar(avatarUrl: string): Promise<void> {
    try {
      if (!this.isUserConnected() || !this.currentUser) return;

      await chatClient.upsertUser({
        id: this.currentUser.id,
        image: avatarUrl,
        name: this.currentUser.name,
        role: 'user',
      });

      this.currentUser.avatar = avatarUrl;
    } catch (error) {
      console.error('Failed to update Stream Chat avatar:', error);
      throw error;
    }
  }
}

export const streamChatService = new StreamChatService();
