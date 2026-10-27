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
} from '../types/cricket';
import {
  BROADCAST_CHANNEL_NAME,
  getStoredMatches,
  saveMatches,
  getStoredTournaments,
  saveTournaments,
  defaultInitialMatch,
  getStoredActiveMatchId,
  saveActiveMatchId,
} from '../utils/storage';

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
  manualSyncPulse: () => void;
  isSyncing: boolean;
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
  const sanitizeMatches = useCallback((list: any[]): Match[] => {
    if (!Array.isArray(list)) return [defaultInitialMatch];
    let filtered = list.filter(isValidMatch);
    filtered = filtered.filter(
      (m) =>
        m.id !== 'match-ind-aus-final' &&
        !m.team1?.name?.toUpperCase().includes('IND') &&
        !m.team2?.name?.toUpperCase().includes('AUS')
    );
    if (!filtered.some((m) => m.id === defaultInitialMatch.id)) {
      filtered.unshift(defaultInitialMatch);
    }
    return filtered;
  }, []);

  const [tournaments, setTournaments] = useState<Tournament[]>(() => getStoredTournaments());
  const [matches, setMatches] = useState<Match[]>(() => {
    const stored = getStoredMatches();
    const sanitized = stored.filter(
      (m) =>
        m.id !== 'match-ind-aus-final' &&
        !m.team1?.name?.toUpperCase().includes('IND') &&
        !m.team2?.name?.toUpperCase().includes('AUS')
    );
    return sanitized.length > 0 ? sanitized : [defaultInitialMatch];
  });
  const [activeMatchId, setActiveMatchIdState] = useState<string>(() => {
    const storedId = getStoredActiveMatchId();
    const list = getStoredMatches();
    const sanitized = list.filter(
      (m) =>
        m.id !== 'match-ind-aus-final' &&
        !m.team1?.name?.toUpperCase().includes('IND') &&
        !m.team2?.name?.toUpperCase().includes('AUS')
    );
    if (storedId && sanitized.some((m) => m.id === storedId)) {
      return storedId;
    }
    return sanitized[0]?.id || defaultInitialMatch.id;
  });

  const [undoStack, setUndoStack] = useState<Match[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const channelRef = useRef<BroadcastChannel | null>(null);

  // Active match getter with bulletproof fallback
  const rawMatch = matches.find((m) => m.id === activeMatchId) || matches.find(isValidMatch);
  const activeMatch = isValidMatch(rawMatch) ? rawMatch : defaultInitialMatch;

  // Sync to channel and storage
  const syncMatchState = useCallback(
    (updatedMatches: Match[], triggerPulse = true) => {
      const validMatches = sanitizeMatches(updatedMatches);
      if (validMatches.length === 0) return;

      setMatches(validMatches);
      saveMatches(validMatches);

      if (triggerPulse) {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 800);
      }

      if (channelRef.current) {
        try {
          channelRef.current.postMessage({
            type: 'MATCHES_SYNC',
            matches: validMatches,
            activeMatchId,
            timestamp: Date.now(),
          });
        } catch (err) {
          console.warn('BroadcastChannel postMessage error', err);
        }
      }

      // Push update to local server for OBS Studio (CEF) and external devices
      try {
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matches: validMatches, activeMatchId }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    },
    [sanitizeMatches, activeMatchId]
  );

  const setActiveMatchId = useCallback(
    (id: string) => {
      setActiveMatchIdState(id);
      saveActiveMatchId(id);

      if (channelRef.current) {
        try {
          channelRef.current.postMessage({
            type: 'ACTIVE_MATCH_CHANGE',
            activeMatchId: id,
            timestamp: Date.now(),
          });
        } catch (err) {
          console.warn('BroadcastChannel setActiveMatchId error', err);
        }
      }

      try {
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matches, activeMatchId: id }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    },
    [matches]
  );

  // Keep local server in sync on mount and whenever matches change
  useEffect(() => {
    if (matches && matches.length > 0) {
      try {
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matches, activeMatchId }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    }
  }, [matches, activeMatchId]);

  // Set up BroadcastChannel + SSE (Server-Sent Events for OBS) + Storage event fallback
  useEffect(() => {
    // 1. Initial state fetch from local server (for OBS Studio on first load)
    fetch('/api/match')
      .then((r) => r.json())
      .then((data) => {
        if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          const sanitized = sanitizeMatches(data.matches);
          setMatches(sanitized);
          if (data.activeMatchId && sanitized.some((m: any) => m.id === data.activeMatchId)) {
            setActiveMatchIdState(data.activeMatchId);
            saveActiveMatchId(data.activeMatchId);
          }
        } else {
          // Server has no cached matches yet; push client matches to populate server cache
          const localMatches = getStoredMatches();
          const storedActive = getStoredActiveMatchId();
          if (localMatches && localMatches.length > 0) {
            fetch('/api/match', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                matches: localMatches,
                activeMatchId: storedActive || localMatches[0]?.id,
              }),
            }).catch(() => {});
          }
        }
      })
      .catch(() => {});

    // 2. Server-Sent Events (SSE) listener for OBS Studio cross-process real-time sync
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed?.type === 'MATCHES_SYNC' && Array.isArray(parsed.matches)) {
            const sanitized = sanitizeMatches(parsed.matches);
            setMatches(sanitized);
            if (parsed.activeMatchId && sanitized.some((m: any) => m.id === parsed.activeMatchId)) {
              setActiveMatchIdState(parsed.activeMatchId);
              saveActiveMatchId(parsed.activeMatchId);
            }
          }
        } catch {
          // ignore
        }
      };
    } catch (e) {
      console.warn('SSE error', e);
    }

    // 3. Ultra-reliable polling fallback every 800ms for OBS Browser Source
    const pollInterval = setInterval(() => {
      fetch('/api/match')
        .then((r) => r.json())
        .then((data) => {
          if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
            const sanitized = sanitizeMatches(data.matches);
            setMatches((current) => {
              const currUpdated = current.find((m) => m.id === activeMatchId)?.updatedAt || 0;
              const newMatch = sanitized.find((m: any) => m.id === activeMatchId);
              const newUpdated = newMatch?.updatedAt || 0;
              if (newUpdated > currUpdated || sanitized.length !== current.length) {
                return sanitized;
              }
              return current;
            });
            if (data.activeMatchId && data.activeMatchId !== activeMatchId) {
              if (sanitized.some((m: any) => m.id === data.activeMatchId)) {
                setActiveMatchIdState(data.activeMatchId);
                saveActiveMatchId(data.activeMatchId);
              }
            }
          }
        })
        .catch(() => {});
    }, 800);

    // 4. BroadcastChannel for same-browser instant 0ms latency
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'MATCHES_SYNC' && Array.isArray(event.data.matches)) {
          const sanitized = sanitizeMatches(event.data.matches);
          setMatches(sanitized);
          if (event.data.activeMatchId && sanitized.some((m: any) => m.id === event.data.activeMatchId)) {
            setActiveMatchIdState(event.data.activeMatchId);
            saveActiveMatchId(event.data.activeMatchId);
          }
        } else if (event.data?.type === 'ACTIVE_MATCH_CHANGE' && event.data.activeMatchId) {
          setActiveMatchIdState(event.data.activeMatchId);
          saveActiveMatchId(event.data.activeMatchId);
        } else if (event.data?.type === 'ANIMATION_PULSE') {
          setIsSyncing(true);
          setTimeout(() => setIsSyncing(false), 600);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cricscorer_matches' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMatches(parsed);
        } catch {
          // ignore
        }
      } else if (e.key === 'cricscorer_active_match_id' && e.newValue) {
        setActiveMatchIdState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      channelRef.current?.close();
      eventSource?.close();
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [activeMatchId, sanitizeMatches]);


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
      saveTournaments(updated);
      return newTour;
    },
    [tournaments]
  );

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

      const team1: Team = {
        id: team1Id,
        name: team1Name.toUpperCase(),
        shortName: team1Short,
        logoUrl: team1LogoUrl,
        primaryColor: '#1d4ed8',
        secondaryColor: '#0284c7',
        players: [
          {
            id: `p-${team1Id}-1`,
            name: 'Player 1',
            shortName: 'P 1',
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
            id: `p-${team1Id}-2`,
            name: 'Player 2',
            shortName: 'P 2',
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
        ],
      };

      const team2: Team = {
        id: team2Id,
        name: team2Name.toUpperCase(),
        shortName: team2Short,
        logoUrl: team2LogoUrl,
        primaryColor: '#eab308',
        secondaryColor: '#15803d',
        players: [
          {
            id: `p-${team2Id}-1`,
            name: 'Bowler 1',
            shortName: 'B 1',
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
        ],
      };

      const tossWinnerId = tossWonBy === 'team1' ? team1Id : team2Id;
      const battingFirstId = (tossWonBy === 'team1' && optedTo === 'bat') || (tossWonBy === 'team2' && optedTo === 'bowl') ? team1Id : team2Id;
      const bowlingFirstId = battingFirstId === team1Id ? team2Id : team1Id;

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
            currentStrikerId: battingFirstId === team1Id ? team1.players[0].id : team2.players[0].id,
            currentNonStrikerId: battingFirstId === team1Id ? team1.players[1]?.id || team1.players[0].id : team2.players[1]?.id || team2.players[0].id,
            currentBowlerId: bowlingFirstId === team1Id ? team1.players[0].id : team2.players[0].id,
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
            currentStrikerId: bowlingFirstId === team1Id ? team1.players[0].id : team2.players[0].id,
            currentNonStrikerId: bowlingFirstId === team1Id ? team1.players[1]?.id || team1.players[0].id : team2.players[1]?.id || team2.players[0].id,
            currentBowlerId: battingFirstId === team1Id ? team1.players[0].id : team2.players[0].id,
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
      syncMatchState(updated);
      setActiveMatchIdState(newMatch.id);
      return newMatch;
    },
    [matches, syncMatchState]
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
    try {
      fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches }),
      }).catch(() => {});
    } catch {
      // ignore
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
        manualSyncPulse,
        isSyncing,
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
