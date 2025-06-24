import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useRoute } from '@react-navigation/native';
import { useEffect, useContext } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';

import { reactToPost, removeReaction } from '../../api/posts';
import { AuthContext } from '../../context/authContext';
import useAppDispatch from '../../hooks/useAppDispatch';
import useEmojiReaction from '../../hooks/useEmojiReaction';
import {
  getPostDetails,
  PostSelectors,
  updateLikeState,
} from '../../reducers/post';
import BackButton from '../../shared/backButton';
import EmojiPicker from '../../shared/EmojiPicker';
import TopProfileBar from '../../shared/TopProfileBar';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { COMMON } from '../../utils/common';

export default function PostDetailsScreen() {
  const route = useRoute();
  const styles = useThemeStyles();
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const { postId } = route.params as { postId: string };

  const { postDetails } = PostSelectors();

  const {
    showEmojiPicker,
    scaleAnim,
    emojis,
    toggleEmojiPicker,
    handleEmojiSelect,
    clearEmoji,
  } = useEmojiReaction({
    currentReactionType: postDetails?.reaction_type,
    onReactionChange: async (emoji) => {
      if (!postDetails) return;

      try {
        const postID = postDetails.id.toString();

        if (emoji) {
          // Add or change reaction
          const response = await reactToPost(postID, emoji.reactionType);
          const updatedPost = response.data.post;

          dispatch(
            updateLikeState({
              id: updatedPost.id,
              is_like: true,
              likes_count: updatedPost.likes_count,
              reaction_type: emoji.reactionType,
            }),
          );
        } else {
          // Remove reaction
          await removeReaction(postID);

          dispatch(
            updateLikeState({
              id: postDetails.id,
              is_like: false,
              likes_count: Math.max(postDetails.likes_count - 1, 0),
              reaction_type: null,
            }),
          );
        }
      } catch (error) {
        console.error('Error handling reaction:', error);
      }
    },
  });

  useEffect(() => {
    dispatch(getPostDetails({ postId }));
  }, [dispatch, postId]);

  const renderContent = () => {
    if (!postDetails) return null;

    if (postDetails.content_type === 'video' && postDetails.video_url) {
      return (
        <Video
          source={{ uri: postDetails.video_url }}
          style={styles.feedVideoDetails}
          resizeMode="contain"
          shouldPlay
          isLooping
          controls={true}
        />
      );
    } else if (postDetails.content_type === 'photo' && postDetails.image_url) {
      return (
        <Image
          source={{ uri: postDetails.image_url }}
          style={styles.feedImage}
        />
      );
    } else {
      return null;
    }
  };

  // Render overall reactions display (above the heart) with circular overlapping emojis
  const renderOverallReactions = () => {
    if (
      !postDetails?.emoji_counts ||
      Object.keys(postDetails.emoji_counts).length === 0
    ) {
      return null;
    }

    const reactionTypes = Object.keys(postDetails.emoji_counts);
    const displayedReactions = reactionTypes.slice(0, 5); // Show up to 5 different emojis
    const totalReactions = postDetails.likes_count || 0;

    return (
      <View style={[styles.flexRow, styles.alignItemsCenter, styles.mb1]}>
        <View
          style={[styles.flexRow, styles.alignItemsCenter, styles.marginRight]}
        >
          {displayedReactions.map((type, index) => {
            const matchingEmoji = emojis.find((e) => e.reactionType === type);
            if (!matchingEmoji) return null;

            return (
              <View
                key={type}
                style={[
                  customStyles.displayReaction,
                  index > 0 && customStyles.marginLeft,
                ]}
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

  // Render user interaction - shows the emoji they reacted with or empty heart
  const renderUserReactionButton = () => {
    if (!postDetails) return null;

    // First, check if current user has a reaction in the likes array
    const userReaction = postDetails.likes?.find(
      (like) => like.user.email === user?.email,
    );

    if (userReaction) {
      const userEmoji = emojis.find(
        (e) => e.reactionType === userReaction.reaction_type,
      );
      if (userEmoji) {
        return <Text style={customStyles.font20}>{userEmoji.emoji}</Text>;
      }
    }

    // Fallback to is_like and reaction_type (for backward compatibility)
    if (postDetails.is_like && postDetails.reaction_type) {
      const userEmoji = emojis.find(
        (e) => e.reactionType === postDetails.reaction_type,
      );
      if (userEmoji) {
        return <Text style={customStyles.font20}>{userEmoji.emoji}</Text>;
      }
    }

    // Default empty heart when user hasn't reacted
    return (
      <FontAwesome6
        name="heart"
        iconStyle="regular"
        size={20}
        style={styles.textSupporting}
      />
    );
  };

  if (!postDetails) {
    return (
      <View style={[styles.flex1, styles.appBG, styles.justifyContentCenter]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.flex1, styles.appBG, styles.ph4]}>
      <View
        style={[
          styles.flexRow,
          styles.justifyContentBetween,
          styles.alignItemsCenter,
        ]}
      >
        <BackButton />
        <TopProfileBar showSearchIcon />
      </View>
      <View style={[styles.flex1, styles.justifyContentBetween]}>
        <ScrollView style={[styles.mt4, styles.gap2]}>
          <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}>
            <Image
              source={{
                uri:
                  postDetails.profile_image_url ||
                  'https://picsum.photos/200/300',
              }}
              style={styles.feedUserAvatar}
            />
            <Text style={styles.textDefaultSmall}>{postDetails.username}</Text>
          </View>
          <Text style={styles.textDefaultLarge}>{postDetails.title}</Text>
          <View style={[styles.separatorLine, styles.mv4]} />
          <View style={styles.mb4}>
            <Text style={[styles.textDefaultSmall, styles.fontWeigthMedium]}>
              {postDetails.screen_name}
            </Text>
            <Text style={[styles.textDefaultSmall, styles.fontWeightLight]}>
              {COMMON.dateStr(postDetails.created_at)}
            </Text>
          </View>
          <Text style={[styles.textSupportingSmall, styles.mb4]}>
            {postDetails.text_body}
          </Text>
          {renderContent()}

          {/* Overall reactions display - matching FeedCard */}
          {renderOverallReactions()}
        </ScrollView>
        <View
          style={[
            styles.flexRow,
            styles.justifyContentBetween,
            styles.alignItemsCenter,
            styles.mt2,
            styles.ph2,
            styles.pv4,
          ]}
        >
          <View style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}>
            <View
              style={[
                styles.flexRow,
                styles.alignItemsCenter,
                styles.gap2,
                customStyles.emojiContainer,
              ]}
            >
              <View>
                <TouchableOpacity
                  onPress={toggleEmojiPicker}
                  onLongPress={clearEmoji}
                  style={[styles.flexRow, styles.alignItemsCenter]}
                  activeOpacity={0.7}
                >
                  {renderUserReactionButton()}
                </TouchableOpacity>

                {showEmojiPicker && (
                  <EmojiPicker
                    emojis={emojis}
                    scaleAnim={scaleAnim}
                    onSelectEmoji={handleEmojiSelect}
                    containerStyle={customStyles.emojiPicker}
                  />
                )}
              </View>
            </View>
            <View
              style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}
            >
              <TouchableOpacity>
                <FontAwesome6
                  name="message"
                  size={20}
                  style={styles.textSupporting}
                />
              </TouchableOpacity>
              <Text style={styles.textSupportingSmall}>
                {postDetails.likes_count}
              </Text>
            </View>
            <TouchableOpacity>
              <IonIcon
                name="send-outline"
                size={20}
                style={[styles.textSupporting]}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <IonIcon
              name="bookmark-outline"
              size={20}
              style={styles.textSupporting}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const customStyles = StyleSheet.create({
  emojiContainer: {
    position: 'relative',
    zIndex: 5,
  },
  emojiPicker: {
    bottom: 50,
  },
  displayReaction: {
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
  marginLeft: {
    marginLeft: -8,
  },
});
