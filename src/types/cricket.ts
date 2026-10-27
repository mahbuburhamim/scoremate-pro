export type BallType = 'normal' | 'wide' | 'noBall' | 'bye' | 'legBye' | 'wicket';

export interface BallRecord {
  id: string;
  inningNumber: 1 | 2;
  overIndex: number;
  ballNumberInOver: number; // 1 to 6 (only legal balls advance this)
  runsOffBat: number;
  extraRuns: number;
  extraType?: 'wide' | 'noBall' | 'bye' | 'legBye';
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runOut' | 'stumped' | 'hitWicket' | 'retired';
  outPlayerId?: string;
  fielderName?: string;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  displayCode: string; // e.g. "0", "1", "4", "6", "W", "1wd", "1nb"
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  shortName?: string;
  role: 'batsman' | 'bowler' | 'allRounder' | 'wicketKeeper';
  photoUrl?: string; // base64 or URL
  // Batting stats in this match
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalInfo?: string;
  // Bowling stats in this match
  oversBowled: number; // e.g. 3.2
  ballsBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  widesConceded: number;
  noBallsConceded: number;
  // Tournament overall stats (for popup cards)
  tourMatches?: number;
  tourRuns?: number;
  tour4s?: number;
  tour6s?: number;
  tourBest?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  primaryColor: string; // Hex color e.g. "#1e40af"
  secondaryColor: string; // Hex color e.g. "#0284c7"
  players: Player[];
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  overs: string;
  playerOutName: string;
}

export interface Inning {
  inningNumber: 1 | 2;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  wickets: number;
  legalBalls: number; // count of legal deliveries
  oversDisplay: string; // e.g. "1.4"
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  currentStrikerId: string;
  currentNonStrikerId: string;
  currentBowlerId: string;
  currentOverBalls: BallRecord[];
  allBalls: BallRecord[];
  fow: FallOfWicket[];
  isCompleted: boolean;
}

export type DisplayMode =
  | 'DEFAULT'
  | '1 BAT'
  | '1 BALL'
  | '1BAT'
  | '2BAT'
  | '1BALL'
  | 'SUMMARY'
  | 'FOW'
  | 'B1'
  | 'B2'
  | 'BOWLER'
  | 'TARGET'
  | 'PARTNERSHIP'
  | 'TEAMS PLAYERS'
  | 'SCORE'
  | 'POINTS TABLE'
  | 'TOP BATTERS'
  | 'TOP BOWLERS'
  | 'TOP 4/6 STRIKERS'
  | 'TOP PLAYER OF SERIES';

export type UmpireDecision = 'NONE' | 'PENDING' | 'OUT' | 'NOT OUT';

export type OverlayTheme = 'cricpic' | 'asiacup' | 'cwc23' | 'iplneon' | 'special2023';

export interface AnimationTrigger {
  id: string;
  type: 'FOUR' | 'SIX' | 'WICKET' | 'FREE HIT' | 'NO BALL' | 'WIDE' | 'HAT-TRICK BALL' | 'TOUR BOUNDARIES' | 'CUSTOM';
  customText?: string;
  timestamp: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  matchNo: string; // e.g. "Match 14"
  matchType: 'Group Stage' | 'Knockout' | 'Semi Final' | 'Final';
  overs: number; // e.g. 20
  ballsPerOver: number; // usually 6
  team1: Team;
  team2: Team;
  tossWonByTeamId: string;
  tossDecision: 'bat' | 'bowl';
  activeInningNumber: 1 | 2;
  innings: [Inning, Inning];
  displayMode: DisplayMode;
  umpireDecision: UmpireDecision;
  activeAnimation: AnimationTrigger | null;
  targetRuns?: number;
  powerplayActive?: boolean;
  status: 'upcoming' | 'live' | 'completed';
  venue?: string;
  updatedAt: number;
}

export interface Tournament {
  id: string;
  name: string;
  location: string;
  startDate: string;
  teams: Team[];
  matches: string[]; // match IDs
  createdAt: number;
}

export interface LeaderboardItem {
  id: string;
  playerName: string;
  teamName: string;
  teamShort: string;
  value: string | number;
  subValue?: string;
  avatarUrl?: string;
}
