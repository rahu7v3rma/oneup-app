import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import { PostDetails } from '../api/types';
import { AccountApiClient } from '../api/utils/api-client';
import ApiRequest from '../api/utils/api-request';
import { RootState } from '../store';

export interface PostState {
  loading: boolean;
  postDetails: PostDetails | null;
}

const initialState: PostState = {
  loading: false,
  postDetails: null,
};

const request = ApiRequest(AccountApiClient);

export const getPostDetails = createAsyncThunk(
  'post/details',
  async (options: { postId: string }, { rejectWithValue }) => {
    try {
      const response = await request.get<{ data: PostDetails }>(
        `/post/${options.postId}`,
      );
      return response.data;
    } catch (err) {
      console.error('Error fetching post details:', err);
      return rejectWithValue(err);
    }
  },
);

interface UpdateLikeStatePayload {
  id: number;
  is_like: boolean;
  likes_count: number;
  reaction_type?: string | null;
  user_email: string;
  emoji_counts?: Record<string, number>;
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPostDetails(state) {
      state.postDetails = null;
    },
    updateLikeState(state, action: PayloadAction<UpdateLikeStatePayload>) {
      if (state.postDetails && state.postDetails.id === action.payload.id) {
        state.postDetails.is_like = action.payload.is_like;
        state.postDetails.likes_count = action.payload.likes_count;
        state.postDetails.reaction_type =
          action.payload.reaction_type || undefined;

        // Update emoji_counts with the new counts from the payload
        if (action.payload.emoji_counts) {
          state.postDetails.emoji_counts = action.payload.emoji_counts;
        }

        // Update likes array to reflect the change
        if (state.postDetails.likes) {
          const userLikeIndex = state.postDetails.likes.findIndex(
            (like) => like.user.email === action.payload.user_email,
          );

          if (userLikeIndex !== -1) {
            // Remove existing reaction
            state.postDetails.likes.splice(userLikeIndex, 1);
          }

          if (action.payload.is_like && action.payload.reaction_type) {
            // Add new reaction
            state.postDetails.likes.push({
              user: { email: action.payload.user_email },
              reaction_type: action.payload.reaction_type,
              created_at: new Date().toISOString(),
              id: 0, // need to check
            });
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPostDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPostDetails.fulfilled, (state, action) => {
      state.postDetails = action.payload;
      state.loading = false;
    });
    builder.addCase(getPostDetails.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(PURGE, () => initialState);
  },
});

export default postSlice.reducer;

interface PostSelectorsType {
  loading: boolean;
  postDetails: PostDetails | null;
}

export const PostSelectors = (): PostSelectorsType => {
  const loading = useSelector((state: RootState) => state.post!.loading);
  const postDetails = useSelector(
    (state: RootState) => state.post!.postDetails,
  );

  return {
    loading,
    postDetails,
  };
};

export const { updateLikeState, clearPostDetails } = postSlice.actions;
