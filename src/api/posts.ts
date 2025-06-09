import { AccountApiClient } from '../api/utils/api-client';
import ApiRequest from '../api/utils/api-request';
import { COMMON } from '../utils/common';

import {
  FetchPostsResponse,
  LikePostResponse,
  UnlikePostResponse,
} from './types';

const request = ApiRequest(AccountApiClient);

/**
 * Fetches posts from the backend API.
 *
 * @returns {Promise<FetchPostsResponse>} A promise that resolves to the list of posts.
 * @throws {Error} If the API request fails.
 */
export const fetchPosts = async (
  page: number,
  limit: number,
): Promise<FetchPostsResponse> => {
  try {
    const response = await request.get<FetchPostsResponse>(
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
 * Likes a post from the backend API.
 *
 * @returns {Promise<LikePostResponse>} A promise that resolves to the like object.
 * @throws {Error} If the API request fails.
 */
export const likePost = async (postId: string): Promise<LikePostResponse> => {
  try {
    const response = await request.post<LikePostResponse>(
      `${COMMON.apiBaseUrl}post/${postId}/like/`,
    );
    return response;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

/**
 * Unlikes a post from the backend API.
 *
 * @returns {Promise<UnlikePostResponse>} A promise that resolves to the unlike object.
 * @throws {Error} If the API request fails.
 */
export const unlikePost = async (
  postId: string,
): Promise<UnlikePostResponse> => {
  try {
    const response = await request.delete<UnlikePostResponse>(
      `${COMMON.apiBaseUrl}post/${postId}/like/`,
    );
    return response;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};
