import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import { AccountApiClient } from '../api/utils/api-client';
import ApiRequest from '../api/utils/api-request';
import { RootState } from '../store';
import { PostDetails } from '../types/post';

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
      const response = await request.get<PostDetails>(
        `${process.env.API_BASE_URL || ''}/post/${options.postId}`,
      );
      return response.data;
    } catch (err) {
      console.error('Error fetching post details:', err);
      return rejectWithValue(err);
    }
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updateLikeState(state, action) {
      if (state.postDetails.id === action.payload.id) {
        state.postDetails.is_like = action.payload.is_like;
        state.postDetails.likes_count = action.payload.likes_count;
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
  const loading = useSelector((state: RootState) => state.post.loading);
  const postDetails = useSelector((state: RootState) => state.post.postDetails);

  return {
    loading,
    postDetails,
  };
};

export const { updateLikeState } = postSlice.actions;
