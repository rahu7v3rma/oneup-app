import { GradientBackground } from '@components/GradientBackground';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useRoute } from '@react-navigation/native';
import FeedHeader from '@shared/FeedHeader';
import Spacer from '@shared/Spacer';
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

import SaveIcon from '../../../assets/svgs/feedSVGs/save.svg';
import ShareIcon from '../../../assets/svgs/feedSVGs/shareArrow.svg';
import { reactToPost, removeReaction } from '../../api/posts';
import { AuthContext } from '../../context/authContext';
import useAppDispatch from '../../hooks/useAppDispatch';
import useEmojiReaction from '../../hooks/useEmojiReaction';
import {
  clearPostDetails,
  getPostDetails,
  PostSelectors,
  updateLikeState,
} from '../../reducers/post';
// import BackButton from '../../shared/backButton';
import EmojiPicker from '../../shared/EmojiPicker';
// import TopProfileBar from '../../shared/TopProfileBar';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

export default function PostDetailsScreen() {
  const route = useRoute();
  const styles = useThemeStyles();
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const { postId } = route.params as { postId: string };

  const { postDetails, loading } = PostSelectors();

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
        const oldReactionType = postDetails.reaction_type;
        const currentEmojiCounts = { ...postDetails.emoji_counts };

        if (emoji) {
          // Add or change reaction
          const response = await reactToPost(postID, emoji.reactionType);
          const updatedPost = response.data.post;

          // Update emoji counts
          if (oldReactionType && currentEmojiCounts[oldReactionType]) {
            currentEmojiCounts[oldReactionType] = Math.max(
              currentEmojiCounts[oldReactionType] - 1,
              0,
            );
            if (currentEmojiCounts[oldReactionType] === 0) {
              delete currentEmojiCounts[oldReactionType];
            }
          }
          currentEmojiCounts[emoji.reactionType] =
            (currentEmojiCounts[emoji.reactionType] || 0) + 1;

          dispatch(
            updateLikeState({
              id: updatedPost.id,
              is_like: true,
              likes_count: updatedPost.likes_count,
              reaction_type: emoji.reactionType,
              user_email: user?.email || '',
              emoji_counts: currentEmojiCounts,
            }),
          );
        } else {
          // Remove reaction
          await removeReaction(postID);

          // Update emoji counts for removal
          if (oldReactionType && currentEmojiCounts[oldReactionType]) {
            currentEmojiCounts[oldReactionType] = Math.max(
              currentEmojiCounts[oldReactionType] - 1,
              0,
            );
            if (currentEmojiCounts[oldReactionType] === 0) {
              delete currentEmojiCounts[oldReactionType];
            }
          }

          dispatch(
            updateLikeState({
              id: postDetails.id,
              is_like: false,
              likes_count: Math.max(postDetails.likes_count - 1, 0),
              reaction_type: null,
              user_email: user?.email || '',
              emoji_counts: currentEmojiCounts,
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

    // Clear post details when component unmounts
    return () => {
      dispatch(clearPostDetails());
    };
  }, [dispatch, postId]);

  const renderContent = () => {
    if (!postDetails) return null;

    if (postDetails.content_type === 'video' && postDetails.video_url) {
      return (
        <Video
          source={{ uri: postDetails.video_url }}
          style={styles.feedVideoDetails}
          resizeMode="contain"
          paused={false}
          repeat={true}
          controls={true}
        />
      );
    } else if (postDetails.content_type === 'photo' && postDetails.image_url) {
      return (
        <Image
          source={{ uri: postDetails.image_url }}
          style={styles.feedImage}
          resizeMode="contain"
          height={300}
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
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.mr2]}>
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
        return (
          <Text style={[customStyles.font20, styles.textSupporting]}>
            {userEmoji.emoji}
          </Text>
        );
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
        style={styles.textMuted}
      />
    );
  };

  // if (!postDetails) {
  //   return (
  //     <View style={[styles.flex1, styles.appBG, styles.justifyContentCenter]}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // Show loader when loading is true OR postDetails is null
  if (loading || !postDetails) {
    return (
      <GradientBackground>
        <View style={styles.appHeaderBG}>
          <Spacer multiplier={1.4} />
          <FeedHeader
            label="Feed"
            showBackButton
            containerStyle={styles.appHeaderBG}
          />
        </View>
        <View style={[styles.flex1, styles.justifyContentCenter]}>
          <ActivityIndicator size="large" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.appHeaderBG}>
        <Spacer multiplier={1.4} />
        <FeedHeader
          label="Feed"
          showBackButton
          containerStyle={styles.appHeaderBG}
        />
      </View>
      <View style={[styles.flex1, styles.justifyContentBetween, styles.ph4]}>
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
            <Text style={[styles.textInterMedium, styles.fontSize12]}>
              {postDetails.username}
            </Text>
          </View>
          <Text
            style={[
              styles.textInterRegular,
              styles.textDetail,
              styles.fontSize13,
              styles.pt4,
            ]}
          >
            {postDetails.text_body}
          </Text>
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
            <View
              style={[styles.flexRow, styles.alignItemsCenter, styles.gap3]}
            >
              <View
                style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}
              >
                <TouchableOpacity
                  style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}
                >
                  <ShareIcon width={22} height={17} />
                  <Text style={styles.textSupporting}>238</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}
              >
                <TouchableOpacity
                  style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}
                >
                  <SaveIcon width={14} height={18} />
                  <Text style={styles.textSupporting}>456</Text>
                </TouchableOpacity>
              </View>
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
                <Text style={styles.textSupporting}>
                  {postDetails.likes_count}
                </Text>
              </View>
            </View>
          </View>
          {renderContent()}
          {renderOverallReactions()}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const customStyles = StyleSheet.create({
  // headerContainer: {
  //   backgroundColor: '#2196F3',
  // },
  // header: {
  //   backgroundColor: '#2196F3',
  // },
  emojiContainer: {
    position: 'relative',
    zIndex: 5,
  },
  emojiPicker: {
    bottom: 30,
    left: -20,
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
