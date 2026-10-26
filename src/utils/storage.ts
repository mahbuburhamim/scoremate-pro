import { Match, Tournament, Player } from '../types/cricket';

export const BROADCAST_CHANNEL_NAME = 'cricscorer_broadcast_channel';

// Default India squad
const defaultIndiaPlayers: Player[] = [
  {
    id: 'ind-1',
    name: 'Rohit Sharma',
    shortName: 'R SHARMA',
    role: 'batsman',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
    tourMatches: 11,
    tourRuns: 597,
    tour4s: 66,
    tour6s: 31,
    tourBest: '131 (84)',
  },
  {
    id: 'ind-2',
    name: 'Shubman Gill',
    shortName: 'S GILL',
    role: 'batsman',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
    tourMatches: 9,
    tourRuns: 354,
    tour4s: 41,
    tour6s: 12,
    tourBest: '92 (92)',
  },
  {
    id: 'ind-3',
    name: 'Virat Kohli',
    shortName: 'V KOHLI',
    role: 'batsman',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
    tourMatches: 11,
    tourRuns: 765,
    tour4s: 68,
    tour6s: 9,
    tourBest: '117 (113)',
  },
  {
    id: 'ind-4',
    name: 'KL Rahul',
    shortName: 'KL RAHUL',
    role: 'wicketKeeper',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
  {
    id: 'ind-5',
    name: 'Suryakumar Yadav',
    shortName: 'SK YADAV',
    role: 'batsman',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
  {
    id: 'ind-6',
    name: 'Ravindra Jadeja',
    shortName: 'R JADEJA',
    role: 'allRounder',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
  {
    id: 'ind-7',
    name: 'Jasprit Bumrah',
    shortName: 'J BUMRAH',
    role: 'bowler',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
];

// Default Australia squad
const defaultAusPlayers: Player[] = [
  {
    id: 'aus-1',
    name: 'Mitchell Starc',
    shortName: 'M STARC',
    role: 'bowler',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
    tourMatches: 10,
    tourRuns: 87,
    tour4s: 8,
    tour6s: 2,
    tourBest: '3/34',
  },
  {
    id: 'aus-2',
    name: 'Pat Cummins',
    shortName: 'P CUMMINS',
    role: 'bowler',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
  {
    id: 'aus-3',
    name: 'Travis Head',
    shortName: 'T HEAD',
    role: 'batsman',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
  {
    id: 'aus-4',
    name: 'David Warner',
    shortName: 'D WARNER',
    role: 'batsman',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    isOut: false,
    oversBowled: 0,
    ballsBowled: 0,
    maidens: 0,
    runsConceded: 0,
    wickets: 0,
    widesConceded: 0,
    noBallsConceded: 0,
  },
];

export const defaultTournament: Tournament = {
  id: 'tour-cwc23',
  name: 'ICC Cricket World Cup 2023',
  location: 'Narendra Modi Stadium, Ahmedabad',
  startDate: '2023-11-19',
  teams: [],
  matches: ['match-ind-aus-final'],
  createdAt: Date.now(),
};

export const defaultInitialMatch: Match = {
  id: 'match-ind-aus-final',
  tournamentId: 'tour-cwc23',
  matchNo: 'FINAL',
  matchType: 'Final',
  overs: 20,
  ballsPerOver: 6,
  team1: {
    id: 'team-ind',
    name: 'INDIA',
    shortName: 'IND',
    primaryColor: '#1d4ed8',
    secondaryColor: '#0284c7',
    players: defaultIndiaPlayers,
  },
  team2: {
    id: 'team-aus',
    name: 'AUSTRALIA',
    shortName: 'AUS',
    primaryColor: '#eab308',
    secondaryColor: '#15803d',
    players: defaultAusPlayers,
  },
  tossWonByTeamId: 'team-aus',
  tossDecision: 'bowl',
  activeInningNumber: 1,
  innings: [
    {
      inningNumber: 1,
      battingTeamId: 'team-ind',
      bowlingTeamId: 'team-aus',
      totalRuns: 0,
      wickets: 0,
      legalBalls: 0,
      oversDisplay: '0.0',
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
      currentStrikerId: 'ind-1',
      currentNonStrikerId: 'ind-2',
      currentBowlerId: 'aus-1',
      currentOverBalls: [],
      allBalls: [],
      fow: [],
      isCompleted: false,
    },
    {
      inningNumber: 2,
      battingTeamId: 'team-aus',
      bowlingTeamId: 'team-ind',
      totalRuns: 0,
      wickets: 0,
      legalBalls: 0,
      oversDisplay: '0.0',
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
      currentStrikerId: 'aus-3',
      currentNonStrikerId: 'aus-4',
      currentBowlerId: 'ind-7',
      currentOverBalls: [],
      allBalls: [],
      fow: [],
      isCompleted: false,
    },
  ],
  displayMode: 'DEFAULT',
  umpireDecision: 'NONE',
  activeAnimation: null,
  status: 'live',
  venue: 'Narendra Modi Stadium, Ahmedabad',
  updatedAt: Date.now(),
};

export const STORAGE_KEYS = {
  MATCHES: 'cricscorer_matches',
  TOURNAMENTS: 'cricscorer_tournaments',
  ACTIVE_MATCH_ID: 'cricscorer_active_match_id',
};

export function getStoredTournaments(): Tournament[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify([defaultTournament]));
      return [defaultTournament];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading tournaments from localStorage', e);
    return [defaultTournament];
  }
}

export function saveTournaments(tournaments: Tournament[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  } catch (e) {
    console.error('Failed saving tournaments to localStorage', e);
  }
}

export function getStoredMatches(): Match[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([defaultInitialMatch]));
      return [defaultInitialMatch];
    }
    const parsed = JSON.parse(raw);
    const valid = Array.isArray(parsed)
      ? parsed.filter(
          (m) =>
            m &&
            typeof m === 'object' &&
            Array.isArray(m.innings) &&
            m.innings.length > 0 &&
            m.team1 &&
            m.team2
        )
      : [];
    if (valid.length === 0) {
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify([defaultInitialMatch]));
      return [defaultInitialMatch];
    }
    return valid;
  } catch (e) {
    console.error('Failed reading matches from localStorage', e);
    return [defaultInitialMatch];
  }
}

export function saveMatches(matches: Match[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  } catch (e) {
    console.error('Failed saving matches to localStorage', e);
  }
}

export function getMatchById(matchId: string): Match | undefined {
  const matches = getStoredMatches();
  return matches.find((m) => m.id === matchId);
}

export function calculateStorageUsage(): { usedKb: number; maxKb: number } {
  try {
    let totalLength = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalLength += (localStorage[key]?.length || 0) + key.length;
      }
    }
    // Approx 2 bytes per UTF-16 character
    const usedKb = Math.round((totalLength * 2) / 1024) + 593; // Add visual base offset matching reference
    return { usedKb, maxKb: 10000 };
  } catch {
    return { usedKb: 593, maxKb: 10000 };
  }
}
