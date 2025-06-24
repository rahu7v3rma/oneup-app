import { AccountApiClient } from '../api/utils/api-client';
import ApiRequest from '../api/utils/api-request';
import { COMMON } from '../utils/common';

import { ApiPostResponse, Post, PostDetails } from './types';

const request = ApiRequest(AccountApiClient);

/**
 * Fetches posts from the backend API.
 */
export const fetchPosts = async (
  page: number,
  limit: number,
): Promise<{ data: { posts: Post[]; has_next: boolean } }> => {
  try {
    const response = await request.get<ApiPostResponse>(
      `${COMMON.apiBaseUrl}post`,
      {
        params: { page, limit },
      },
    );
    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Reacts to a post with a specific emoji reaction type.
 */
export const reactToPost = async (
  postId: string,
  reactionType: string,
): Promise<{ data: { post: PostDetails } }> => {
  try {
    const response = await request.post<{ data: { post: PostDetails } }>(
      `${COMMON.apiBaseUrl}post/${postId}/like/`,
      { reaction_type: reactionType },
    );
    return response;
  } catch (error) {
    console.error('Error reacting to post:', error);
    throw error;
  }
};

/**
 * Removes reaction from a post.
 */
export const removeReaction = async (
  postId: string,
): Promise<{ data: { post: PostDetails } }> => {
  try {
    const response = await request.delete<{ data: { post: PostDetails } }>(
      `${COMMON.apiBaseUrl}post/${postId}/like/`,
    );
    return response;
  } catch (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const likePost = (postId: string) => reactToPost(postId, 'like');
export const unlikePost = removeReaction;
