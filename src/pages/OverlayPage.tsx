import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
import { OverlayTheme } from '../types/cricket';
import { CricPicTheme } from '../components/overlay/CricPicTheme';
import { AsiaCupTheme } from '../components/overlay/AsiaCupTheme';
import { CWC23Theme } from '../components/overlay/CWC23Theme';
import { IPLNeonTheme } from '../components/overlay/IPLNeonTheme';
import { EventRibbon } from '../components/overlay/EventRibbon';
import { BroadcastCards } from '../components/overlay/BroadcastCards';
import { Eye, EyeOff, Palette, Monitor } from 'lucide-react';

export const OverlayPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { matches, activeMatch, clearAnimation } = useCricket();

  const themeParam = (searchParams.get('theme') as OverlayTheme) || 'cricpic';
  const transparentParam = searchParams.get('transparent') !== 'false';

  // Toggle stadium background for browser testing
  const [showStadiumBg, setShowStadiumBg] = useState<boolean>(false);
  const [showTestBar, setShowTestBar] = useState<boolean>(true);

  // Match lookup
  const match = matches.find((m) => m.id === matchId) || activeMatch;

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
      {/* Subtle testing toolbar (auto hides on hover/timeout or can be toggled) */}
      <div
        className={`fixed top-4 left-4 z-50 transition-opacity duration-300 ${
          showTestBar ? 'opacity-90 hover:opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white shadow-2xl backdrop-blur-md">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 px-2 border-r border-slate-800">
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
            </select>
          </div>

          {/* Toggle Stadium Preview */}
          <button
            onClick={() => setShowStadiumBg((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition ${
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
            className="p-1 rounded-lg text-slate-400 hover:text-white"
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
          className="fixed top-2 left-2 z-50 p-1.5 rounded-full bg-slate-950/40 hover:bg-slate-950 text-slate-500 hover:text-cyan-400 transition"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Full-Screen & Pop-up Graphics */}
      <BroadcastCards match={match} />

      {/* Animated Event Ribbons (FOUR, SIX, WICKET, FREE HIT) */}
      <EventRibbon animation={match.activeAnimation} onComplete={clearAnimation} />

      {/* Spacer to push lower-third to bottom */}
      <div className="flex-1" />

      {/* Main Lower-Third Broadcast Strip */}
      <div className="w-full pb-8 z-20 flex justify-center">
        {renderTheme()}
      </div>
    </div>
  );
};
