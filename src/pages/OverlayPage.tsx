import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
import { OverlayTheme } from '../types/cricket';
import { CricPicTheme } from '../components/overlay/CricPicTheme';
import { AsiaCupTheme } from '../components/overlay/AsiaCupTheme';
import { CWC23Theme } from '../components/overlay/CWC23Theme';
import { IPLNeonTheme } from '../components/overlay/IPLNeonTheme';
import { Special2023Theme } from '../components/overlay/Special2023Theme';
import { ILT20SpecialTheme } from '../components/overlay/ILT20SpecialTheme';
import { EventRibbon } from '../components/overlay/EventRibbon';
import { BroadcastCards } from '../components/overlay/BroadcastCards';
import { ResponsiveScoreboardWrapper } from '../components/ResponsiveScoreboardWrapper';
import { Eye, EyeOff, Palette, Monitor } from 'lucide-react';

export const OverlayPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { matches, activeMatch, clearAnimation, applySyncMatches } = useCricket();

  const themeParam = (searchParams.get('theme') as OverlayTheme) || 'cricpic';
  const transparentParam = searchParams.get('transparent') !== 'false';

  // Toggle stadium background for browser testing
  const [showStadiumBg, setShowStadiumBg] = useState<boolean>(false);
  const [showTestBar, setShowTestBar] = useState<boolean>(true);
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Direct match lookup state for immediate resolution from live SSE / API feeds
  const [directMatch, setDirectMatch] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'polling' | 'disconnected'>('polling');

  // Resolve match from payload and update direct state and context
  const resolveAndSet = React.useCallback(
    (list: any[], activeId?: string) => {
      if (!Array.isArray(list) || list.length === 0) return;
      let target: any = null;
      if (matchId && matchId !== 'active') {
        target = list.find((m) => m.id === matchId);
      } else {
        const idToUse = activeId || list[0]?.id;
        target = list.find((m) => m.id === idToUse) || list[0];
      }
      if (target) {
        setDirectMatch((prev: any) => {
          if (!prev || JSON.stringify(prev) !== JSON.stringify(target)) {
            return target;
          }
          return prev;
        });
        setSyncStatus('connected');
      }
      // Keep entire CricketContext updated
      if (applySyncMatches) {
        applySyncMatches(list, activeId);
      }
    },
    [matchId, applySyncMatches]
  );

  useEffect(() => {
    // 1. Initial resolution from matches context
    if (matches && matches.length > 0) {
      resolveAndSet(matches);
    }

    // 2. Direct Local SSE (/api/events) - instant zero-latency push for OBS Studio CEF
    let localSse: EventSource | null = null;
    try {
      localSse = new EventSource('/api/events');
      localSse.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed?.matches && Array.isArray(parsed.matches)) {
            resolveAndSet(parsed.matches, parsed.activeMatchId);
          }
        } catch {}
      };
      localSse.onopen = () => setSyncStatus('connected');
    } catch {}

    // 3. Direct Cloud SSE (ntfy.sh) - works across remote devices, live deployments & OBS
    let cloudSse: EventSource | null = null;
    try {
      cloudSse = new EventSource('https://ntfy.sh/scoremate_live_sync_v1/sse');
      cloudSse.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          const payload = typeof parsed.message === 'string' ? JSON.parse(parsed.message) : parsed;
          if (payload?.matches && Array.isArray(payload.matches)) {
            resolveAndSet(payload.matches, payload.activeMatchId);
          }
        } catch {}
      };
    } catch {}

    // 4. Fast polling fallback (checks local /api/match first with cache-buster)
    const pollTimer = setInterval(() => {
      fetch(`/api/match?_t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.matches && Array.isArray(data.matches)) {
            resolveAndSet(data.matches, data.activeMatchId);
          }
        })
        .catch(() => {
          // Cloud fallback with 1.2s timeout so sockets are never blocked
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 1200);
          fetch('https://ntfy.sh/scoremate_live_sync_v1/json?poll=1&since=1m', {
            signal: controller.signal,
          })
            .then((r) => r.text())
            .then((text) => {
              clearTimeout(timer);
              const lines = text.trim().split('\n');
              for (const line of lines) {
                try {
                  const data = JSON.parse(line);
                  if (data?.message) {
                    const payload = typeof data.message === 'string' ? JSON.parse(data.message) : data.message;
                    if (payload?.matches && Array.isArray(payload.matches)) {
                      resolveAndSet(payload.matches, payload.activeMatchId);
                    }
                  }
                } catch {}
              }
            })
            .catch(() => {
              clearTimeout(timer);
            });
        });
    }, 250);

    return () => {
      localSse?.close();
      cloudSse?.close();
      clearInterval(pollTimer);
    };
  }, [matchId, resolveAndSet]);

  // CRITICAL FIX FOR OBS: Direct live match takes precedence over stale context matches!
  const contextMatch = (matchId && matchId !== 'active')
    ? matches.find((m) => m.id === matchId)
    : activeMatch;

  const match = (() => {
    if (directMatch) {
      if (!matchId || matchId === 'active' || directMatch.id === matchId) {
        const directTime = directMatch.updatedAt || 0;
        const contextTime = contextMatch?.updatedAt || 0;
        if (directTime >= contextTime || !contextTime) {
          return directMatch;
        }
      }
    }
    return contextMatch || directMatch || activeMatch;
  })();

  // Set body background to transparent if transparentParam is true
  useEffect(() => {
    if (transparentParam && !showStadiumBg) {
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
  }, [transparentParam, showStadiumBg]);

  // Render Theme
  const renderTheme = () => {
    switch (themeParam) {
      case 'asiacup':
        return <AsiaCupTheme match={match} />;
      case 'cwc23':
        return <CWC23Theme match={match} />;
      case 'iplneon':
        return <IPLNeonTheme match={match} />;
      case 'special2023':
        return <Special2023Theme match={match} />;
      case 'ilt20special':
        return <ILT20SpecialTheme match={match} />;
      case 'cricpic':
      default:
        return <CricPicTheme match={match} />;
    }
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col justify-between ${
        showStadiumBg
          ? 'bg-[url("https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=2000&q=80")] bg-cover bg-center'
          : 'bg-transparent'
      }`}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Subtle testing toolbar (relocated to top-right corner, completely hidden inside iframes) */}
      {!isInsideIframe && (
        <>
          <div
            className={`fixed top-3 right-3 z-50 transition-opacity duration-300 ${
              showTestBar ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-950/90 border border-slate-700/80 text-xs text-white shadow-2xl backdrop-blur-md">
              {/* Live OBS Sync Status Badge */}
              <div className="flex items-center gap-1.5 px-2.5 border-r border-slate-800">
                <span
                  className={`w-2 h-2 rounded-full ${
                    syncStatus === 'connected'
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]'
                      : 'bg-amber-400'
                  }`}
                />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {syncStatus === 'connected' ? 'OBS LIVE' : 'SYNCING'}
                </span>
              </div>

              {/* Theme switcher */}
              <div className="flex items-center gap-1 px-2.5 border-r border-slate-800">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={themeParam}
                  onChange={(e) => {
                    searchParams.set('theme', e.target.value);
                    setSearchParams(searchParams);
                  }}
                  className="bg-transparent text-xs text-cyan-300 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="cricpic" className="bg-slate-900 text-white">
                    1. CricPic Cutout Pro
                  </option>
                  <option value="asiacup" className="bg-slate-900 text-white">
                    2. Asia Cup Classic
                  </option>
                  <option value="cwc23" className="bg-slate-900 text-white">
                    3. CWC 23 Gold Edition
                  </option>
                  <option value="iplneon" className="bg-slate-900 text-white">
                    4. IPL Cyber Neon
                  </option>
                  <option value="special2023" className="bg-slate-900 text-white">
                    5. 2023 Special
                  </option>
                  <option value="ilt20special" className="bg-slate-900 text-white">
                    6. ILT20 Special
                  </option>
                </select>
              </div>

              {/* Toggle Stadium Preview */}
              <button
                onClick={() => setShowStadiumBg((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition text-xs ${
                  showStadiumBg
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{showStadiumBg ? 'Stadium Preview: ON' : 'Stadium Preview: OFF'}</span>
              </button>

              {/* Hide Toolbar Button */}
              <button
                onClick={() => setShowTestBar(false)}
                title="Hide Testing Toolbar for clean OBS capture"
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating unhide button if testbar was hidden */}
          {!showTestBar && (
            <button
              onClick={() => setShowTestBar(true)}
              title="Show Overlay Testing Toolbar"
              className="fixed top-3 right-3 z-50 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-cyan-400 transition shadow-lg border border-slate-800"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </>
      )}

      {/* Full-Screen & Pop-up Graphics */}
      <BroadcastCards match={match} />

      {/* Animated Event Ribbons (FOUR, SIX, WICKET, FREE HIT) */}
      <EventRibbon animation={match.activeAnimation} onComplete={clearAnimation} />

      {/* Spacer to push lower-third to bottom */}
      <div className="flex-1" />

      {/* Main Lower-Third Broadcast Strip (Auto Responsive Scaling on Mobile & Desktop) */}
      <div className="w-full pb-4 sm:pb-8 z-20 flex justify-center items-end overflow-hidden">
        <ResponsiveScoreboardWrapper designWidth={1340}>
          {renderTheme()}
        </ResponsiveScoreboardWrapper>
      </div>
    </div>
  );
};
