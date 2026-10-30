import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  FootballMatch,
  FootballPeriod,
  FootballScoreboardConfig,
  FootballAnimation,
  PenaltyKickResult,
  PenaltyShootoutState,
} from '../types/football';
import { playGoalSound, playWhistleSound } from '../utils/soundEffects';
import { useAuth } from './AuthContext';
import { api, createThrottledSaver, startPoller } from '../utils/api';

const STORAGE_KEY = 'footscore_active_match';
const SYNC_CHANNEL_NAME = 'footscore_live_sync';

export const DEFAULT_PENALTIES: PenaltyShootoutState = {
  isActive: false,
  team1Kicks: ['pending', 'pending', 'pending', 'pending', 'pending'],
  team2Kicks: ['pending', 'pending', 'pending', 'pending', 'pending'],
  team1Score: 0,
  team2Score: 0,
  currentTurn: {
    team: 1,
    kickIndex: 0,
  },
  winner: null,
};

export const DEFAULT_FOOTBALL_MATCH: FootballMatch = {
  id: 'football-live-1',
  title: 'Football Championship Live',
  venue: 'National Stadium',
  team1: {
    name: 'TEAM 1',
    shortName: 'TM1',
    score: 0,
    primaryColor: '#0533a8',
    secondaryColor: '#1d63ff',
    accentGlow: '#00d2ff',
    yellowCards: 0,
    redCards: 0,
  },
  team2: {
    name: 'TEAM 2',
    shortName: 'TM2',
    score: 0,
    primaryColor: '#99071c',
    secondaryColor: '#eb1c3c',
    accentGlow: '#ff2244',
    yellowCards: 0,
    redCards: 0,
  },
  time: {
    minutes: 0,
    seconds: 0,
    isRunning: false,
    stoppageTime: 0,
    period: '1H',
  },
  goals: [],
  activeAnimation: null,
  penalties: DEFAULT_PENALTIES,
  config: {
    position: 'top-left',
    offsetX: 50,
    offsetY: 40,
    scale: 1.0,
    showLogos: true,
    showCards: true,
    showPeriodBadge: true,
    soundEnabled: true,
  },
  updatedAt: 0,
};

export const FOOTBALL_PRESETS: Record<string, Partial<FootballMatch>> = {
  default: {
    title: 'Football Match',
    team1: {
      name: 'TEAM 1',
      shortName: 'TM1',
      score: 0,
      primaryColor: '#0533a8',
      secondaryColor: '#1d63ff',
      accentGlow: '#00d2ff',
      yellowCards: 0,
      redCards: 0,
    },
    team2: {
      name: 'TEAM 2',
      shortName: 'TM2',
      score: 0,
      primaryColor: '#99071c',
      secondaryColor: '#eb1c3c',
      accentGlow: '#ff2244',
      yellowCards: 0,
      redCards: 0,
    },
  },
  elclasico: {
    title: 'El Clásico - Supercopa',
    team1: {
      name: 'REAL MADRID',
      shortName: 'RMA',
      score: 0,
      primaryColor: '#0f172a',
      secondaryColor: '#2563eb',
      accentGlow: '#60a5fa',
      yellowCards: 0,
      redCards: 0,
    },
    team2: {
      name: 'BARCELONA',
      shortName: 'BAR',
      score: 0,
      primaryColor: '#831843',
      secondaryColor: '#b91c1c',
      accentGlow: '#f43f5e',
      yellowCards: 0,
      redCards: 0,
    },
  },
  premLeague: {
    title: 'Premier League Super Sunday',
    team1: {
      name: 'MAN CITY',
      shortName: 'MCI',
      score: 0,
      primaryColor: '#0284c7',
      secondaryColor: '#38bdf8',
      accentGlow: '#7dd3fc',
      yellowCards: 0,
      redCards: 0,
    },
    team2: {
      name: 'ARSENAL',
      shortName: 'ARS',
      score: 0,
      primaryColor: '#b91c1c',
      secondaryColor: '#dc2626',
      accentGlow: '#ef4444',
      yellowCards: 0,
      redCards: 0,
    },
  },
  worldCup: {
    title: 'FIFA World Cup Grand Final',
    team1: {
      name: 'ARGENTINA',
      shortName: 'ARG',
      score: 0,
      primaryColor: '#0284c7',
      secondaryColor: '#38bdf8',
      accentGlow: '#facc15',
      yellowCards: 0,
      redCards: 0,
    },
    team2: {
      name: 'BRAZIL',
      shortName: 'BRA',
      score: 0,
      primaryColor: '#15803d',
      secondaryColor: '#eab308',
      accentGlow: '#22c55e',
      yellowCards: 0,
      redCards: 0,
    },
  },
};

interface FootballContextType {
  match: FootballMatch;
  setMatch: React.Dispatch<React.SetStateAction<FootballMatch>>;
  // Score
  updateScore: (team: 1 | 2, delta: number) => void;
  setExactScore: (team: 1 | 2, score: number) => void;
  // Team Info
  updateTeam: (team: 1 | 2, updates: Partial<FootballMatch['team1']>) => void;
  // Timer
  toggleTimer: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (minutes?: number, seconds?: number) => void;
  adjustTimeMinutes: (delta: number) => void;
  setPeriod: (period: FootballPeriod) => void;
  setStoppageTime: (minutes: number) => void;
  // Events
  triggerGoal: (team: 1 | 2, playerName?: string) => void;
  triggerEvent: (type: FootballAnimation['type'], team: 1 | 2, playerName?: string) => void;
  clearAnimation: () => void;
  // Cards
  updateCards: (team: 1 | 2, type: 'yellow' | 'red', delta: number) => void;
  // Config
  updateConfig: (updates: Partial<FootballScoreboardConfig>) => void;
  // Presets & Reset
  loadPreset: (key: string) => void;
  resetMatch: () => void;
  // Penalty Shootout
  togglePenalties: (active?: boolean) => void;
  recordPenaltyKick: (team: 1 | 2, kickIndex: number, result: PenaltyKickResult) => void;
  quickRecordNextPenalty: (team: 1 | 2, result: 'goal' | 'miss') => void;
  addSuddenDeathKick: () => void;
  resetPenalties: () => void;
}

const FootballContext = createContext<FootballContextType | undefined>(undefined);

export const FootballProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, hasActiveSubscription } = useAuth();
  const userId = user?.id || 'guest';
  const canSyncRef = useRef<boolean>(false);
  canSyncRef.current = !!user && hasActiveSubscription;
  const saverRef = useRef(createThrottledSaver('football', 300));
  const lastLocalActionRef = useRef<number>(0);
  const [match, setMatchState] = useState<FootballMatch>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.team1 && parsed.team2 && parsed.time) {
          return {
            ...DEFAULT_FOOTBALL_MATCH,
            ...parsed,
            config: {
              ...DEFAULT_FOOTBALL_MATCH.config,
              ...(parsed.config || {}),
            },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load saved football match:', e);
    }
    return DEFAULT_FOOTBALL_MATCH;
  });

  const syncChannelRef = useRef<BroadcastChannel | null>(null);
  const matchRef = useRef<FootballMatch>(match);
  matchRef.current = match;

  const isOverlay = typeof window !== 'undefined' && window.location.pathname.includes('/overlay');

  // Push to this account's server state (powers the OBS overlay link and other devices)
  const sendNetworkSync = useCallback((targetMatch: FootballMatch) => {
    if (isOverlay || !canSyncRef.current) return; // Overlays are pure consumers
    lastLocalActionRef.current = Date.now();
    saverRef.current.save({ footballMatch: targetMatch });
  }, [isOverlay]);

  // Broadcast and persist helper
  const broadcastAndSave = useCallback(
    (newMatch: FootballMatch, skipBroadcast = false) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMatch));
      } catch {}

      if (!skipBroadcast && syncChannelRef.current) {
        try {
          syncChannelRef.current.postMessage({
            type: 'MATCH_UPDATE',
            match: newMatch,
          });
        } catch {}
      }

      // Relay to this account's server state
      if (!isOverlay) {
        sendNetworkSync(newMatch);
      }
    },
    [sendNetworkSync, isOverlay]
  );

  const setMatch: React.Dispatch<React.SetStateAction<FootballMatch>> = useCallback(
    (action) => {
      setMatchState((prev) => {
        const next = typeof action === 'function' ? action(prev) : action;
        const updated = { ...next, updatedAt: Date.now() };
        broadcastAndSave(updated);
        return updated;
      });
    },
    [broadcastAndSave]
  );

  // Setup BroadcastChannel, network polling fallback and storage event listeners
  useEffect(() => {
    // Accept only newer match state
    const acceptMatch = (incoming: FootballMatch) => {
      if (
        incoming &&
        incoming.team1 &&
        incoming.team2 &&
        ((incoming.updatedAt || 0) >= (matchRef.current.updatedAt || 0) || (matchRef.current.updatedAt || 0) === 0)
      ) {
        setMatchState(incoming);
      }
    };

    // Load this account's football state, then poll so other devices of the account stay in step
    let cancelled = false;
    let lastServerTs = 0;
    let first = true;
    let stopPolling: (() => void) | null = null;
    const pull = async (): Promise<boolean> => {
      const initial = first;
      const res = await api.getState('football', initial ? 0 : lastServerTs);
      if (cancelled) return true;
      if (!res.ok) return false;
      first = false;
      if (res.status === 204) return true;
      if (res.data?.updatedAt) lastServerTs = res.data.updatedAt;
      const incoming = res.data?.data?.footballMatch;
      if (incoming) {
        if (!initial && Date.now() - lastLocalActionRef.current < 3000) return true;
        acceptMatch(incoming);
      } else if (initial && !isOverlay && canSyncRef.current) {
        sendNetworkSync(matchRef.current);
      }
      return true;
    };
    if (!isOverlay && userId !== 'guest') {
      stopPolling = startPoller(pull, 2000, 30_000);
    }

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        syncChannelRef.current = channel;

        channel.onmessage = (event) => {
          if (event.data?.type === 'MATCH_UPDATE' && event.data?.match) {
            acceptMatch(event.data.match);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or error:', e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed) {
            acceptMatch(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      cancelled = true;
      if (stopPolling) stopPolling();
      window.removeEventListener('storage', handleStorage);
      syncChannelRef.current?.close();
    };
  }, [isOverlay, sendNetworkSync, userId]);

  // Account switch: drop the previous account's unsent changes
  useEffect(() => {
    saverRef.current.cancel();
    saverRef.current = createThrottledSaver('football', 300);
  }, [userId]);

  // Live Timer Ticker: Only the active runner controller tab advances the master clock
  useEffect(() => {
    if (!match.time.isRunning || isOverlay) return;

    const timer = setInterval(() => {
      setMatchState((prev) => {
        if (!prev.time.isRunning) return prev;

        let nextSeconds = prev.time.seconds + 1;
        let nextMinutes = prev.time.minutes;

        if (nextSeconds >= 60) {
          nextSeconds = 0;
          nextMinutes += 1;
        }

        const nextMatch: FootballMatch = {
          ...prev,
          time: {
            ...prev.time,
            minutes: nextMinutes,
            seconds: nextSeconds,
          },
          updatedAt: Date.now(),
        };

        broadcastAndSave(nextMatch);
        return nextMatch;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [match.time.isRunning, isOverlay, broadcastAndSave]);

  // Score updates
  const updateScore = useCallback(
    (team: 1 | 2, delta: number) => {
      setMatch((prev) => {
        const teamKey = team === 1 ? 'team1' : 'team2';
        const currentScore = prev[teamKey].score;
        const newScore = Math.max(0, currentScore + delta);

        // If score increased, automatically trigger goal animation!
        if (delta > 0) {
          if (prev.config.soundEnabled) {
            playGoalSound();
          }
          return {
            ...prev,
            [teamKey]: {
              ...prev[teamKey],
              score: newScore,
            },
            activeAnimation: {
              type: 'GOAL',
              team,
              teamName: prev[teamKey].name,
              playerName: undefined,
              timestamp: Date.now(),
            },
          };
        }

        return {
          ...prev,
          [teamKey]: {
            ...prev[teamKey],
            score: newScore,
          },
        };
      });
    },
    [setMatch]
  );

  const setExactScore = useCallback(
    (team: 1 | 2, score: number) => {
      setMatch((prev) => {
        const teamKey = team === 1 ? 'team1' : 'team2';
        return {
          ...prev,
          [teamKey]: {
            ...prev[teamKey],
            score: Math.max(0, score),
          },
        };
      });
    },
    [setMatch]
  );

  // Team updates
  const updateTeam = useCallback(
    (team: 1 | 2, updates: Partial<FootballMatch['team1']>) => {
      setMatch((prev) => {
        const teamKey = team === 1 ? 'team1' : 'team2';
        return {
          ...prev,
          [teamKey]: {
            ...prev[teamKey],
            ...updates,
          },
        };
      });
    },
    [setMatch]
  );

  // Timer controls
  const toggleTimer = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      time: {
        ...prev.time,
        isRunning: !prev.time.isRunning,
      },
    }));
  }, [setMatch]);

  const startTimer = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      time: {
        ...prev.time,
        isRunning: true,
      },
    }));
  }, [setMatch]);

  const pauseTimer = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      time: {
        ...prev.time,
        isRunning: false,
      },
    }));
  }, [setMatch]);

  const resetTimer = useCallback(
    (minutes = 0, seconds = 0) => {
      setMatch((prev) => ({
        ...prev,
        time: {
          ...prev.time,
          minutes,
          seconds,
          isRunning: false,
        },
      }));
    },
    [setMatch]
  );

  const adjustTimeMinutes = useCallback(
    (delta: number) => {
      setMatch((prev) => {
        const newMin = Math.max(0, prev.time.minutes + delta);
        return {
          ...prev,
          time: {
            ...prev.time,
            minutes: newMin,
          },
        };
      });
    },
    [setMatch]
  );

  const setPeriod = useCallback(
    (period: FootballPeriod) => {
      setMatch((prev) => {
        let defaultMin = prev.time.minutes;
        if (period === '1H') defaultMin = 0;
        else if (period === 'HT') defaultMin = 45;
        else if (period === '2H') defaultMin = 45;
        else if (period === 'ET1') defaultMin = 90;
        else if (period === 'ET2') defaultMin = 105;
        else if (period === 'FT') defaultMin = 90;

        return {
          ...prev,
          time: {
            ...prev.time,
            period,
            minutes: defaultMin,
            seconds: 0,
            isRunning: period === '1H' || period === '2H' || period === 'ET1' || period === 'ET2',
          },
        };
      });
    },
    [setMatch]
  );

  const setStoppageTime = useCallback(
    (minutes: number) => {
      setMatch((prev) => ({
        ...prev,
        time: {
          ...prev.time,
          stoppageTime: Math.max(0, minutes),
        },
      }));
    },
    [setMatch]
  );

  // Animations & Celebrations
  const triggerGoal = useCallback(
    (team: 1 | 2, playerName?: string) => {
      if (matchRef.current.config.soundEnabled) {
        playGoalSound();
      }
      setMatch((prev) => {
        const teamKey = team === 1 ? 'team1' : 'team2';
        const currentScore = prev[teamKey].score;
        const newGoal: FootballMatch['goals'][number] = {
          id: `goal-${Date.now()}`,
          team,
          playerName: playerName || 'Goal Scorer',
          minute: prev.time.minutes || 1,
          extraMinute: prev.time.stoppageTime > 0 ? prev.time.stoppageTime : undefined,
        };

        return {
          ...prev,
          [teamKey]: {
            ...prev[teamKey],
            score: currentScore + 1,
          },
          goals: [newGoal, ...prev.goals],
          activeAnimation: {
            type: 'GOAL',
            team,
            teamName: prev[teamKey].name,
            playerName: playerName || 'GOAL!',
            timestamp: Date.now(),
          },
        };
      });
    },
    [setMatch]
  );

  const triggerEvent = useCallback(
    (type: FootballAnimation['type'], team: 1 | 2, playerName?: string) => {
      if (type === 'YELLOW_CARD' || type === 'RED_CARD') {
        if (matchRef.current.config.soundEnabled) {
          playWhistleSound();
        }
      }
      setMatch((prev) => {
        const teamKey = team === 1 ? 'team1' : 'team2';
        return {
          ...prev,
          activeAnimation: {
            type,
            team,
            teamName: prev[teamKey].name,
            playerName,
            timestamp: Date.now(),
          },
        };
      });
    },
    [setMatch]
  );

  const clearAnimation = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      activeAnimation: null,
    }));
  }, [setMatch]);

  // Cards
  const updateCards = useCallback(
    (team: 1 | 2, type: 'yellow' | 'red', delta: number) => {
      setMatch((prev) => {
        const teamKey = team === 1 ? 'team1' : 'team2';
        const cardKey = type === 'yellow' ? 'yellowCards' : 'redCards';
        const current = prev[teamKey][cardKey];
        const nextCount = Math.max(0, current + delta);

        if (delta > 0 && prev.config.soundEnabled) {
          playWhistleSound();
        }

        return {
          ...prev,
          [teamKey]: {
            ...prev[teamKey],
            [cardKey]: nextCount,
          },
        };
      });
    },
    [setMatch]
  );

  // Config
  const updateConfig = useCallback(
    (updates: Partial<FootballScoreboardConfig>) => {
      setMatch((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          ...updates,
        },
      }));
    },
    [setMatch]
  );

  // Preset loading
  const loadPreset = useCallback(
    (key: string) => {
      const preset = FOOTBALL_PRESETS[key] || FOOTBALL_PRESETS.default;
      setMatch((prev) => ({
        ...prev,
        ...preset,
        time: {
          minutes: 0,
          seconds: 0,
          isRunning: false,
          stoppageTime: 0,
          period: '1H',
        },
        goals: [],
        activeAnimation: null,
      }));
    },
    [setMatch]
  );

  const resetMatch = useCallback(() => {
    setMatch({
      ...DEFAULT_FOOTBALL_MATCH,
      updatedAt: Date.now(),
    });
  }, [setMatch]);

  // Penalty Shootout Actions
  const togglePenalties = useCallback(
    (active?: boolean) => {
      setMatch((prev) => {
        const nextActive = active !== undefined ? active : !prev.penalties?.isActive;
        return {
          ...prev,
          time: {
            ...prev.time,
            period: nextActive ? 'PEN' : prev.time.period,
            isRunning: false,
          },
          penalties: {
            ...(prev.penalties || DEFAULT_PENALTIES),
            isActive: nextActive,
          },
        };
      });
    },
    [setMatch]
  );

  const calculatePenaltyWinner = (t1Kicks: PenaltyKickResult[], t2Kicks: PenaltyKickResult[]) => {
    const t1Goals = t1Kicks.filter((k) => k === 'goal').length;
    const t2Goals = t2Kicks.filter((k) => k === 'goal').length;
    const t1Taken = t1Kicks.filter((k) => k !== 'pending').length;
    const t2Taken = t2Kicks.filter((k) => k !== 'pending').length;

    if (t1Kicks.length <= 5) {
      const t1Remaining = 5 - t1Taken;
      const t2Remaining = 5 - t2Taken;

      if (t1Goals > t2Goals + t2Remaining) return 1;
      if (t2Goals > t1Goals + t1Remaining) return 2;

      if (t1Taken >= 5 && t2Taken >= 5) {
        if (t1Goals > t2Goals) return 1;
        if (t2Goals > t1Goals) return 2;
        return null;
      }
    } else {
      if (t1Taken === t2Taken && t1Taken > 5) {
        if (t1Goals > t2Goals) return 1;
        if (t2Goals > t1Goals) return 2;
      }
    }
    return null;
  };

  const recordPenaltyKick = useCallback(
    (team: 1 | 2, kickIndex: number, result: PenaltyKickResult) => {
      setMatch((prev) => {
        const pen = prev.penalties || DEFAULT_PENALTIES;
        const kicksKey = team === 1 ? 'team1Kicks' : 'team2Kicks';
        const updatedKicks = [...pen[kicksKey]];

        while (updatedKicks.length <= kickIndex) {
          updatedKicks.push('pending');
        }
        updatedKicks[kickIndex] = result;

        const otherKicks = team === 1 ? pen.team2Kicks : pen.team1Kicks;
        const t1K = team === 1 ? updatedKicks : otherKicks;
        const t2K = team === 2 ? updatedKicks : otherKicks;

        const t1Score = t1K.filter((k) => k === 'goal').length;
        const t2Score = t2K.filter((k) => k === 'goal').length;
        const winner = calculatePenaltyWinner(t1K, t2K);

        if (prev.config.soundEnabled) {
          if (result === 'goal') playGoalSound();
          else if (result === 'miss') playWhistleSound();
        }

        return {
          ...prev,
          penalties: {
            ...pen,
            isActive: true,
            [kicksKey]: updatedKicks,
            team1Score: t1Score,
            team2Score: t2Score,
            winner,
          },
          activeAnimation:
            result === 'goal'
              ? {
                  type: 'GOAL',
                  team,
                  teamName: `${team === 1 ? prev.team1.name : prev.team2.name} PENALTY!`,
                  playerName: `Kick #${kickIndex + 1} SCORED!`,
                  timestamp: Date.now(),
                }
              : prev.activeAnimation,
        };
      });
    },
    [setMatch]
  );

  const quickRecordNextPenalty = useCallback(
    (team: 1 | 2, result: 'goal' | 'miss') => {
      setMatch((prev) => {
        const pen = prev.penalties || DEFAULT_PENALTIES;
        const kicksKey = team === 1 ? 'team1Kicks' : 'team2Kicks';
        const currentKicks = pen[kicksKey];
        const nextIndex = currentKicks.findIndex((k) => k === 'pending');
        const targetIndex = nextIndex !== -1 ? nextIndex : currentKicks.length;

        const updatedKicks = [...currentKicks];
        while (updatedKicks.length <= targetIndex) {
          updatedKicks.push('pending');
        }
        updatedKicks[targetIndex] = result;

        const otherKey = team === 1 ? 'team2Kicks' : 'team1Kicks';
        const otherKicks = [...pen[otherKey]];
        while (otherKicks.length < updatedKicks.length) {
          otherKicks.push('pending');
        }

        const t1K = team === 1 ? updatedKicks : otherKicks;
        const t2K = team === 2 ? updatedKicks : otherKicks;
        const t1Score = t1K.filter((k) => k === 'goal').length;
        const t2Score = t2K.filter((k) => k === 'goal').length;
        const winner = calculatePenaltyWinner(t1K, t2K);

        if (prev.config.soundEnabled) {
          if (result === 'goal') playGoalSound();
          else if (result === 'miss') playWhistleSound();
        }

        return {
          ...prev,
          penalties: {
            ...pen,
            isActive: true,
            team1Kicks: t1K,
            team2Kicks: t2K,
            team1Score: t1Score,
            team2Score: t2Score,
            winner,
          },
          activeAnimation:
            result === 'goal'
              ? {
                  type: 'GOAL',
                  team,
                  teamName: `${team === 1 ? prev.team1.name : prev.team2.name} PENALTY!`,
                  playerName: `Kick #${targetIndex + 1} SCORED!`,
                  timestamp: Date.now(),
                }
              : prev.activeAnimation,
        };
      });
    },
    [setMatch]
  );

  const addSuddenDeathKick = useCallback(() => {
    setMatch((prev) => {
      const pen = prev.penalties || DEFAULT_PENALTIES;
      return {
        ...prev,
        penalties: {
          ...pen,
          isActive: true,
          team1Kicks: [...pen.team1Kicks, 'pending'],
          team2Kicks: [...pen.team2Kicks, 'pending'],
        },
      };
    });
  }, [setMatch]);

  const resetPenalties = useCallback(() => {
    setMatch((prev) => ({
      ...prev,
      penalties: DEFAULT_PENALTIES,
    }));
  }, [setMatch]);

  return (
    <FootballContext.Provider
      value={{
        match,
        setMatch,
        updateScore,
        setExactScore,
        updateTeam,
        toggleTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        adjustTimeMinutes,
        setPeriod,
        setStoppageTime,
        triggerGoal,
        triggerEvent,
        clearAnimation,
        updateCards,
        updateConfig,
        loadPreset,
        resetMatch,
        togglePenalties,
        recordPenaltyKick,
        quickRecordNextPenalty,
        addSuddenDeathKick,
        resetPenalties,
      }}
    >
      {children}
    </FootballContext.Provider>
  );
};

export const useFootball = (): FootballContextType => {
  const context = useContext(FootballContext);
  if (!context) {
    throw new Error('useFootball must be used within a FootballProvider');
  }
  return context;
};
