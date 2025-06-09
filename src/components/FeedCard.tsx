import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import IonIcon from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Share,
  Platform,
} from 'react-native';
import Video from 'react-native-video';

import { useThemeStyles } from '../theme/ThemeStylesProvider';

import ExpandableText from './ExpandableText';

type FeedCardProps = {
  feedDetails: {
    id: string;
    username: string;
    title?: string;
    content?: string;
    text_body: string;
    image_url: string;
    video_url?: string;
    likes: Array<string>;
    profile_image_url: string;
    createdAt: string;
    tweet_url: string;
    is_like: boolean;
    likes_count: number;
  };
  onPressLike?: () => void;
};

/**
 *
 * @param feedDetails - Details object for the feed
 */
export default function FeedCard({ feedDetails, onPressLike }: FeedCardProps) {
  const styles = useThemeStyles();

  // This will be integrated later when user authentication is added to the app. We'll check if the likes array includes the current logged-in user.
  const isLiked = feedDetails.is_like;

  // Check if the post has no media
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
            source={{ uri: feedDetails.profile_image_url }}
            style={styles.feedUserAvatar}
          />
          <Text style={styles.textDefaultSmall}>{feedDetails.username}</Text>
        </View>
        <TouchableOpacity>
          <FontAwesome6
            name="ellipsis"
            iconStyle="solid"
            size={20}
            style={styles.textDefault}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.textSupportingSmall} />
      <ExpandableText text={feedDetails.text_body} maxWords={30} />
      {!!feedDetails.video_url && !hasNoMedia ? (
        <TouchableWithoutFeedback>
          <Video
            source={{ uri: feedDetails.video_url }}
            style={styles.feedImage}
            resizeMode="cover"
            controls
          />
        </TouchableWithoutFeedback>
      ) : (
        !hasNoMedia && (
          <Image
            source={{ uri: feedDetails.image_url }}
            style={styles.feedImage}
          />
        )
      )}
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
          <TouchableOpacity onPress={onPressLike}>
            <FontAwesome6
              name="heart"
              iconStyle={isLiked ? 'solid' : 'regular'}
              size={20}
              style={styles.textSupporting}
            />
          </TouchableOpacity>
          <Text style={styles.textSupportingSmall}>
            {feedDetails.likes_count}
          </Text>
          <TouchableOpacity onPress={handleShare}>
            <IonIcon
              name="send-outline"
              size={20}
              style={[styles.textSupporting, styles.ml2]}
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
  );
}
