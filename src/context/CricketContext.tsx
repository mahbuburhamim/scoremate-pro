import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Match,
  Tournament,
  Player,
  BallRecord,
  DisplayMode,
  UmpireDecision,
  AnimationTrigger,
  Team,
  FallOfWicket,
  Inning,
} from '../types/cricket';
import {
  BROADCAST_CHANNEL_NAME,
  getStoredMatches,
  saveMatches,
  getStoredTournaments,
  saveTournaments,
  defaultInitialMatch,
  createFreshInitialMatch,
  getStoredActiveMatchId,
  saveActiveMatchId,
  isStaleMockMatch,
} from '../utils/storage';
import { useAuth } from './AuthContext';
import { api, createThrottledSaver } from '../utils/api';

interface AddBallArgs {
  runs: number;
  isWide?: boolean;
  isNoBall?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
  isWicket?: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runOut' | 'stumped' | 'hitWicket' | 'retired';
  outPlayerId?: string;
  nextBatterId?: string;
}

interface CricketContextType {
  matches: Match[];
  tournaments: Tournament[];
  activeMatch: Match;
  undoStack: Match[];
  setActiveMatchId: (matchId: string) => void;
  addBall: (args: AddBallArgs) => void;
  undo: () => void;
  swapBatters: () => void;
  changeBowler: (newBowlerId: string) => void;
  changeStriker: (newStrikerId: string) => void;
  changeNonStriker: (newNonStrikerId: string) => void;
  retireBatter: (outPlayerId: string, nextBatterId?: string) => void;
  endInnings: () => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setUmpireDecision: (decision: UmpireDecision) => void;
  triggerAnimation: (type: AnimationTrigger['type'], customText?: string) => void;
  clearAnimation: () => void;
  updateTeamColors: (teamId: string, primaryColor: string, secondaryColor?: string) => void;
  updateTeamDetails: (teamId: string, updates: Partial<Team>) => void;
  addPlayersToTeam: (teamId: string, playerNames: string[]) => void;
  updatePlayer: (teamId: string, player: Player) => void;
  createTournament: (name: string, location: string) => Tournament;
  createMatch: (params: {
    tournamentId: string;
    team1Name: string;
    team2Name: string;
    overs: number;
    matchNo: string;
    tossWonBy: 'team1' | 'team2';
    optedTo: 'bat' | 'bowl';
    ballsPerOver?: number;
    matchType?: 'Group Stage' | 'Knockout' | 'Semi Final' | 'Final';
    team1LogoUrl?: string;
    team2LogoUrl?: string;
  }) => Match;
  deleteMatch: (matchId: string) => string;
  manualSyncPulse: () => void;
  isSyncing: boolean;
  applySyncMatches: (matches: Match[], activeId?: string) => void;
}

const CricketContext = createContext<CricketContextType | null>(null);

const isValidMatch = (m: any): m is Match => {
  return (
    m &&
    typeof m === 'object' &&
    Array.isArray(m.innings) &&
    m.innings.length > 0 &&
    m.team1 &&
    typeof m.team1 === 'object' &&
    m.team2 &&
    typeof m.team2 === 'object'
  );
};

export const CricketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, hasActiveSubscription } = useAuth();
  const currentUserId = user?.id || 'guest';
  // Only a logged-in, paid account may write to the server (the server enforces this too)
  const canSyncRef = useRef<boolean>(false);
  canSyncRef.current = !!user && hasActiveSubscription;
  const saverRef = useRef(createThrottledSaver('cricket', 300));
  const currentUserIdRef = useRef<string>(currentUserId);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const sanitizeMatches = useCallback((list: any[]): Match[] => {
    if (!Array.isArray(list)) return [createFreshInitialMatch()];
    let filtered = list.filter(isValidMatch).filter((m) => !isStaleMockMatch(m));
    if (filtered.length === 0) {
      filtered = [createFreshInitialMatch()];
    }
    return filtered;
  }, []);

  const [tournaments, setTournaments] = useState<Tournament[]>(() => getStoredTournaments(currentUserId));
  const [matches, setMatches] = useState<Match[]>(() => {
    const stored = getStoredMatches(currentUserId);
    const sanitized = stored.filter((m) => !isStaleMockMatch(m));
    return sanitized.length > 0 ? sanitized : [createFreshInitialMatch()];
  });
  const [activeMatchId, setActiveMatchIdState] = useState<string>(() => {
    const storedId = getStoredActiveMatchId(currentUserId);
    const list = getStoredMatches(currentUserId);
    const sanitized = list.filter((m) => !isStaleMockMatch(m));
    if (storedId && sanitized.some((m) => m.id === storedId)) {
      return storedId;
    }
    return sanitized[0]?.id || (list[0]?.id || defaultInitialMatch.id);
  });

  const matchesRef = useRef<Match[]>(matches);
  matchesRef.current = matches;

  const [undoStack, setUndoStack] = useState<Match[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const channelRef = useRef<BroadcastChannel | null>(null);

  // Active match getter with bulletproof fallback
  const rawMatch = matches.find((m) => m.id === activeMatchId) || matches.find(isValidMatch);
  const activeMatch = isValidMatch(rawMatch) ? rawMatch : (matches[0] || defaultInitialMatch);

  const activeMatchIdRef = useRef<string>(activeMatchId);
  const lastLocalActionTimestampRef = useRef<number>(Date.now());
  useEffect(() => {
    activeMatchIdRef.current = activeMatchId;
  }, [activeMatchId]);

  // Account switch effect: when user logs in, signs up, or logs out, reload their isolated matches & tournaments
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
    // Never let a previous account's unsent changes land in the new account
    saverRef.current.cancel();
    saverRef.current = createThrottledSaver('cricket', 300);
    const loadedTournaments = getStoredTournaments(currentUserId);
    const loadedMatches = getStoredMatches(currentUserId);
    const storedActive = getStoredActiveMatchId(currentUserId);
    const sanitized = loadedMatches.filter((m) => m.id !== 'match-ind-aus-final');
    const finalMatches = sanitized.length > 0 ? sanitized : [createFreshInitialMatch()];
    const validActive = (storedActive && finalMatches.some((m) => m.id === storedActive))
      ? storedActive
      : (finalMatches[0]?.id || defaultInitialMatch.id);

    setTournaments(loadedTournaments);
    setMatches(finalMatches);
    setActiveMatchIdState(validActive);
    activeMatchIdRef.current = validActive;
    setUndoStack([]);
  }, [currentUserId]);

  // Sync to channel, local server, and global cloud relay
  const syncMatchState = useCallback(
    (updatedMatches: Match[], triggerPulse = true, explicitActiveId?: string) => {
      lastLocalActionTimestampRef.current = Date.now();
      const validMatches = sanitizeMatches(updatedMatches);
      if (validMatches.length === 0) return;

      const uid = currentUserIdRef.current;
      const currentActiveId = explicitActiveId || activeMatchIdRef.current;
      if (explicitActiveId) {
        setActiveMatchIdState(explicitActiveId);
        saveActiveMatchId(explicitActiveId, uid);
        activeMatchIdRef.current = explicitActiveId;
      }

      setMatches(validMatches);
      saveMatches(validMatches, uid);

      if (triggerPulse) {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 800);
      }

      // 1. BroadcastChannel (same-browser tabs)
      if (channelRef.current) {
        try {
          channelRef.current.postMessage({
            type: 'MATCHES_SYNC',
            userId: uid,
            matches: validMatches,
            activeMatchId: currentActiveId,
            timestamp: Date.now(),
          });
        } catch (err) {
          console.warn('BroadcastChannel postMessage error', err);
        }
      }

      // 2. Account server (powers OBS overlays and other devices of this account)
      if (canSyncRef.current) {
        saverRef.current.save({ matches: validMatches, activeMatchId: currentActiveId });
      }
    },
    [sanitizeMatches]
  );

  const setActiveMatchId = useCallback(
    (id: string) => {
      const uid = currentUserIdRef.current;
      lastLocalActionTimestampRef.current = Date.now();
      setActiveMatchIdState(id);
      saveActiveMatchId(id, uid);
      activeMatchIdRef.current = id;

      if (channelRef.current) {
        try {
          channelRef.current.postMessage({
            type: 'ACTIVE_MATCH_CHANGE',
            userId: uid,
            activeMatchId: id,
            timestamp: Date.now(),
          });
        } catch (err) {
          console.warn('BroadcastChannel setActiveMatchId error', err);
        }
      }

      if (canSyncRef.current) {
        saverRef.current.save({ matches: matchesRef.current, activeMatchId: id });
      }
    },
    []
  );

  const applySyncMatches = useCallback(
    (newMatches: any[], newActiveId?: string, msgTimestamp?: number) => {
      if (!Array.isArray(newMatches) || newMatches.length === 0) return;
      if (msgTimestamp && msgTimestamp < lastLocalActionTimestampRef.current) {
        return; // Stale incoming sync - ignore to prevent overwriting local state
      }
      const sanitized = sanitizeMatches(newMatches);
      const uid = currentUserIdRef.current;

      setMatches((current) => {
        const isDifferent =
          sanitized.length !== current.length ||
          JSON.stringify(sanitized) !== JSON.stringify(current);

        if (isDifferent) {
          saveMatches(sanitized, uid);
          return sanitized;
        }
        return current;
      });

      if (newActiveId) {
        setActiveMatchIdState((currActiveId) => {
          if (currActiveId !== newActiveId && sanitized.some((m) => m.id === newActiveId)) {
            saveActiveMatchId(newActiveId, uid);
            activeMatchIdRef.current = newActiveId;
            return newActiveId;
          }
          return currActiveId;
        });
      }
    },
    [sanitizeMatches]
  );

  // Multi-channel Real-time Sync (Local SSE + Cloud SSE + High-speed Polling + BroadcastChannel + Storage)
  useEffect(() => {
    const uid = currentUserId;

    // 1. Load this account's saved state from the server, then keep other devices of the
    //    same account in step by polling. Guests stay local-only.
    let cancelled = false;
    let lastServerTs = 0;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const pullFromServer = async (initial: boolean) => {
      const res = await api.getState('cricket', initial ? 0 : lastServerTs);
      if (cancelled || !res.ok || res.status === 204) return;
      const payload = res.data;
      const serverData = payload?.data;
      if (payload?.updatedAt) lastServerTs = payload.updatedAt;
      if (serverData?.matches && Array.isArray(serverData.matches) && serverData.matches.length > 0) {
        // Don't overwrite the scorer's screen while they are actively tapping
        if (!initial && Date.now() - lastLocalActionTimestampRef.current < 3000) return;
        applySyncMatches(serverData.matches, serverData.activeMatchId);
      } else if (initial && canSyncRef.current) {
        // First login on this account: upload what this browser has
        saverRef.current.save({ matches: matchesRef.current, activeMatchId: activeMatchIdRef.current });
      }
    };

    if (uid !== 'guest') {
      pullFromServer(true);
      pollInterval = setInterval(() => pullFromServer(false), 2000);
    }

    // 5. BroadcastChannel for same-browser instant zero-latency sync
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'MATCHES_SYNC' && Array.isArray(event.data.matches)) {
          if (!event.data.userId || event.data.userId === uid) {
            applySyncMatches(event.data.matches, event.data.activeMatchId, event.data.timestamp);
          }
        } else if (event.data?.type === 'ACTIVE_MATCH_CHANGE' && event.data.activeMatchId) {
          if (!event.data.userId || event.data.userId === uid) {
            if (!event.data.timestamp || event.data.timestamp >= lastLocalActionTimestampRef.current) {
              setActiveMatchIdState(event.data.activeMatchId);
              saveActiveMatchId(event.data.activeMatchId, uid);
              activeMatchIdRef.current = event.data.activeMatchId;
            }
          }
        } else if (event.data?.type === 'ANIMATION_PULSE') {
          setIsSyncing(true);
          setTimeout(() => setIsSyncing(false), 600);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    // 6. Cross-tab storage listener
    const handleStorage = (e: StorageEvent) => {
      const expectedMatchesKey = `cricscorer_matches_${uid}`;
      const expectedActiveKey = `cricscorer_active_match_id_${uid}`;
      if ((e.key === expectedMatchesKey || (uid === 'guest' && e.key === 'cricscorer_matches')) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          applySyncMatches(parsed);
        } catch {}
      } else if ((e.key === expectedActiveKey || (uid === 'guest' && e.key === 'cricscorer_active_match_id')) && e.newValue) {
        setActiveMatchIdState(e.newValue);
        activeMatchIdRef.current = e.newValue;
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      cancelled = true;
      channelRef.current?.close();
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentUserId, applySyncMatches]);


  // Cricket Scoring Logic with precise ball-by-ball resolution
  const addBall = useCallback(
    ({
      runs,
      isWide = false,
      isNoBall = false,
      isBye = false,
      isLegBye = false,
      isWicket = false,
      wicketType = 'bowled',
      outPlayerId,
      nextBatterId,
    }: AddBallArgs) => {
      const currentMatch = activeMatch;
      // Push deep clone to undo stack (limit stack to 20 for memory)
      setUndoStack((prev) => [JSON.parse(JSON.stringify(currentMatch)), ...prev.slice(0, 19)]);

      const matchClone: Match = JSON.parse(JSON.stringify(currentMatch));
      const inx = matchClone.activeInningNumber - 1;
      const inning = matchClone.innings[inx];

      const battingTeam = matchClone.team1.id === inning.battingTeamId ? matchClone.team1 : matchClone.team2;
      const bowlingTeam = matchClone.team1.id === inning.bowlingTeamId ? matchClone.team1 : matchClone.team2;

      let striker = battingTeam.players.find((p) => p.id === inning.currentStrikerId);
      const nonStriker = battingTeam.players.find((p) => p.id === inning.currentNonStrikerId);
      const bowler = bowlingTeam.players.find((p) => p.id === inning.currentBowlerId);

      const isLegal = !isWide && !isNoBall;
      let runsOffBat = 0;
      let extraRuns = 0;
      let displayCode = `${runs}`;

      if (isWide) {
        extraRuns = 1 + runs;
        inning.extras.wides += extraRuns;
        inning.extras.total += extraRuns;
        inning.totalRuns += extraRuns;
        if (bowler) bowler.runsConceded += extraRuns;
        displayCode = runs > 0 ? `${runs}wd` : 'wd';
        if (isWicket) displayCode = 'W+wd';
      } else if (isNoBall) {
        extraRuns = 1;
        runsOffBat = runs;
        inning.extras.noBalls += 1;
        inning.extras.total += 1;
        inning.totalRuns += 1 + runs;
        if (bowler) {
          bowler.runsConceded += 1 + runs;
          bowler.noBallsConceded += 1;
        }
        if (striker) {
          striker.runs += runsOffBat;
          striker.balls += 1;
          if (runsOffBat === 4) striker.fours += 1;
          if (runsOffBat === 6) striker.sixes += 1;
        }
        displayCode = runs > 0 ? `${runs}nb` : 'nb';
      } else if (isBye || isLegBye) {
        extraRuns = runs;
        if (isBye) inning.extras.byes += runs;
        if (isLegBye) inning.extras.legByes += runs;
        inning.extras.total += runs;
        inning.totalRuns += runs;
        if (striker) striker.balls += 1;
        displayCode = isBye ? `${runs}b` : `${runs}lb`;
        if (isWicket) displayCode = 'W';
      } else {
        // Normal delivery
        runsOffBat = runs;
        inning.totalRuns += runs;
        if (striker) {
          striker.runs += runs;
          striker.balls += 1;
          if (runs === 4) striker.fours += 1;
          if (runs === 6) striker.sixes += 1;
        }
        if (bowler) {
          bowler.runsConceded += runs;
        }
        displayCode = isWicket ? 'W' : `${runs}`;
      }

      // Handle Wicket
      if (isWicket) {
        inning.wickets += 1;
        const actualOutId = outPlayerId || inning.currentStrikerId;
        const playerOut = battingTeam.players.find((p) => p.id === actualOutId);

        if (playerOut) {
          playerOut.isOut = true;
          playerOut.dismissalInfo = `${wicketType.toUpperCase()} b ${bowler?.shortName || bowler?.name || 'Bowler'}`;
        }

        if (bowler && wicketType !== 'runOut' && wicketType !== 'retired') {
          bowler.wickets += 1;
        }

        const newFow: FallOfWicket = {
          wicketNumber: inning.wickets,
          score: inning.totalRuns,
          overs: inning.oversDisplay,
          playerOutName: playerOut?.shortName || playerOut?.name || 'Batter',
        };
        inning.fow.push(newFow);

        // Replace out batter with next batter if provided
        if (nextBatterId) {
          if (actualOutId === inning.currentStrikerId) {
            inning.currentStrikerId = nextBatterId;
          } else {
            inning.currentNonStrikerId = nextBatterId;
          }
        }
      }

      // If legal delivery, increment balls
      if (isLegal) {
        inning.legalBalls += 1;
        if (bowler) {
          bowler.ballsBowled += 1;
          const completedOvers = Math.floor(bowler.ballsBowled / 6);
          const remBalls = bowler.ballsBowled % 6;
          bowler.oversBowled = Number(`${completedOvers}.${remBalls}`);
        }
      }

      // Calculate current over & ball number
      const overIndex = Math.floor((inning.legalBalls - (isLegal ? 1 : 0)) / 6);
      const ballNumberInOver = isLegal ? ((inning.legalBalls - 1) % 6) + 1 : inning.legalBalls % 6;

      const newBall: BallRecord = {
        id: `ball-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        inningNumber: matchClone.activeInningNumber,
        overIndex,
        ballNumberInOver,
        runsOffBat,
        extraRuns,
        extraType: isWide ? 'wide' : isNoBall ? 'noBall' : isBye ? 'bye' : isLegBye ? 'legBye' : undefined,
        isWicket,
        wicketType: isWicket ? wicketType : undefined,
        outPlayerId,
        strikerId: inning.currentStrikerId,
        nonStrikerId: inning.currentNonStrikerId,
        bowlerId: inning.currentBowlerId,
        displayCode,
        timestamp: Date.now(),
      };

      inning.allBalls.push(newBall);
      inning.currentOverBalls.push(newBall);

      // Overs display string: e.g. "0.4"
      const compOvers = Math.floor(inning.legalBalls / 6);
      const ballsInCurrentOver = inning.legalBalls % 6;
      inning.oversDisplay = `${compOvers}.${ballsInCurrentOver}`;

      // Swap batters on odd runs (runs scored physically run)
      const physicalRuns = isWide ? runs : runs;
      if (physicalRuns % 2 === 1) {
        const temp = inning.currentStrikerId;
        inning.currentStrikerId = inning.currentNonStrikerId;
        inning.currentNonStrikerId = temp;
      }

      // End of over check: 6 legal balls
      if (isLegal && ballsInCurrentOver === 0) {
        // Swap batters at the end of the over
        const temp = inning.currentStrikerId;
        inning.currentStrikerId = inning.currentNonStrikerId;
        inning.currentNonStrikerId = temp;

        // Reset current over balls tracker for the new over after retaining preview
        if (inning.currentOverBalls.filter((b) => !b.extraType || (b.extraType !== 'wide' && b.extraType !== 'noBall')).length >= 6) {
          inning.currentOverBalls = [];
        }
      }

      // Auto-trigger animated celebration banners on major events
      if (runs === 4 && !isWide && !isBye && !isLegBye) {
        matchClone.activeAnimation = { id: `anim-${Date.now()}`, type: 'FOUR', timestamp: Date.now() };
      } else if (runs === 6 && !isWide && !isBye && !isLegBye) {
        matchClone.activeAnimation = { id: `anim-${Date.now()}`, type: 'SIX', timestamp: Date.now() };
      } else if (isWicket) {
        matchClone.activeAnimation = { id: `anim-${Date.now()}`, type: 'WICKET', timestamp: Date.now() };
      }

      matchClone.updatedAt = Date.now();

      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Undo last ball
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const [previousMatch, ...remainingStack] = undoStack;
    setUndoStack(remainingStack);
    const updated = matches.map((m) => (m.id === previousMatch.id ? previousMatch : m));
    syncMatchState(updated);
  }, [undoStack, matches, syncMatchState]);

  // Swap striker and non-striker
  const swapBatters = useCallback(() => {
    const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
    const inning = matchClone.innings[matchClone.activeInningNumber - 1];
    const temp = inning.currentStrikerId;
    inning.currentStrikerId = inning.currentNonStrikerId;
    inning.currentNonStrikerId = temp;
    matchClone.updatedAt = Date.now();
    const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
    syncMatchState(updated);
  }, [activeMatch, matches, syncMatchState]);

  // Change bowler
  const changeBowler = useCallback(
    (newBowlerId: string) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      const inning = matchClone.innings[matchClone.activeInningNumber - 1];
      inning.currentBowlerId = newBowlerId;
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  const changeStriker = useCallback(
    (newStrikerId: string) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      const inning = matchClone.innings[matchClone.activeInningNumber - 1];
      inning.currentStrikerId = newStrikerId;
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  const changeNonStriker = useCallback(
    (newNonStrikerId: string) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      const inning = matchClone.innings[matchClone.activeInningNumber - 1];
      inning.currentNonStrikerId = newNonStrikerId;
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Retire batter
  const retireBatter = useCallback(
    (outPlayerId: string, nextBatterId?: string) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      const inning = matchClone.innings[matchClone.activeInningNumber - 1];
      const battingTeam = matchClone.team1.id === inning.battingTeamId ? matchClone.team1 : matchClone.team2;
      const batter = battingTeam.players.find((p) => p.id === outPlayerId);
      if (batter) {
        batter.isOut = true;
        batter.dismissalInfo = 'Retired Hurt';
      }
      if (nextBatterId) {
        if (outPlayerId === inning.currentStrikerId) {
          inning.currentStrikerId = nextBatterId;
        } else {
          inning.currentNonStrikerId = nextBatterId;
        }
      }
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // End innings / switch innings
  const endInnings = useCallback(() => {
    const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
    const currentInning = matchClone.innings[matchClone.activeInningNumber - 1];
    currentInning.isCompleted = true;

    if (matchClone.activeInningNumber === 1) {
      matchClone.activeInningNumber = 2;
      matchClone.targetRuns = currentInning.totalRuns + 1;
    } else {
      matchClone.status = 'completed';
    }

    matchClone.updatedAt = Date.now();
    const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
    syncMatchState(updated);
  }, [activeMatch, matches, syncMatchState]);

  // Set Display Mode
  const setDisplayMode = useCallback(
    (mode: DisplayMode) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      matchClone.displayMode = mode;
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Set Umpire Decision
  const setUmpireDecision = useCallback(
    (decision: UmpireDecision) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      matchClone.umpireDecision = decision;
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Trigger animation ribbon
  const triggerAnimation = useCallback(
    (type: AnimationTrigger['type'], customText?: string) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      matchClone.activeAnimation = {
        id: `anim-${Date.now()}`,
        type,
        customText,
        timestamp: Date.now(),
      };
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  const clearAnimation = useCallback(() => {
    const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
    matchClone.activeAnimation = null;
    matchClone.updatedAt = Date.now();
    const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
    syncMatchState(updated, false);
  }, [activeMatch, matches, syncMatchState]);

  // Update team colors
  const updateTeamColors = useCallback(
    (teamId: string, primaryColor: string, secondaryColor?: string) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      if (matchClone.team1.id === teamId) {
        matchClone.team1.primaryColor = primaryColor;
        if (secondaryColor) matchClone.team1.secondaryColor = secondaryColor;
      } else if (matchClone.team2.id === teamId) {
        matchClone.team2.primaryColor = primaryColor;
        if (secondaryColor) matchClone.team2.secondaryColor = secondaryColor;
      }
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Update team details (e.g. short name, name, logo)
  const updateTeamDetails = useCallback(
    (teamId: string, updates: Partial<Team>) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      if (matchClone.team1.id === teamId) {
        matchClone.team1 = { ...matchClone.team1, ...updates };
      } else if (matchClone.team2.id === teamId) {
        matchClone.team2 = { ...matchClone.team2, ...updates };
      }
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Bulk add players
  const addPlayersToTeam = useCallback(
    (teamId: string, playerNames: string[]) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      const targetTeam = matchClone.team1.id === teamId ? matchClone.team1 : matchClone.team2;

      const newPlayers: Player[] = playerNames
        .map((name) => name.trim())
        .filter((name) => name.length > 0)
        .map((name, i) => {
          const parts = name.split(' ');
          const shortName = parts.length > 1 ? `${parts[0][0]} ${parts.slice(1).join(' ')}`.toUpperCase() : name.toUpperCase();
          return {
            id: `p-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
            name,
            shortName,
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
          };
        });

      targetTeam.players.push(...newPlayers);
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Update player (photo, stats, name)
  const updatePlayer = useCallback(
    (teamId: string, player: Player) => {
      const matchClone: Match = JSON.parse(JSON.stringify(activeMatch));
      const targetTeam = matchClone.team1.id === teamId ? matchClone.team1 : matchClone.team2;
      const idx = targetTeam.players.findIndex((p) => p.id === player.id);
      if (idx !== -1) {
        targetTeam.players[idx] = player;
      } else {
        targetTeam.players.push(player);
      }
      matchClone.updatedAt = Date.now();
      const updated = matches.map((m) => (m.id === matchClone.id ? matchClone : m));
      syncMatchState(updated);
    },
    [activeMatch, matches, syncMatchState]
  );

  // Create tournament
  const createTournament = useCallback(
    (name: string, location: string): Tournament => {
      const newTour: Tournament = {
        id: `tour-${Date.now()}`,
        name,
        location,
        startDate: new Date().toISOString().split('T')[0],
        teams: [],
        matches: [],
        createdAt: Date.now(),
      };
      const updated = [newTour, ...tournaments];
      setTournaments(updated);
      saveTournaments(updated, currentUserIdRef.current);
      return newTour;
    },
    [tournaments]
  );

  // Helper to generate full 11-player cricket squads for standard and custom teams
  const createSquadForTeam = (teamName: string, teamId: string): Player[] => {
    const upper = teamName.toUpperCase().trim();

    if (upper.includes('IND')) {
      const roster = [
        { name: 'Rohit Sharma', role: 'batsman' },
        { name: 'Shubman Gill', role: 'batsman' },
        { name: 'Virat Kohli', role: 'batsman' },
        { name: 'Suryakumar Yadav', role: 'batsman' },
        { name: 'Hardik Pandya', role: 'allRounder' },
        { name: 'Rishabh Pant', role: 'wicketKeeper' },
        { name: 'Ravindra Jadeja', role: 'allRounder' },
        { name: 'Axar Patel', role: 'allRounder' },
        { name: 'Kuldeep Yadav', role: 'bowler' },
        { name: 'Jasprit Bumrah', role: 'bowler' },
        { name: 'Mohammed Siraj', role: 'bowler' },
      ];
      return roster.map((p, idx) => ({
        id: `${teamId}-${idx + 1}`,
        name: p.name,
        shortName: p.name.split(' ').map((w, i, a) => i === a.length - 1 ? w.toUpperCase() : w[0].toUpperCase()).join(' '),
        role: p.role as Player['role'],
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
      }));
    }

    if (upper.includes('AUS')) {
      const roster = [
        { name: 'David Warner', role: 'batsman' },
        { name: 'Travis Head', role: 'batsman' },
        { name: 'Mitchell Marsh', role: 'allRounder' },
        { name: 'Glenn Maxwell', role: 'allRounder' },
        { name: 'Marcus Stoinis', role: 'allRounder' },
        { name: 'Tim David', role: 'batsman' },
        { name: 'Matthew Wade', role: 'wicketKeeper' },
        { name: 'Pat Cummins', role: 'bowler' },
        { name: 'Mitchell Starc', role: 'bowler' },
        { name: 'Adam Zampa', role: 'bowler' },
        { name: 'Josh Hazlewood', role: 'bowler' },
      ];
      return roster.map((p, idx) => ({
        id: `${teamId}-${idx + 1}`,
        name: p.name,
        shortName: p.name.split(' ').map((w, i, a) => i === a.length - 1 ? w.toUpperCase() : w[0].toUpperCase()).join(' '),
        role: p.role as Player['role'],
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
      }));
    }

    if (upper.includes('BAN')) {
      const roster = [
        { name: 'Tanzid Hasan', role: 'batsman' },
        { name: 'Najmul Shanto', role: 'batsman' },
        { name: 'Litton Das', role: 'wicketKeeper' },
        { name: 'Shakib Al Hasan', role: 'allRounder' },
        { name: 'Towhid Hridoy', role: 'batsman' },
        { name: 'Mahmudullah', role: 'allRounder' },
        { name: 'Jaker Ali', role: 'wicketKeeper' },
        { name: 'Rishad Hossain', role: 'allRounder' },
        { name: 'Taskin Ahmed', role: 'bowler' },
        { name: 'Mustafizur Rahman', role: 'bowler' },
        { name: 'Shoriful Islam', role: 'bowler' },
      ];
      return roster.map((p, idx) => ({
        id: `${teamId}-${idx + 1}`,
        name: p.name,
        shortName: p.name.split(' ').map((w, i, a) => i === a.length - 1 ? w.toUpperCase() : w[0].toUpperCase()).join(' '),
        role: p.role as Player['role'],
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
      }));
    }

    if (upper.includes('ENG')) {
      const roster = [
        { name: 'Jos Buttler', role: 'wicketKeeper' },
        { name: 'Phil Salt', role: 'batsman' },
        { name: 'Harry Brook', role: 'batsman' },
        { name: 'Jonny Bairstow', role: 'batsman' },
        { name: 'Moeen Ali', role: 'allRounder' },
        { name: 'Liam Livingstone', role: 'allRounder' },
        { name: 'Sam Curran', role: 'allRounder' },
        { name: 'Chris Jordan', role: 'bowler' },
        { name: 'Jofra Archer', role: 'bowler' },
        { name: 'Adil Rashid', role: 'bowler' },
        { name: 'Reece Topley', role: 'bowler' },
      ];
      return roster.map((p, idx) => ({
        id: `${teamId}-${idx + 1}`,
        name: p.name,
        shortName: p.name.split(' ').map((w, i, a) => i === a.length - 1 ? w.toUpperCase() : w[0].toUpperCase()).join(' '),
        role: p.role as Player['role'],
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
      }));
    }

    // Generic 11-player squad for custom teams
    const shortPrefix = teamName.substring(0, 3).toUpperCase();
    return Array.from({ length: 11 }, (_, i) => {
      const num = i + 1;
      const isWk = num === 3;
      const isAll = num === 5 || num === 6;
      const isBowler = num >= 8;
      const role: Player['role'] = isWk ? 'wicketKeeper' : isAll ? 'allRounder' : isBowler ? 'bowler' : 'batsman';
      return {
        id: `${teamId}-${num}`,
        name: `${teamName} Player ${num}`,
        shortName: `${shortPrefix} P${num}`,
        role,
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
      };
    });
  };

  // Create match
  const createMatch = useCallback(
    ({
      tournamentId,
      team1Name,
      team2Name,
      overs,
      matchNo,
      tossWonBy,
      optedTo,
      ballsPerOver = 6,
      matchType = 'Group Stage',
      team1LogoUrl,
      team2LogoUrl,
    }: {
      tournamentId: string;
      team1Name: string;
      team2Name: string;
      overs: number;
      matchNo: string;
      tossWonBy: 'team1' | 'team2';
      optedTo: 'bat' | 'bowl';
      ballsPerOver?: number;
      matchType?: 'Group Stage' | 'Knockout' | 'Semi Final' | 'Final';
      team1LogoUrl?: string;
      team2LogoUrl?: string;
    }): Match => {
      const team1Id = `team-${Date.now()}-1`;
      const team2Id = `team-${Date.now()}-2`;

      const team1Short = team1Name.substring(0, 3).toUpperCase();
      const team2Short = team2Name.substring(0, 3).toUpperCase();

      const team1Players = createSquadForTeam(team1Name, team1Id);
      const team2Players = createSquadForTeam(team2Name, team2Id);

      const team1: Team = {
        id: team1Id,
        name: team1Name.toUpperCase(),
        shortName: team1Short,
        logoUrl: team1LogoUrl,
        primaryColor: '#1d4ed8',
        secondaryColor: '#0284c7',
        players: team1Players,
      };

      const team2: Team = {
        id: team2Id,
        name: team2Name.toUpperCase(),
        shortName: team2Short,
        logoUrl: team2LogoUrl,
        primaryColor: '#eab308',
        secondaryColor: '#15803d',
        players: team2Players,
      };

      const tossWinnerId = tossWonBy === 'team1' ? team1Id : team2Id;
      const battingFirstId = (tossWonBy === 'team1' && optedTo === 'bat') || (tossWonBy === 'team2' && optedTo === 'bowl') ? team1Id : team2Id;
      const bowlingFirstId = battingFirstId === team1Id ? team2Id : team1Id;

      const battingFirstTeam = battingFirstId === team1Id ? team1 : team2;
      const bowlingFirstTeam = battingFirstId === team1Id ? team2 : team1;

      const newMatch: Match = {
        id: `match-${Date.now()}`,
        tournamentId,
        matchNo,
        matchType,
        overs,
        ballsPerOver,
        team1,
        team2,
        tossWonByTeamId: tossWinnerId,
        tossDecision: optedTo,
        activeInningNumber: 1,
        innings: [
          {
            inningNumber: 1,
            battingTeamId: battingFirstId,
            bowlingTeamId: bowlingFirstId,
            totalRuns: 0,
            wickets: 0,
            legalBalls: 0,
            oversDisplay: '0.0',
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
            currentStrikerId: battingFirstTeam.players[0].id,
            currentNonStrikerId: battingFirstTeam.players[1]?.id || battingFirstTeam.players[0].id,
            currentBowlerId: bowlingFirstTeam.players[bowlingFirstTeam.players.length - 1].id,
            currentOverBalls: [],
            allBalls: [],
            fow: [],
            isCompleted: false,
          },
          {
            inningNumber: 2,
            battingTeamId: bowlingFirstId,
            bowlingTeamId: battingFirstId,
            totalRuns: 0,
            wickets: 0,
            legalBalls: 0,
            oversDisplay: '0.0',
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
            currentStrikerId: bowlingFirstTeam.players[0].id,
            currentNonStrikerId: bowlingFirstTeam.players[1]?.id || bowlingFirstTeam.players[0].id,
            currentBowlerId: battingFirstTeam.players[battingFirstTeam.players.length - 1].id,
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
        updatedAt: Date.now(),
      };

      const updated = [newMatch, ...matches];
      setActiveMatchIdState(newMatch.id);
      saveActiveMatchId(newMatch.id);
      activeMatchIdRef.current = newMatch.id;
      syncMatchState(updated, true, newMatch.id);
      return newMatch;
    },
    [matches, syncMatchState]
  );

  // Delete match permanently and switch to remaining match or fresh template
  const deleteMatch = useCallback(
    (matchIdToDelete: string): string => {
      const remaining = matches.filter((m) => m.id !== matchIdToDelete);

      let finalMatches: Match[];
      let nextActiveId: string;

      if (remaining.length > 0) {
        finalMatches = remaining;
        nextActiveId = remaining[0].id;
      } else {
        // If all matches were deleted, create a fresh clean match
        const freshCleanMatch: Match = {
          ...defaultInitialMatch,
          id: `match-${Date.now()}`,
          matchNo: 'MATCH 1 • LIVE',
          status: 'live',
          updatedAt: Date.now(),
          innings: defaultInitialMatch.innings.map((inn) => ({
            ...inn,
            totalRuns: 0,
            wickets: 0,
            legalBalls: 0,
            oversDisplay: '0.0',
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
            currentOverBalls: [],
            allBalls: [],
            fow: [],
            isCompleted: false,
          })) as unknown as [Inning, Inning],
        };
        finalMatches = [freshCleanMatch];
        nextActiveId = freshCleanMatch.id;
      }

      const uid = currentUserIdRef.current;
      setMatches(finalMatches);
      saveMatches(finalMatches, uid);
      setActiveMatchIdState(nextActiveId);
      saveActiveMatchId(nextActiveId, uid);
      activeMatchIdRef.current = nextActiveId;

      // Broadcast updated matches to other tabs and the account server
      if (channelRef.current) {
        try {
          channelRef.current.postMessage({
            type: 'MATCHES_SYNC',
            userId: uid,
            matches: finalMatches,
            activeMatchId: nextActiveId,
            timestamp: Date.now(),
          });
        } catch {}
      }
      if (canSyncRef.current) {
        saverRef.current.save({ matches: finalMatches, activeMatchId: nextActiveId });
      }

      return nextActiveId;
    },
    [matches]
  );

  const manualSyncPulse = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          type: 'MATCHES_SYNC',
          matches,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.warn('Manual sync pulse error', err);
      }
    }
    if (canSyncRef.current) {
      saverRef.current.save({ matches, activeMatchId: activeMatchIdRef.current });
    }
  }, [matches]);

  return (
    <CricketContext.Provider
      value={{
        matches,
        tournaments,
        activeMatch,
        undoStack,
        setActiveMatchId,
        addBall,
        undo,
        swapBatters,
        changeBowler,
        changeStriker,
        changeNonStriker,
        retireBatter,
        endInnings,
        setDisplayMode,
        setUmpireDecision,
        triggerAnimation,
        clearAnimation,
        updateTeamColors,
        updateTeamDetails,
        addPlayersToTeam,
        updatePlayer,
        createTournament,
        createMatch,
        deleteMatch,
        manualSyncPulse,
        isSyncing,
        applySyncMatches,
      }}
    >
      {children}
    </CricketContext.Provider>
  );
};

export const useCricket = () => {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
};
