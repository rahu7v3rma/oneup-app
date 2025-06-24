export interface PostUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PostLike {
  id: number;
  user: PostUser;
  reaction_type: string;
  created_at: string;
}

export interface Post {
  id: number;
  likes: PostLike[];
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
  likes_count: number;
  is_like: boolean;
  reaction_type?: string;
  emoji_counts?: Record<string, number>;
  bookmarks?: string[]; // Make optional if not always present
}

export interface PostDetails extends Post {
  // No need to redeclare properties already in Post
}

// Add API response types
export interface ApiPostResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    total: number;
    page: number;
    has_next: boolean;
  };
}

export interface ApiPostDetailsResponse {
  success: boolean;
  message: string;
  data: PostDetails;
}

// Sports endpoint responses
export interface FetchSportsResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: {
    list: T[];
    page: number;
    has_next: boolean;
    total: number;
  };
}

export interface SportsTeam {
  id: number;
  api_team_id: number;
  record?: string;
  short_name: string;
  full_name: string;
  logo_url: string;
  conference: string;
  type: string;
}

export interface SportsScore {
  id: number;
  home_team_score: number;
  away_team_score: number;
  event: number;
}

export interface SportsEvent {
  id: number;
  api_event_id: number;
  season_type: number;
  season: number;
  week: number;
  home_team: number;
  away_team: number;
  status: string;
  bet_point_spread: number;
  bet_over_under: number;
  bet_home_team_money_line: number;
  bet_away_team_money_line: number;
  start_at: string;
}

export interface SportsTimeframe {
  id: number;
  api_season_id: string;
  season_type: number;
  season: number;
  name: string;
  start_at: string;
  end_at: string;
}

export interface FetchUpcomingEventsResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: {
    list: T[];
    page: number;
    has_next: boolean;
    total: number;
  };
}

export interface UpcomingEvent {
  id: number;
  api_event_id: number;
  season_type: number;
  season: number;
  week: number;
  home_team: number;
  away_team: number;
  status: string;
  bet_point_spread: number;
  bet_over_under: number;
  bet_home_team_money_line: number;
  bet_away_team_money_line: number;
  start_at: string;
  active_users?: number;
  active_wagers?: number;
}
