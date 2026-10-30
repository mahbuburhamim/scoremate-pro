import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
import { OverlayTheme } from '../types/cricket';
import { isStaleMockMatch, createFreshInitialMatch } from '../utils/storage';
import { api } from '../utils/api';
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
  const { matches, activeMatch, clearAnimation } = useCricket();

  const themeParam = (searchParams.get('theme') as OverlayTheme) || 'cricpic';
  // Secret per-account key: the overlay shows only that account's matches
  const overlayKey = searchParams.get('key') || '';
  const [overlayError, setOverlayError] = useState<string>('');
  const transparentParam = searchParams.get('transparent') !== 'false';

  // Toggle stadium background for browser testing
  const [showStadiumBg, setShowStadiumBg] = useState<boolean>(false);
  const [showTestBar, setShowTestBar] = useState<boolean>(true);
  // Inside OBS (or ?obs=1 / ?clean=1) the testing toolbar must never render
  const isObs =
    searchParams.get('obs') === '1' ||
    searchParams.get('clean') === '1' ||
    (typeof window !== 'undefined' && (window as any).obsstudio !== undefined);
  const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Direct match lookup state for immediate resolution from live SSE / API feeds
  const [directMatch, setDirectMatch] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'polling' | 'disconnected'>('polling');

  // Resolve match from payload and update direct state and context
  const resolveAndSet = React.useCallback(
    (list: any[], activeId?: string, singleTarget?: any) => {
      let target: any = singleTarget && !isStaleMockMatch(singleTarget) ? singleTarget : null;
      if (!target && Array.isArray(list) && list.length > 0) {
        const cleanList = list.filter((m) => !isStaleMockMatch(m));
        if (matchId && matchId !== 'active') {
          target = cleanList.find((m) => m.id === matchId);
        } else {
          const idToUse = activeId || cleanList[0]?.id;
          target = cleanList.find((m) => m.id === idToUse) || cleanList[0];
        }
      }
      if (target && !isStaleMockMatch(target)) {
        setDirectMatch((prev: any) => {
          if (!prev || JSON.stringify(prev) !== JSON.stringify(target)) {
            return target;
          }
          return prev;
        });
        setSyncStatus('connected');
      }
    },
    [matchId]
  );

  useEffect(() => {
    // 1. No key (same-browser preview): use this browser's own matches.
    //    With a key the overlay must never show local data, only the key owner's.
    if (!overlayKey && matches && matches.length > 0) {
      resolveAndSet(matches);
    }

    // 2. With a key: poll the owner's data (works in OBS on any computer).
    //    Without a key: same-browser preview from the logged-in context only.
    if (!overlayKey) return;
    let cancelled = false;
    let lastTs = 0;
    const poll = async () => {
      const res = await api.getOverlay(overlayKey, 'cricket', lastTs);
      if (cancelled) return;
      if (!res.ok) {
        setSyncStatus('disconnected');
        setOverlayError(res.data?.error === 'subscription_expired' ? 'expired' : res.status === 404 ? 'invalid' : '');
        return;
      }
      setOverlayError('');
      if (res.status === 204) {
        setSyncStatus('connected');
        return;
      }
      if (res.data?.updatedAt) lastTs = res.data.updatedAt;
      const d = res.data?.data;
      if (d?.matches && Array.isArray(d.matches)) {
        resolveAndSet(d.matches, d.activeMatchId);
      }
    };
    poll();
    const pollTimer = setInterval(poll, 400);

    return () => {
      cancelled = true;
      clearInterval(pollTimer);
    };
  }, [matchId, resolveAndSet, overlayKey]);

  // CRITICAL FIX FOR OBS: Direct live match takes precedence over stale context matches!
  const contextMatch = (matchId && matchId !== 'active')
    ? matches.find((m) => m.id === matchId)
    : activeMatch;

  const contextOrFallbackMatch = (() => {
    if (directMatch && !isStaleMockMatch(directMatch)) {
      if (!matchId || matchId === 'active' || directMatch.id === matchId) {
        const directTime = directMatch.updatedAt || 0;
        const contextTime = contextMatch?.updatedAt || 0;
        if (directTime >= contextTime || !contextTime) {
          return directMatch;
        }
      }
    }
    if (contextMatch && !isStaleMockMatch(contextMatch)) {
      return contextMatch;
    }
    if (directMatch && !isStaleMockMatch(directMatch)) {
      return directMatch;
    }
    if (activeMatch && !isStaleMockMatch(activeMatch)) {
      return activeMatch;
    }
    return createFreshInitialMatch();
  })();

  // Keyed overlay (OBS): show only the owner's data, and nothing at all until it arrives,
  // so the stream never flashes a placeholder scoreboard.
  const keyedMatch = directMatch && !isStaleMockMatch(directMatch) ? directMatch : null;
  const showScoreboard = !overlayKey || !!keyedMatch;
  const match = overlayKey ? keyedMatch || contextOrFallbackMatch : contextOrFallbackMatch;

  // Animations in keyed mode are dismissed locally; the overlay never writes data back
  const [dismissedAnimId, setDismissedAnimId] = useState<string | null>(null);
  const visibleAnimation =
    overlayKey && match.activeAnimation?.id === dismissedAnimId ? null : match.activeAnimation;
  const handleAnimationDone = () => {
    if (overlayKey) setDismissedAnimId(match.activeAnimation?.id || null);
    else clearAnimation();
  };

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
      {!isInsideIframe && !isObs && (
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

      {/* Keyed link problems are shown only in a normal browser, never on stream */}
      {overlayKey && overlayError && !isObs && (
        <div className="fixed top-16 right-3 z-50 max-w-xs p-3 rounded-xl bg-red-950/90 border border-red-700 text-red-100 text-xs font-bold">
          {overlayError === 'expired'
            ? 'এই overlay link এর account এর subscription শেষ হয়ে গেছে।'
            : 'Overlay link টি সঠিক নয়। Links পেজ থেকে নতুন link কপি করুন।'}
        </div>
      )}

      {showScoreboard && (
        <>
          {/* Full-Screen & Pop-up Graphics */}
          <BroadcastCards match={match} />

          {/* Animated Event Ribbons (FOUR, SIX, WICKET, FREE HIT) */}
          <EventRibbon animation={visibleAnimation} onComplete={handleAnimationDone} />

          {/* Spacer to push lower-third to bottom */}
          <div className="flex-1" />

          {/* Main Lower-Third Broadcast Strip (Auto Responsive Scaling on Mobile & Desktop) */}
          <div className="w-full pb-4 sm:pb-8 z-20 flex justify-center items-end overflow-hidden">
            <ResponsiveScoreboardWrapper designWidth={1340}>
              {renderTheme()}
            </ResponsiveScoreboardWrapper>
          </div>
        </>
      )}
    </div>
  );
};
