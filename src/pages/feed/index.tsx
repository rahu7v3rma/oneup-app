import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import { fetchPosts, likePost, unlikePost } from '../../api/posts';
import { Post } from '../../api/types';
import FeedCard from '../../components/FeedCard';
import TopProfileBar from '../../components/TopProfileBar';
import { PostSelectors } from '../../reducers/post';
import { useThemeStyles } from '../../theme/ThemeStylesProvider';

export default function FeedsPage({ navigation }) {
  const [feedData, setFeedData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const limit = 10;

  const themeStyles = useThemeStyles();
  const { postDetails } = PostSelectors();

  const isFocused = useIsFocused();

  const loadPosts = async (currentPage: number) => {
    try {
      setLoading(true);
      const data = await fetchPosts(currentPage, limit);
      setFeedData((prevData) => [...prevData, ...data.data.posts]); // Append new posts to existing data
      setHasNextPage(data.data.has_next); // Update whether more pages are available
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused && postDetails) {
      setFeedData((prevData) =>
        prevData.map((post) =>
          post.id === postDetails.id
            ? {
                ...post,
                is_like: postDetails.is_like,
                likes_count: postDetails.likes_count,
              }
            : post,
        ),
      );
    }
  }, [isFocused, postDetails]);

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment the page number
    }
  };

  if (loading && page === 1) {
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
  if (error) {
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
    <View style={[themeStyles.flex1, themeStyles.appBG]}>
      <TopProfileBar label="Discover" showSearchIcon={false} />
      <FlatList
        data={feedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={themeStyles.mv2}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PostDetails', { postId: item.id })
              }
            >
              <FeedCard
                feedDetails={item}
                onPressLike={async () => {
                  const isLiked = item.is_like;
                  const postId = item.id.toString();
                  try {
                    if (isLiked) {
                      await unlikePost(postId);
                      setFeedData((prevData) =>
                        prevData.map((post) =>
                          post.id === item.id
                            ? {
                                ...post,
                                is_like: false,
                                likes_count:
                                  post.likes_count > 0
                                    ? post.likes_count - 1
                                    : 0,
                                likes: post.likes.slice(
                                  0,
                                  post.likes.length - 1,
                                ),
                              }
                            : post,
                        ),
                      );
                    } else {
                      const response = await likePost(postId);
                      const updatedPost = response.data.post;

                      setFeedData((prevData) =>
                        prevData.map((post) =>
                          post.id === item.id
                            ? { ...post, ...updatedPost }
                            : post,
                        ),
                      );
                    }
                  } catch (err) {
                    console.error('Error toggling like:', err);
                  }
                }}
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
    </View>
  );
}
