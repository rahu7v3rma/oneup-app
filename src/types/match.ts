export interface Team {
  name: string;
  shortName: string;
  logo: string;
  score: number;
  record: string;
  hasPossession: boolean;
  GameOver: boolean;
  hasNotPlayed: boolean;
}

export interface Match {
  homeTeam: Team;
  awayTeam: Team;
  quarter: string;
  timeRemaining: string;
  network: string;
  downAndDistance: string;
  finalOut: boolean;
}

export interface GameTeam {
  id: number;
  name: string;
  logo?: any;
  record?: string;
  points: number[];
}

export interface UpcomingGame {
  id: number;
  users: number;
  wagers: number;
  datetime: Date;
  teams: GameTeam[];
}

export interface GameChat {
  id: number;
  team1Logo: any;
  team2Logo: any;
  title: string;
  activeWagers: string;
  lastMessage: string;
  timeAgo: string;
  unreadMessages: number | null;
  team1?: string;
  team2?: string;
}

//added these types to fetch event details using reducers
export interface FetchSportsEventDetails {
  success: boolean;
  message: string;
  status: number;
  data: SportsEventDetails;
}

export interface SportsEventDetails {
  id: number;
  scores: [
    {
      id: number;
      score_id: number;
      api_event_id: number;
      home_team_score: number;
      away_team_score: number;
      home_score_quarter1: number;
      home_score_quarter2: number;
      home_score_quarter3: number;
      home_score_quarter4: number;
      home_score_overtime: number;
      away_score_quarter1: number;
      away_score_quarter2: number;
      away_score_quarter3: number;
      away_score_quarter4: number;
      away_score_overtime: number;
      has_started: boolean;
      is_in_progress: boolean;
      is_over: boolean;
      has_1st_quarter_started: boolean;
      has_2nd_quarter_started: boolean;
      has_3rd_quarter_started: boolean;
      has_4th_quarter_started: boolean;
      point_spread_away_team_moneyline: number;
      point_spread_home_team_moneyline: number;
      event: number;
    },
  ];
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

export interface SportsTeamDetails {
  id: number;
  api_team_id: number;
  short_name: string;
  full_name: string;
  logo_url: string;
  conference: string;
  type: string;
  score?: number;
  record?: { A: number; B: number };
}

export interface FetchSportsTeamDetails {
  success: boolean;
  message: string;
  status: number;
  data: SportsTeamDetails;
}

export interface ScoringPlayDetail {
  api_scoring_play_id: number;
  scoring_detail_id: number;
  scoring_type: string;
  length: number;
  player_game_id: number;
  player_id: number;
}

export interface ScoringPlay {
  api_score_id: number;
  scoring_play_id: number;
  score: number;
  sequence: number;
  team: string;
  quarter: string;
  time_remaining: string;
  play_description: string;
  away_score: number;
  home_score: number;
  details: ScoringPlayDetail[];
}

export interface ScoreDetails {
  id: number;
  event: SportsEventDetails;
  scoring_plays: ScoringPlay[];
  score_id: number;
  api_event_id: number;
  home_team_score: number;
  away_team_score: number;
  home_score_quarter1: number;
  home_score_quarter2: number;
  home_score_quarter3: number;
  home_score_quarter4: number;
  home_score_overtime: number;
  away_score_quarter1: number;
  away_score_quarter2: number;
  away_score_quarter3: number;
  away_score_quarter4: number;
  away_score_overtime: number;
  has_started: boolean;
  is_in_progress: boolean;
  is_over: boolean;
  has_1st_quarter_started: boolean;
  has_2nd_quarter_started: boolean;
  has_3rd_quarter_started: boolean;
  has_4th_quarter_started: boolean;
  point_spread_away_team_moneyline: number;
  point_spread_home_team_moneyline: number;
  last_updated: string;
}

export interface FetchScoreDetails {
  success: boolean;
  message: string;
  status: number;
  data: ScoreDetails;
}
