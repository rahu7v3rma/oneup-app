import SaveIcon from '@components/icons/feed/SaveIcon';
import ShareIcon from '@components/icons/feed/ShareIcon';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { useContext, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Share,
  Platform,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';

import { reactToPost, removeReaction } from '../api/posts';
import { Post } from '../api/types';
import { AuthContext } from '../context/authContext';
import useEmojiReaction from '../hooks/useEmojiReaction';
import { useThemeStyles } from '../theme/ThemeStylesProvider';

import EmojiPicker from './EmojiPicker';
import ExpandableText from './ExpandableText';

type FeedCardProps = {
  feedDetails: Post;
  onPressLike?: (
    isLiked: boolean,
    reactionType?: string,
    reactionData?: any,
  ) => void;
  isPlaying: boolean;
};

export default function FeedCard({
  feedDetails,
  onPressLike,
  isPlaying,
}: FeedCardProps) {
  const styles = useThemeStyles();
  const { user } = useContext(AuthContext);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    showEmojiPicker,
    scaleAnim,
    emojis,
    toggleEmojiPicker,
    handleEmojiSelect,
    clearEmoji,
  } = useEmojiReaction({
    currentReactionType:
      feedDetails.likes?.find((like) => like.user.email === user.email)
        ?.reaction_type || null,
    onReactionChange: async (emoji) => {
      if (!onPressLike) return;

      try {
        const postId = feedDetails.id.toString();
        let reactionData;

        if (emoji) {
          // Optimistically update UI
          reactionData = {
            id: Date.now(), // Temporary ID
            user: { email: user?.email },
            reaction_type: emoji.reactionType,
            created_at: new Date().toISOString(),
          };
          onPressLike(true, emoji.reactionType, reactionData);

          // Perform API call
          await reactToPost(postId, emoji.reactionType);
        } else {
          // Optimistically update UI
          onPressLike(false, undefined, { id: user?.id });
          await removeReaction(postId);
        }
      } catch (error) {
        console.error('Error handling emoji reaction:', error);
        // Revert optimistic update on error
        onPressLike(
          !!feedDetails.likes?.find((like) => like.user.email === user?.email),
          feedDetails.likes?.find((like) => like.user.email === user?.email)
            ?.reaction_type,
          null,
        );
      }
    },
  });

  const hasNoMedia = !feedDetails.video_url && !feedDetails.image_url;

  const handleShare = async () => {
    try {
      const twitterUrl = feedDetails.tweet_url;
      const result = await Share.share(
        Platform.OS === 'ios' ? { url: twitterUrl } : { message: twitterUrl },
      );
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleFullscreenPlayerWillPresent = () => {
    setIsFullscreen(true);
  };

  const handleFullscreenPlayerWillDismiss = () => {
    setIsFullscreen(false);
  };

  const renderOverallReactions = () => {
    if (
      !feedDetails.emoji_counts ||
      Object.keys(feedDetails.emoji_counts).length === 0
    ) {
      return null;
    }

    const reactionTypes = Object.keys(feedDetails.emoji_counts);
    const displayedReactions = reactionTypes.slice(0, 5);
    const totalReactions = feedDetails.likes_count || 0;

    return (
      <View style={[styles.flexRow, styles.alignItemsCenter, styles.mb1]}>
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.mr2]}>
          {displayedReactions.map((type, index) => {
            const matchingEmoji = emojis.find((e) => e.reactionType === type);
            if (!matchingEmoji) return null;

            return (
              <View
                key={type}
                style={[customStyles.emojiContainer, index > 0 && styles.mln2]}
              >
                <Text style={customStyles.font14}>{matchingEmoji.emoji}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.textSupportingSmall}>
          {totalReactions}
          {reactionTypes.length > 5 && ` (+${reactionTypes.length - 5} types)`}
        </Text>
      </View>
    );
  };

  const renderUserReactionButton = () => {
    const userReaction = feedDetails.likes?.find(
      (like) => like.user.email === user.email,
    );

    if (userReaction) {
      const userEmoji = emojis.find(
        (e) => e.reactionType === userReaction.reaction_type,
      );
      if (userEmoji) {
        return <Text style={customStyles.font20}>{userEmoji.emoji}</Text>;
      }
    }

    return (
      <FontAwesome6
        name="heart"
        iconStyle="regular"
        size={24}
        style={styles.textMuted}
      />
    );
  };

  return (
    <View style={[styles.card, styles.gap2]}>
      <View
        style={[
          styles.flexRow,
          styles.justifyContentBetween,
          styles.alignItemsCenter,
        ]}
      >
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
          <Image
            source={{ uri: feedDetails.profile_image_url || '' }}
            style={styles.feedUserAvatar}
          />
          <Text style={[styles.textInterMedium, styles.fontSize12]}>
            {feedDetails.username}
          </Text>
        </View>
        <TouchableOpacity>
          <FontAwesome6
            name="ellipsis"
            iconStyle="solid"
            size={20}
            style={styles.textMuted}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.textSupportingSmall} />
      <ExpandableText text={feedDetails.text_body} maxWords={30} />
      {!!feedDetails.video_url && !hasNoMedia ? (
        <TouchableWithoutFeedback>
          <Video
            source={{ uri: feedDetails.video_url || '' }}
            style={styles.feedImage}
            resizeMode={isFullscreen ? 'contain' : 'cover'}
            controls
            paused={!isPlaying}
            onFullscreenPlayerWillPresent={handleFullscreenPlayerWillPresent}
            onFullscreenPlayerWillDismiss={handleFullscreenPlayerWillDismiss}
          />
        </TouchableWithoutFeedback>
      ) : (
        !hasNoMedia && (
          <Image
            source={{ uri: feedDetails.image_url || '' }}
            style={styles.feedImage}
          />
        )
      )}

      {renderOverallReactions()}

      <View
        style={[
          styles.flexRow,
          styles.justifyContentBetween,
          styles.alignItemsCenter,
          styles.mt2,
          styles.ph1,
        ]}
      >
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
          <TouchableOpacity
            onPress={toggleEmojiPicker}
            onLongPress={clearEmoji}
            style={[styles.flexRow, styles.alignItemsCenter]}
          >
            {renderUserReactionButton()}
          </TouchableOpacity>

          {showEmojiPicker && (
            <EmojiPicker
              emojis={emojis}
              scaleAnim={scaleAnim}
              onSelectEmoji={handleEmojiSelect}
            />
          )}
          <TouchableOpacity onPress={handleShare}>
            <ShareIcon color={styles.textMuted.color} size={28} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <SaveIcon color={styles.textMuted.color} size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const customStyles = StyleSheet.create({
  emojiContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  font14: {
    fontSize: 14,
  },
  font20: {
    fontSize: 20,
  },
});
