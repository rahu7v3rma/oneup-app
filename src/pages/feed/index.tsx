import { GradientBackground } from '@components/GradientBackground';
import { useIsFocused } from '@react-navigation/native';
import Spacer from '@shared/Spacer';
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  AppState,
  ViewToken,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { fetchPosts } from '../../api/posts';
import { Post } from '../../api/types';
import { AuthContext } from '../../context/authContext';
import { PostSelectors } from '../../reducers/post';
import FeedCard from '../../shared/FeedCard';
import FeedHeader from '../../shared/FeedHeader';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

type OnViewableItemsChangedInfo = {
  viewableItems: ViewToken[];
  changed: ViewToken[];
};

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

type FeedsPageProps = {
  navigation: NavigationProp;
};

export default function FeedsPage({ navigation }: FeedsPageProps) {
  const { user } = useContext(AuthContext);
  const [feedData, setFeedData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFetching = useRef(false);
  const isRefreshing = useRef(false);
  const limit = 10;

  const [playingId, setPlayingId] = useState<string | null>(null);
  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 80,
    minimumViewTime: 250,
  });

  const onViewableItemsChanged = useRef<
    (info: OnViewableItemsChangedInfo) => void
  >(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const topmost = viewableItems
        .filter((v: ViewToken) => v.index != null)
        .sort((a: ViewToken, b: ViewToken) => a.index! - b.index!)[0];
      setPlayingId(topmost.item.id);
    } else {
      setPlayingId(null);
    }
  });

  const themeStyles = useThemeStyles();
  const { postDetails } = PostSelectors();
  const isFocused = useIsFocused();

  const loadPosts = async (currentPage: number) => {
    try {
      if (!isRefreshing.current) {
        setLoading(true);
      }

      const response = await fetchPosts(currentPage, limit);

      if (isRefreshing.current) {
        setFeedData(response.data.posts);
      } else {
        setFeedData((prevData) => [...prevData, ...response.data.posts]);
      }

      setHasNextPage(response.data.has_next);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetching.current = false;
      isRefreshing.current = false;
    }
  };

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    isRefreshing.current = true;
    setPage(1);
    setError(null);
    await loadPosts(1);
  };

  // Update feed data when post details change
  useEffect(() => {
    if (isFocused && postDetails) {
      setFeedData((prevData: Post[]) =>
        prevData.map((post) => {
          if (post.id === postDetails.id) {
            // Update likes array and emoji counts
            const updatedLikes = postDetails.likes || post.likes || [];
            const updatedEmojiCounts = updatedLikes.reduce(
              (acc, like) => {
                acc[like.reaction_type] = (acc[like.reaction_type] || 0) + 1;
                return acc;
              },
              {} as Record<string, number>,
            );

            return {
              ...post,
              is_like: !!updatedLikes.find(
                (like) => like.user.email === user.email,
              ),
              likes_count: updatedLikes.length,
              reaction_type: updatedLikes.find(
                (like) => like.user.email === user.email,
              )?.reaction_type,
              emoji_counts: updatedEmojiCounts,
              likes: updatedLikes,
            };
          }
          return post;
        }),
      );
    }
  }, [isFocused, postDetails, user?.email]);

  useEffect(() => {
    if (!isRefreshing.current) {
      loadPosts(page);
    }
  }, [page]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setPlayingId(null);
      }
    });
    return () => sub.remove();
  }, []);

  const handleLoadMore = () => {
    if (hasNextPage && !loading && !isFetching.current && !refreshing) {
      isFetching.current = true;
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1 && !refreshing) {
    return (
      <View
        style={[
          themeStyles.flex1,
          themeStyles.appBG,
          themeStyles.justifyContentCenter,
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View
        style={[
          themeStyles.flex1,
          themeStyles.appBG,
          themeStyles.justifyContentCenter,
        ]}
      >
        <Text
          style={[themeStyles.textDefault, themeStyles.justifyContentCenter]}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <GradientBackground>
      <Spacer multiplier={1.06} />
      <FeedHeader label="Feed" />
      <View style={styles.container}>
        <FlatList
          data={feedData}
          keyExtractor={(item) => item.id.toString()}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewableItemsChanged.current}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <View style={themeStyles.mv2}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('PostDetails', { postId: item.id })
                }
              >
                <FeedCard
                  feedDetails={item}
                  onPressLike={(isLiked, reactionType, reactionData) => {
                    setFeedData((prevData: Post[]) =>
                      prevData.map((post) => {
                        if (post.id === item.id) {
                          let updatedLikes = [...(post.likes || [])];
                          const userReactionIndex = updatedLikes.findIndex(
                            (like) => like.user.email === user?.email,
                          );

                          if (isLiked && reactionType && reactionData) {
                            if (userReactionIndex !== -1) {
                              updatedLikes[userReactionIndex] = reactionData;
                            } else {
                              updatedLikes.push(reactionData);
                            }
                          } else {
                            if (userReactionIndex !== -1) {
                              updatedLikes.splice(userReactionIndex, 1);
                            }
                          }

                          const updatedEmojiCounts = updatedLikes.reduce(
                            (acc, like) => {
                              acc[like.reaction_type] =
                                (acc[like.reaction_type] || 0) + 1;
                              return acc;
                            },
                            {} as Record<string, number>,
                          );

                          return {
                            ...post,
                            is_like: isLiked,
                            reaction_type: reactionType || undefined,
                            likes: updatedLikes,
                            likes_count: updatedLikes.length,
                            emoji_counts: updatedEmojiCounts,
                          };
                        }
                        return post;
                      }),
                    );
                  }}
                  isPlaying={isFocused && item.id.toString() === playingId}
                />
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          style={themeStyles.ph4}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && hasNextPage ? (
              <ActivityIndicator size="small" style={themeStyles.mv2} />
            ) : null
          }
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          style={styles.bottomFade}
          pointerEvents="none"
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
});
