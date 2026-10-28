import { Match, Tournament, Player } from '../types/cricket';

export const BROADCAST_CHANNEL_NAME = 'cricscorer_broadcast_channel';

// Default Bangladesh squad
const defaultBangladeshPlayers: Player[] = [
  {
    id: 'ban-1',
    name: 'T. Tamim',
    shortName: 'T TAMIM',
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
    tourMatches: 8,
    tourRuns: 348,
    tour4s: 38,
    tour6s: 14,
    tourBest: '68 (42)',
  },
  {
    id: 'ban-2',
    name: 'N. Shanto',
    shortName: 'N SHANTO',
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
    tourMatches: 8,
    tourRuns: 274,
    tour4s: 26,
    tour6s: 8,
    tourBest: '54 (32)',
  },
  {
    id: 'ban-3',
    name: 'Litton Das',
    shortName: 'L DAS',
    role: 'wicketKeeper',
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
  },
  {
    id: 'ban-4',
    name: 'Shakib Al Hasan',
    shortName: 'SHAKIB',
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
    id: 'ban-5',
    name: 'Towhid Hridoy',
    shortName: 'T HRIDOY',
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
    id: 'ban-6',
    name: 'Mahmudullah',
    shortName: 'MAHMUDULLAH',
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
    id: 'ban-7',
    name: 'Jaker Ali',
    shortName: 'JAKER',
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
    id: 'ban-8',
    name: 'Rishad Hossain',
    shortName: 'RISHAD',
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
    id: 'ban-9',
    name: 'Taskin Ahmed',
    shortName: 'TASKIN',
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
  {
    id: 'ban-10',
    name: 'Mustafizur Rahman',
    shortName: 'MUSTAFIZ',
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
  {
    id: 'ban-11',
    name: 'Shoriful Islam',
    shortName: 'SHORIFUL',
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

// Default England squad
const defaultEnglandPlayers: Player[] = [
  {
    id: 'eng-1',
    name: 'A. Rashid',
    shortName: 'A RASHID',
    role: 'bowler',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
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
    tourMatches: 8,
    tourRuns: 12,
    tour4s: 1,
    tour6s: 0,
    tourBest: '3/19',
  },
  {
    id: 'eng-2',
    name: 'H. Brook',
    shortName: 'H BROOK',
    role: 'batsman',
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
    tourMatches: 8,
    tourRuns: 284,
    tour4s: 29,
    tour6s: 11,
    tourBest: '87 (52)',
  },
  {
    id: 'eng-3',
    name: 'J. Buttler',
    shortName: 'J BUTTLER',
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
    id: 'eng-4',
    name: 'Phil Salt',
    shortName: 'P SALT',
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
    id: 'eng-5',
    name: 'Jonny Bairstow',
    shortName: 'J BAIRSTOW',
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
    id: 'eng-6',
    name: 'Moeen Ali',
    shortName: 'M ALI',
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
    id: 'eng-7',
    name: 'Liam Livingstone',
    shortName: 'L LIVINGSTONE',
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
    id: 'eng-7',
    name: 'Liam Livingstone',
    shortName: 'L LIVINGSTONE',
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
    id: 'eng-8',
    name: 'Sam Curran',
    shortName: 'S CURRAN',
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
    id: 'eng-9',
    name: 'Jofra Archer',
    shortName: 'J ARCHER',
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
  {
    id: 'eng-10',
    name: 'Mark Wood',
    shortName: 'M WOOD',
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
  {
    id: 'eng-11',
    name: 'Reece Topley',
    shortName: 'R TOPLEY',
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

export const defaultTournament: Tournament = {
  id: 'tour-t20-wc',
  name: "ICC Men's T20 World Cup",
  location: 'Kensington Oval, Barbados',
  startDate: '2024-06-20',
  teams: [],
  matches: ['match-ban-eng-t20'],
  createdAt: Date.now(),
};

export const defaultInitialMatch: Match = {
  id: 'match-ban-eng-t20',
  tournamentId: 'tour-t20-wc',
  matchNo: 'MATCH 28 • SUPER 8',
  matchType: 'Group Stage',
  overs: 20,
  ballsPerOver: 6,
  status: 'live',
  venue: 'Kensington Oval, Barbados',
  updatedAt: Date.now(),
  displayMode: 'DEFAULT',
  umpireDecision: 'NONE',
  activeAnimation: null,
  team1: {
    id: 'team-ban',
    name: 'BANGLADESH',
    shortName: 'BAN',
    primaryColor: '#006a4e',
    secondaryColor: '#f42a41',
    players: defaultBangladeshPlayers,
  },
  team2: {
    id: 'team-eng',
    name: 'ENGLAND',
    shortName: 'ENG',
    primaryColor: '#001f54',
    secondaryColor: '#cf142b',
    players: defaultEnglandPlayers,
  },
  tossWonByTeamId: 'team-ban',
  tossDecision: 'bat',
  activeInningNumber: 1,
  innings: [
    {
      inningNumber: 1,
      battingTeamId: 'team-ban',
      bowlingTeamId: 'team-eng',
      totalRuns: 0,
      wickets: 0,
      legalBalls: 0,
      oversDisplay: '0.0',
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
      currentStrikerId: 'ban-1',
      currentNonStrikerId: 'ban-2',
      currentBowlerId: 'eng-1',
      currentOverBalls: [],
      allBalls: [],
      fow: [],
      isCompleted: false,
    },
    {
      inningNumber: 2,
      battingTeamId: 'team-eng',
      bowlingTeamId: 'team-ban',
      totalRuns: 0,
      wickets: 0,
      legalBalls: 0,
      oversDisplay: '0.0',
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
      currentStrikerId: 'eng-2',
      currentNonStrikerId: 'eng-3',
      currentBowlerId: 'ban-9',
      currentOverBalls: [],
      allBalls: [],
      fow: [],
      isCompleted: false,
    },
  ],
};

export const STORAGE_KEYS = {
  MATCHES: 'cricscorer_matches',
  TOURNAMENTS: 'cricscorer_tournaments',
  ACTIVE_MATCH_ID: 'cricscorer_active_match_id',
};

export function getUserStorageKey(baseKey: string, userId?: string): string {
  if (!userId || userId === 'guest') {
    return `${baseKey}_default`;
  }
  return `${baseKey}_${userId}`;
}

export function createFreshInitialMatch(): Match {
  return {
    ...defaultInitialMatch,
    id: `match-${Date.now()}`,
    matchNo: 'MATCH 1 • LIVE',
    status: 'live',
    updatedAt: Date.now(),
  };
}

export function getStoredTournaments(userId?: string): Tournament[] {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.TOURNAMENTS, userId);
    const raw = localStorage.getItem(key) || (!userId || userId === 'guest' ? localStorage.getItem(STORAGE_KEYS.TOURNAMENTS) : null);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify([defaultTournament]));
      return [defaultTournament];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(key, JSON.stringify([defaultTournament]));
      return [defaultTournament];
    }
    return parsed;
  } catch (e) {
    console.error('Failed reading tournaments from localStorage', e);
    return [defaultTournament];
  }
}

export function saveTournaments(tournaments: Tournament[], userId?: string): void {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.TOURNAMENTS, userId);
    localStorage.setItem(key, JSON.stringify(tournaments));
  } catch (e) {
    console.error('Failed saving tournaments to localStorage', e);
  }
}

export function isStaleMockMatch(m: any): boolean {
  if (!m || typeof m !== 'object') return true;
  if (m.id === 'match-ind-aus-final' || m.id === 'demo-ban-eng') return true;
  // Detect stale mock data from prior versions (176 runs / 17.2 overs)
  if (m.innings?.[0]?.totalRuns === 176 && (m.innings?.[0]?.oversDisplay === '17.2' || m.innings?.[0]?.legalBalls === 104)) {
    return true;
  }
  return false;
}

export function getStoredMatches(userId?: string): Match[] {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.MATCHES, userId);
    
    // Clean up any stale legacy un-scoped storage key
    try {
      const legacyRaw = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (legacyRaw && (legacyRaw.includes('176') || legacyRaw.includes('demo-ban-eng'))) {
        localStorage.removeItem(STORAGE_KEYS.MATCHES);
      }
    } catch {}

    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = createFreshInitialMatch();
      localStorage.setItem(key, JSON.stringify([initial]));
      return [initial];
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
            m.team2 &&
            !isStaleMockMatch(m)
        )
      : [];

    if (valid.length === 0) {
      const initial = createFreshInitialMatch();
      localStorage.setItem(key, JSON.stringify([initial]));
      return [initial];
    }
    return valid;
  } catch (e) {
    console.error('Failed reading matches from localStorage', e);
    const initial = createFreshInitialMatch();
    return [initial];
  }
}

export function saveMatches(matches: Match[], userId?: string): void {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.MATCHES, userId);
    localStorage.setItem(key, JSON.stringify(matches));
  } catch (e) {
    console.error('Failed saving matches to localStorage', e);
  }
}

export function getStoredActiveMatchId(userId?: string): string | null {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.ACTIVE_MATCH_ID, userId);
    return localStorage.getItem(key) || (!userId || userId === 'guest' ? localStorage.getItem(STORAGE_KEYS.ACTIVE_MATCH_ID) : null);
  } catch {
    return null;
  }
}

export function saveActiveMatchId(id: string, userId?: string): void {
  try {
    const key = getUserStorageKey(STORAGE_KEYS.ACTIVE_MATCH_ID, userId);
    localStorage.setItem(key, id);
  } catch (e) {
    console.error('Failed saving activeMatchId to localStorage', e);
  }
}

export function calculateStorageUsage(): { usedKb: number; maxKb: number; percent: number } {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        total += ((localStorage.getItem(key) || '').length + key.length) * 2;
      }
    }
    const usedKb = Math.round(total / 1024);
    const maxKb = 5120;
    const percent = Math.min(100, Math.round((total / (5 * 1024 * 1024)) * 100));
    return { usedKb, maxKb, percent };
  } catch (e) {
    return { usedKb: 0, maxKb: 5120, percent: 0 };
  }
}

