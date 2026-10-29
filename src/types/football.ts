export interface FootballTeam {
  name: string;
  shortName: string;
  score: number;
  primaryColor: string;
  secondaryColor: string;
  accentGlow: string;
  logo?: string;
  yellowCards: number;
  redCards: number;
}

export interface FootballGoalEvent {
  id: string;
  team: 1 | 2;
  playerName: string;
  minute: number;
  extraMinute?: number;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

export type FootballPeriod = '1H' | 'HT' | '2H' | 'ET1' | 'ET2' | 'PEN' | 'FT';

export interface FootballTimeState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  stoppageTime: number; // e.g. 0, 2, 4
  period: FootballPeriod;
}

export interface FootballAnimation {
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'VAR' | 'SUBSTITUTION' | null;
  team: 1 | 2;
  teamName: string;
  playerName?: string;
  timestamp: number;
}

export interface FootballScoreboardConfig {
  position: 'top-left' | 'top-center' | 'top-right';
  offsetX: number; // in pixels for 1920x1080 canvas
  offsetY: number; // in pixels for 1920x1080 canvas
  scale: number; // e.g. 1.0 (100%), 0.9, 1.1
  showLogos: boolean;
  showCards: boolean;
  showPeriodBadge: boolean;
  soundEnabled: boolean;
}

export type PenaltyKickResult = 'goal' | 'miss' | 'pending';

export interface PenaltyShootoutState {
  isActive: boolean;
  team1Kicks: PenaltyKickResult[];
  team2Kicks: PenaltyKickResult[];
  team1Score: number;
  team2Score: number;
  currentTurn: {
    team: 1 | 2;
    kickIndex: number;
  };
  winner: 1 | 2 | null;
}

export interface FootballMatch {
  id: string;
  title: string;
  venue?: string;
  team1: FootballTeam;
  team2: FootballTeam;
  time: FootballTimeState;
  goals: FootballGoalEvent[];
  activeAnimation: FootballAnimation | null;
  penalties?: PenaltyShootoutState;
  config: FootballScoreboardConfig;
  updatedAt: number;
}
