import React from 'react';
import { NavLink } from 'react-router-dom';
import { Radio, Trophy, Link as LinkIcon, Tv, SlidersHorizontal, Activity } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

import logoImg from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const { activeMatch, isSyncing } = useCricket();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <img
            src={logoImg}
            alt="IconicScorer"
            className="h-9 sm:h-10 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          />
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden sm:inline-block">
            v2.5
          </span>
        </NavLink>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink
            to="/tournament"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Tournament</span>
          </NavLink>

          <NavLink
            to="/links"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            <LinkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Scoreboard Links</span>
          </NavLink>

          <NavLink
            to={`/controller/${activeMatch.id}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Controller</span>
          </NavLink>
        </nav>

        {/* Right Actions: Quick Live Overlay */}
        <div className="flex items-center gap-2">
          {/* Live Sync Status */}
          <div
            title="Real-time BroadcastChannel Sync"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSyncing ? 'bg-amber-400 ring-4 ring-amber-400/30 animate-ping' : 'bg-emerald-400'
              }`}
            />
            <span className="font-mono text-[11px]">SYNC OK</span>
          </div>

          <a
            href={`/overlay/${activeMatch.id}?theme=cricpic`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-500/20 active:scale-95 transition"
          >
            <Tv className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Open Overlay</span>
          </a>
        </div>
      </div>
    </header>
  );
};
