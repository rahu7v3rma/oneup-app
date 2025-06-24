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
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updateLikeState(state, action: PayloadAction<UpdateLikeStatePayload>) {
      if (state.postDetails && state.postDetails.id === action.payload.id) {
        state.postDetails.is_like = action.payload.is_like;
        state.postDetails.likes_count = action.payload.likes_count;
        state.postDetails.reaction_type =
          action.payload.reaction_type || undefined;

        // Update emoji_counts if needed
        if (state.postDetails.emoji_counts) {
          const updatedCounts = { ...state.postDetails.emoji_counts };

          // If removing a reaction
          if (!action.payload.is_like && state.postDetails.reaction_type) {
            if (updatedCounts[state.postDetails.reaction_type]) {
              updatedCounts[state.postDetails.reaction_type] -= 1;
              if (updatedCounts[state.postDetails.reaction_type] <= 0) {
                delete updatedCounts[state.postDetails.reaction_type];
              }
            }
          }

          // If adding a new reaction
          if (action.payload.is_like && action.payload.reaction_type) {
            updatedCounts[action.payload.reaction_type] =
              (updatedCounts[action.payload.reaction_type] || 0) + 1;
          }

          state.postDetails.emoji_counts = updatedCounts;
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

export const { updateLikeState } = postSlice.actions;
