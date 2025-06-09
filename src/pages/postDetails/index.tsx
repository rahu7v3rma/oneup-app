import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import IonIcon from '@react-native-vector-icons/ionicons';
import { useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';

import { likePost, unlikePost } from '../../api/posts';
import TopProfileBar from '../../components/TopProfileBar';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  getPostDetails,
  PostSelectors,
  updateLikeState,
} from '../../reducers/post';
import BackButton from '../../shared/backButton';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';
import { COMMON } from '../../utils/common';

export default function PostDetails() {
  const route = useRoute();
  const styles = useThemeStyles();
  const dispatch = useAppDispatch();
  const { postId } = route.params as { postId: string };

  const { postDetails } = PostSelectors();

  useEffect(() => {
    dispatch(getPostDetails({ postId }));
  }, [dispatch, postId]);

  const onPressLike = async () => {
    try {
      const postID = postDetails?.id.toString();

      if (postDetails?.is_like) {
        await unlikePost(postID);

        dispatch(
          updateLikeState({
            id: postDetails.id,
            is_like: false,
            likes_count: Math.max(postDetails.likes_count - 1, 0),
          }),
        );
      } else {
        const response = await likePost(postID);
        const updatedPost = response.data.post;

        dispatch(
          updateLikeState({
            id: updatedPost.id,
            is_like: true,
            likes_count: updatedPost.likes_count,
          }),
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderContent = () => {
    if (postDetails?.content_type === 'video') {
      return (
        <Video
          source={{ uri: postDetails?.video_url }}
          style={styles.feedImage}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
      );
    } else if (
      postDetails?.content_type === 'photo' &&
      postDetails?.image_url
    ) {
      return (
        <Image
          source={{ uri: postDetails?.image_url }}
          style={styles.feedImage}
        />
      );
    } else {
      return null;
    }
  };

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
              source={{ uri: 'https://picsum.photos/200/300' }}
              style={styles.feedUserAvatar}
            />
            <Text style={styles.textDefaultSmall}>{postDetails?.username}</Text>
          </View>
          <Text style={styles.textDefaultLarge}>{postDetails?.title}</Text>
          <View style={[styles.separatorLine, styles.mv4]} />
          <View style={styles.mb4}>
            <Text style={[styles.textDefaultSmall, styles.fontWeigthMedium]}>
              {postDetails?.screen_name}
            </Text>
            <Text style={[styles.textDefaultSmall, styles.fontWeightLight]}>
              {COMMON.dateStr(postDetails?.created_at)}
            </Text>
          </View>
          <Text style={[styles.textSupportingSmall, styles.mb4]}>
            {postDetails?.text_body}
          </Text>
          {renderContent()}
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
              style={[styles.flexRow, styles.alignItemsCenter, styles.gap2]}
            >
              <TouchableOpacity onPress={onPressLike}>
                <FontAwesome6
                  name="heart"
                  iconStyle={postDetails?.is_like ? 'solid' : 'regular'}
                  size={20}
                  style={styles.textSupporting}
                />
              </TouchableOpacity>
              <Text style={styles.textSupportingSmall}>
                {postDetails?.likes_count}
              </Text>
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
                {postDetails?.likesCount}
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
