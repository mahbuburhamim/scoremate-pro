import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFootball } from '../context/FootballContext';
import { FootballMatch } from '../types/football';
import { FootballScoreboardGraphic } from '../components/football/FootballScoreboardGraphic';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import { Eye, EyeOff, Monitor, Sparkles, Sliders, Volume2, VolumeX } from 'lucide-react';

const SYNC_CHANNEL_NAME = 'footscore_live_sync';
const STORAGE_KEY = 'footscore_active_match';

export const FootballOverlayPage: React.FC = () => {
  const { match: contextMatch, clearAnimation, updateConfig, setMatch } = useFootball();
  const [searchParams] = useSearchParams();
  // Secret per-account key: shows only that account's football match
  const overlayKey = searchParams.get('key') || '';
  const [overlayError, setOverlayError] = useState<string>('');

  // Direct live match state from SSE / API feeds (bypasses isolated CEF sandboxes)
  const [directMatch, setDirectMatch] = useState<FootballMatch | null>(null);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'polling'>('polling');

  // Test bar & stadium background states
  const isObs =
    searchParams.get('obs') === '1' ||
    searchParams.get('clean') === '1' ||
    (typeof window !== 'undefined' && (window as any).obsstudio !== undefined);

  const [showStadiumBg, setShowStadiumBg] = useState<boolean>(false);
  const [showTestBar, setShowTestBar] = useState<boolean>(!isObs);
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Window size for scaling 1920x1080 canvas
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute 1920x1080 scale factor
  // In OBS at 1920x1080, scale is exactly 1.0!
  const scale = Math.min(dimensions.width / 1920, dimensions.height / 1080, 1.0);

  // Set transparent background for OBS
  useEffect(() => {
    if (!showStadiumBg) {
      document.body.style.backgroundColor = 'transparent';
      document.documentElement.style.backgroundColor = 'transparent';
    } else {
      document.body.style.backgroundColor = '#020617';
      document.documentElement.style.backgroundColor = '#020617';
    }

    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [showStadiumBg]);

  // Handle incoming match update from SSE, Polling, or BroadcastChannel
  const handleIncomingMatch = useCallback(
    (incoming: FootballMatch) => {
      if (!incoming || !incoming.team1 || !incoming.team2) return;
      setDirectMatch((prev) => {
        if (!prev || JSON.stringify(prev) !== JSON.stringify(incoming)) {
          return incoming;
        }
        return prev;
      });
      setSyncStatus('connected');
    },
    []
  );

  // =========================================================================
  // ZERO-LATENCY OBS LIVE SYNCHRONIZATION ENGINE (SSE + 250ms POLLING + BROADCAST)
  // =========================================================================
  useEffect(() => {
    // 1. With a key: poll the owner's data (works in OBS on any computer)
    let cancelled = false;
    let lastTs = 0;
    let pollTimer: ReturnType<typeof setInterval> | null = null;
    if (overlayKey) {
      const poll = async () => {
        const res = await api.getOverlay(overlayKey, 'football', lastTs);
        if (cancelled) return;
        if (!res.ok) {
          setSyncStatus('polling');
          setOverlayError(res.data?.error === 'subscription_expired' ? 'expired' : res.status === 404 ? 'invalid' : '');
          return;
        }
        setOverlayError('');
        if (res.status === 204) {
          setSyncStatus('connected');
          return;
        }
        if (res.data?.updatedAt) lastTs = res.data.updatedAt;
        const fm = res.data?.data?.footballMatch;
        if (fm) handleIncomingMatch(fm);
      };
      poll();
      pollTimer = setInterval(poll, 400);
    }

    // 3. BroadcastChannel for same-device cross-tab sync
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type === 'MATCH_UPDATE' && event.data?.match) {
            handleIncomingMatch(event.data.match);
          }
        };
      }
    } catch {}

    // 4. LocalStorage storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.team1 && parsed.team2) {
            handleIncomingMatch(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      channel?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [handleIncomingMatch, overlayKey]);

  // Keyed (OBS) mode shows only the owner's data; nothing until it arrives
  const match = directMatch || contextMatch;
  const showScoreboard = !overlayKey || !!directMatch;

  // Goal celebration effects
  const lastAnimationRef = useRef<number>(0);
  useEffect(() => {
    if (
      match.activeAnimation?.type === 'GOAL' &&
      match.activeAnimation.timestamp !== lastAnimationRef.current
    ) {
      lastAnimationRef.current = match.activeAnimation.timestamp;

      // Confetti burst for goal celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { x: 0.25, y: 0.2 },
          colors:
            match.activeAnimation.team === 1
              ? ['#00d2ff', '#1d63ff', '#ffffff', '#ffd700']
              : ['#ff1744', '#ff5252', '#ffffff', '#ffd700'],
        });
      } catch {}

      // Auto clear animation after 6.5s
      const timer = setTimeout(() => {
        clearAnimation();
      }, 6500);

      return () => clearTimeout(timer);
    }
  }, [match.activeAnimation, clearAnimation]);

  // Position coordinates in 1920x1080 canvas
  const config = match.config;
  const offsetX = config.offsetX ?? 50;
  const offsetY = config.offsetY ?? 40;

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col items-start ${
        showStadiumBg
          ? 'bg-gradient-to-b from-[#06180a] via-[#0d3816] to-[#041207]'
          : 'bg-transparent'
      }`}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Stadium Pitch Simulation Graphic when Pitch Preview is ON */}
      {showStadiumBg && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2400&q=80")',
            }}
          />
          {/* Pitch lines & floodlight overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 1920 1080">
            <line x1="960" y1="0" x2="960" y2="1080" stroke="#ffffff" strokeWidth="4" />
            <circle cx="960" cy="540" r="180" fill="none" stroke="#ffffff" strokeWidth="4" />
            <circle cx="960" cy="540" r="6" fill="#ffffff" />
            <rect x="0" y="270" width="320" height="540" fill="none" stroke="#ffffff" strokeWidth="4" />
            <rect x="1600" y="270" width="320" height="540" fill="none" stroke="#ffffff" strokeWidth="4" />
          </svg>
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyan-400/15 rounded-full blur-[140px]" />
          <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
        </div>
      )}

      {/* Subtle OBS / Testing control pill in top-right (hidden in iframe) */}
      {!isInsideIframe && !isObs && (
        <>
          <div
            className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${
              showTestBar ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-full bg-slate-950/90 border border-slate-700/80 text-xs text-white shadow-2xl backdrop-blur-md">
              {/* OBS Live Sync Status Badge */}
              <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    syncStatus === 'connected'
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {syncStatus === 'connected' ? 'OBS LIVE' : 'SYNCING'}
                </span>
              </div>

              {/* Stadium Background Toggle */}
              <button
                onClick={() => setShowStadiumBg((prev) => !prev)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold transition text-xs ${
                  showStadiumBg
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{showStadiumBg ? 'Pitch: ON' : 'Pitch: OFF'}</span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
                className="p-1 rounded-full text-slate-300 hover:text-white"
                title={config.soundEnabled ? 'Goal Sound: ON' : 'Goal Sound: OFF'}
              >
                {config.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {/* Hide Button */}
              <button
                onClick={() => setShowTestBar(false)}
                title="Hide Testing Toolbar for clean OBS capture"
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!showTestBar && (
            <button
              onClick={() => setShowTestBar(true)}
              title="Show Overlay Testing Toolbar"
              className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-slate-400 hover:text-cyan-400 transition shadow-lg border border-slate-800"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 1920x1080 VIRTUAL BROADCAST CANVAS CONTAINER */}
      {/* ========================================================================= */}
      <div
        className="relative pointer-events-none"
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Scoreboard stationed at TOP-LEFT (User requirement: "I want it top left side. 1920x1080") */}
        <div
          className="absolute transition-all duration-300"
          style={{
            top: `${offsetY}px`,
            left: `${offsetX}px`,
            transform: `scale(${config.scale || 1.0})`,
            transformOrigin: 'top left',
          }}
        >
          {showScoreboard && <FootballScoreboardGraphic match={match} />}
          {overlayKey && overlayError && !isObs && (
            <div className="mt-4 max-w-xs p-3 rounded-xl bg-red-950/90 border border-red-700 text-red-100 text-xs font-bold">
              {overlayError === 'expired'
                ? 'এই overlay link এর account এর subscription শেষ হয়ে গেছে।'
                : 'Overlay link টি সঠিক নয়। Links পেজ থেকে নতুন link কপি করুন।'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
