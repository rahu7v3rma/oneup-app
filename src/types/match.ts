export interface Team {
  name: string;
  record: string;
  logo: any;
  score: string;
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
  logo: any;
  record: string;
  points: string[];
}

export interface UpcomingGame {
  id: number;
  users: number;
  wagers: number;
  datetime: string;
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
}
