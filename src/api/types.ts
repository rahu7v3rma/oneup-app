export interface PostUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Post {
  id: number;
  bookmarks: string[];
  likes: PostUser[];
  api_id: string;
  tweet_id: number;
  tweet_url: string;
  published_timestamp: string;
  profile_image_url: string | null;
  text_body: string;
  username: string;
  content_type: string;
  video_url: string | null;
  image_url: string | null;
  screen_name: string;
  aspect_ratio: string;
  duration_ms: number;
  sport: string;
  created_at: string;
}

export interface FetchPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    total: number;
    page: number;
    has_next: boolean;
  };
}

export interface Like {
  id: number;
  post: Post;
  user: PostUser;
  created_at: string;
}

export interface LikePostResponse {
  success: boolean;
  message: string;
  data: Like;
}

export interface UnlikePostResponse {
  success: boolean;
  message: string;
}
