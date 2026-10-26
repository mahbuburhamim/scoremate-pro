import React from 'react';
import { Link } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  Tv,
  SlidersHorizontal,
  Trophy,
  Link as LinkIcon,
  Sparkles,
  Zap,
  Layers,
  Crop,
  ShieldCheck,
  ChevronRight,
  Play,
  ArrowRight,
  Ticket,
  Calendar,
  User,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import logoImg from '../assets/logo.png';

export const DashboardPage: React.FC = () => {
  const { activeMatch, tournaments } = useCricket();
  const { user } = useAuth();
  const activeInning = activeMatch.innings[activeMatch.activeInningNumber - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Subscriber Welcome Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                <User className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl text-white">
                  Welcome, {user?.name || 'Broadcaster'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-[10px] font-black uppercase text-white tracking-wider shadow">
                  PRO SUBSCRIBER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Plan: <strong className="text-white">{user?.planName || 'Monthly v1'}</strong> • Valid until: <strong className="text-slate-300">{user?.planExpiryDate || 'Active'}</strong>
              </p>
            </div>
          </div>

          {/* Ticket Balance & Upgrade */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs">
              <Ticket className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Match Tickets:</span>
              <span className="font-mono font-bold text-white text-sm">
                {user?.ticketsRemaining ?? 15}
              </span>
            </div>

            <Link
              to="/payment"
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-fuchsia-300 border border-fuchsia-500/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Add Tickets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Broadcast Hub */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Quick Launch Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to={`/controller/${activeMatch.id}`}
            className="group p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 flex flex-col gap-3 shadow-xl transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Match Scorer Controller</h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time scoring, wicket management, player cropper, and undo history.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition">
              <span>Launch Controller</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <a
            href={`/overlay/${activeMatch.id}?theme=cricpic`}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border border-red-500/40 hover:border-red-400 flex flex-col gap-3 shadow-xl transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-black text-lg text-white">OBS Overlay Feed</h3>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                1920x1080 transparent alpha browser source ready for OBS Studio & vMix.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-red-400 group-hover:translate-x-1 transition">
              <span>Open in New Tab</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </a>

          <Link
            to="/links"
            className="group p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 hover:border-amber-400 flex flex-col gap-3 shadow-xl transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Scoreboard Links</h3>
              <p className="text-xs text-slate-400 mt-1">
                Copy direct overlay URLs for all 4 themes (CricPic, Asia Cup, CWC, IPL).
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition">
              <span>Get Overlay URLs</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/tournament"
            className="group p-5 rounded-3xl bg-gradient-to-br from-fuchsia-950/40 via-slate-900 to-slate-900 border border-fuchsia-500/40 hover:border-fuchsia-400 flex flex-col gap-3 shadow-xl transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white">Tournaments & Squads</h3>
              <p className="text-xs text-slate-400 mt-1">
                Create new tournaments, configure team squads, playing XIs, and overs.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-fuchsia-400 group-hover:translate-x-1 transition">
              <span>Manage Tournaments</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Active Match Card */}
        <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                CURRENT ACTIVE LIVE MATCH
              </span>
              <h2 className="font-heading font-black text-2xl text-white mt-1">
                {activeMatch.team1.name} vs {activeMatch.team2.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-300 font-mono">
                {activeMatch.venue || 'Stadium'} • {activeMatch.matchNo}
              </span>
              <Link
                to={`/controller/${activeMatch.id}`}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Open Controller</span>
              </Link>
            </div>
          </div>

          {/* Teams & Score Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-2">
            {/* Team 1 */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-heading font-black text-blue-400 text-lg">
                {activeMatch.team1.shortName || activeMatch.team1.name.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <span className="font-heading font-black text-xl text-white block">
                  {activeMatch.team1.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeMatch.team1.players.length} Players Squad
                </span>
              </div>
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-950 border border-cyan-500/30">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                INNINGS {activeMatch.activeInningNumber}
              </span>
              <div className="font-score text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 leading-none">
                {activeInning.totalRuns} - {activeInning.wickets}
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 mt-2">
                {activeInning.oversDisplay} / {activeMatch.overs} OVERS
              </span>
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-heading font-black text-emerald-400 text-lg">
                {activeMatch.team2.shortName || activeMatch.team2.name.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <span className="font-heading font-black text-xl text-white block">
                  {activeMatch.team2.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeMatch.team2.players.length} Players Squad
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Toss Decision: <strong className="text-white">{activeMatch.tossDecision.toUpperCase()}</strong></span>
            <span>Overs Limit: <strong className="text-white">{activeMatch.overs} Overs</strong></span>
            <span>DRS Reviews Available: <strong className="text-emerald-400">Yes</strong></span>
          </div>
        </div>

        {/* Broadcast Workflow & Compatibility Section (Exact Replica from Screenshot) */}
        <div className="mt-8 pt-10 border-t border-slate-800/80 flex flex-col gap-10">
          {/* Top: FITS YOUR BROADCAST WORKFLOW */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              FITS YOUR BROADCAST WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl text-white font-medium tracking-tight mt-1.5 font-sans">
              Bring your scoreboard into the tools you use.
            </h2>

            {/* 4 Tool Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* 1. vMix */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
                <div className="w-9 h-9 rounded-lg bg-[#001733] border border-blue-500/30 p-1.5 flex items-center justify-center shrink-0 shadow">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                    <span className="bg-sky-400 rounded-[1px]" />
                    <span className="bg-cyan-400 rounded-[1px]" />
                    <span className="bg-blue-500 rounded-[1px]" />
                    <span className="bg-teal-400 rounded-[1px]" />
                    <span className="bg-emerald-400 rounded-[1px]" />
                    <span className="bg-amber-400 rounded-[1px]" />
                    <span className="bg-orange-500 rounded-[1px]" />
                    <span className="bg-rose-500 rounded-[1px]" />
                    <span className="bg-fuchsia-500 rounded-[1px]" />
                  </div>
                </div>
                <span className="font-heading font-black text-lg text-white tracking-wide">
                  vMix
                </span>
              </div>

              {/* 2. OBS */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
                <div className="w-9 h-9 rounded-lg bg-black border border-slate-700 p-1.5 flex items-center justify-center shrink-0 shadow">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="6" />
                    <path d="M50 20 A30 30 0 0 1 80 50 A15 15 0 0 0 65 35 A15 15 0 0 0 50 20 Z" />
                    <path d="M80 50 A30 30 0 0 1 50 80 A15 15 0 0 0 50 65 A15 15 0 0 0 80 50 Z" />
                    <path d="M50 80 A30 30 0 0 1 20 50 A15 15 0 0 0 35 65 A15 15 0 0 0 50 80 Z" />
                    <circle cx="50" cy="50" r="8" fill="white" />
                  </svg>
                </div>
                <span className="font-heading font-black text-lg text-white tracking-wide">
                  OBS
                </span>
              </div>

              {/* 3. PRISM Live Studio */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
                <div className="w-9 h-9 rounded-lg bg-[#0e071e] border border-purple-500/30 p-1 flex items-center justify-center shrink-0 shadow">
                  <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="dashPrismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <polygon points="50,15 88,80 12,80" fill="none" stroke="url(#dashPrismGrad)" strokeWidth="8" strokeLinejoin="round" />
                    <polygon points="50,32 74,74 26,74" fill="none" stroke="url(#dashPrismGrad)" strokeWidth="6" strokeLinejoin="round" opacity="0.8" />
                    <polygon points="50,48 62,69 38,69" fill="url(#dashPrismGrad)" opacity="0.9" />
                  </svg>
                </div>
                <span className="font-heading font-black text-lg text-white tracking-wide">
                  PRISM Live Studio
                </span>
              </div>

              {/* 4. CameraFi Live */}
              <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#e11d48] to-[#fb7185] p-1 flex flex-col items-center justify-center shrink-0 shadow">
                  <div className="flex items-center gap-0.5 text-[7px] font-black text-white leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>LIVE</span>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white text-white mt-0.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4zm14 2.8 4-2.4v11.2l-4-2.4V8.8z" />
                  </svg>
                </div>
                <span className="font-heading font-black text-lg text-white tracking-wide">
                  CameraFi Live
                </span>
              </div>
            </div>
          </div>

          {/* Bottom: YOUR MATCH. YOUR BROADCAST. */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                YOUR MATCH. YOUR BROADCAST.
              </span>
              <h3 className="text-2xl sm:text-3xl text-white font-medium tracking-tight mt-1.5 font-sans">
                Make every over part of the show.
              </h3>
              <p className="text-sm text-slate-400 mt-1.5 font-normal">
                Create a tournament, score the match, and bring the live board into your stream.
              </p>
            </div>

            <Link
              to="/tournament"
              className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-heading font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/25 active:scale-95 transition shrink-0"
            >
              <span>Create a tournament</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
