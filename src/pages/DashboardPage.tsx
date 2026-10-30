import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
import { useAuth } from '../context/AuthContext';
import { SubscriptionCountdown } from '../components/SubscriptionCountdown';
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
  Plus,
  X,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { OversInput } from '../components/OversInput';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeMatch, tournaments, createMatch } = useCricket();
  const { user } = useAuth();
  const activeInning = activeMatch.innings[activeMatch.activeInningNumber - 1];

  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [team1Name, setTeam1Name] = useState('BANGLADESH');
  const [team2Name, setTeam2Name] = useState('ENGLAND');
  const [matchOvers, setMatchOvers] = useState(20);
  const [matchNo, setMatchNo] = useState('MATCH 1 • LIVE');
  const [tossWonBy, setTossWonBy] = useState<'team1' | 'team2'>('team1');
  const [optedTo, setOptedTo] = useState<'bat' | 'bowl'>('bat');

  const handleStartNewMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1Name.trim() || !team2Name.trim()) return;
    const tourId = tournaments[0]?.id || 'tour-default';
    const newMatch = createMatch({
      tournamentId: tourId,
      team1Name: team1Name.trim(),
      team2Name: team2Name.trim(),
      overs: Number(matchOvers) || 20,
      matchNo: matchNo.trim() || 'MATCH 1 • LIVE',
      tossWonBy,
      optedTo,
    });
    setShowCreateMatchModal(false);
    navigate(`/controller/${newMatch.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-sky-200/25 via-blue-100/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Top Subscriber Welcome Banner */}
      <section className="bg-white/80 border-b border-slate-200/80 backdrop-blur-xl py-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 p-0.5 shadow-md shadow-blue-500/15">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-blue-600">
                <User className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
                  Welcome, {user?.name || 'Broadcaster'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-[10px] font-black uppercase text-white tracking-wider shadow-sm">
                  PRO SUBSCRIBER
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-slate-500">
                  Plan: <strong className="text-slate-800">{user?.planName || '1 Day Pro'}</strong> • Valid until: <strong className="text-slate-700">{user?.planExpiryDate || 'Active'}</strong>
                </p>
                <SubscriptionCountdown compact />
              </div>
            </div>
          </div>

          {/* Ticket Balance & Upgrade */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 flex items-center gap-2 text-xs shadow-sm">
              <Ticket className="w-4 h-4 text-amber-500" />
              <span className="text-slate-500">Match Tickets:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {user?.ticketsRemaining ?? 15}
              </span>
            </div>

            <Link
              to="/payment"
              className="px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-xs font-bold text-blue-700 border border-sky-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Tickets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Broadcast Hub */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative z-10">
        {/* Quick Launch Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to={`/controller/${activeMatch.id}`}
            className="group p-5 rounded-3xl bg-white/90 border border-slate-200/80 hover:border-blue-400 hover:shadow-[0_15px_30px_rgba(2,132,199,0.1)] flex flex-col gap-3 shadow-sm transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition shadow-sm">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">Match Scorer Controller</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Real-time scoring, wicket management, player cropper, and undo history.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">
              <span>Launch Controller</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <a
            href={`/overlay/${activeMatch.id}?theme=cricpic${user?.overlayKey ? `&key=${user.overlayKey}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-3xl bg-white/90 border border-slate-200/80 hover:border-rose-400 hover:shadow-[0_15px_30px_rgba(244,63,94,0.1)] flex flex-col gap-3 shadow-sm transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition shadow-sm">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-black text-lg text-slate-900">OBS Overlay Feed</h3>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                1920x1080 transparent alpha browser source ready for OBS Studio & vMix.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition">
              <span>Open in New Tab</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </div>
          </a>

          <Link
            to="/links"
            className="group p-5 rounded-3xl bg-white/90 border border-slate-200/80 hover:border-amber-400 hover:shadow-[0_15px_30px_rgba(245,158,11,0.1)] flex flex-col gap-3 shadow-sm transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition shadow-sm">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">Scoreboard Links</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Copy direct overlay URLs for all 4 themes (CricPic, Asia Cup, CWC, IPL).
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-amber-600 group-hover:translate-x-1 transition">
              <span>Get Overlay URLs</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/tournament"
            className="group p-5 rounded-3xl bg-white/90 border border-slate-200/80 hover:border-purple-400 hover:shadow-[0_15px_30px_rgba(168,85,247,0.1)] flex flex-col gap-3 shadow-sm transition active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-slate-900">Tournaments & Squads</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Create new tournaments, configure team squads, playing XIs, and overs.
              </p>
            </div>
            <div className="mt-auto pt-2 flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition">
              <span>Manage Tournaments</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Active Match Card */}
        <div className="w-full rounded-3xl bg-white/95 border border-slate-200/90 p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,132,199,0.06)] backdrop-blur-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
            <div>
              <span className="flex items-center gap-2 font-bold text-emerald-600 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                CURRENT ACTIVE LIVE MATCH
              </span>
              <h2 className="font-heading font-black text-2xl text-slate-900 mt-1">
                {activeMatch.team1.name} vs {activeMatch.team2.name}
              </h2>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-mono font-semibold">
                {activeMatch.venue || 'Stadium'} • {activeMatch.matchNo}
              </span>
              <button
                onClick={() => setShowCreateMatchModal(true)}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Start New Match</span>
              </button>
              <Link
                to={`/controller/${activeMatch.id}`}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition shadow-md shadow-blue-500/20"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Open Controller</span>
              </Link>
            </div>
          </div>

          {/* Teams & Score Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-2">
            {/* Team 1 */}
            <div className="flex items-center gap-4 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center font-heading font-black text-blue-700 text-lg shadow-sm">
                {activeMatch.team1.shortName || activeMatch.team1.name.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <span className="font-heading font-black text-xl text-slate-900 block">
                  {activeMatch.team1.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeMatch.team1.players.length} Players Squad
                </span>
              </div>
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-sky-50/80 border border-sky-100 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest mb-1">
                INNINGS {activeMatch.activeInningNumber}
              </span>
              <div className="font-score text-5xl sm:text-6xl font-black text-blue-600 leading-none">
                {activeInning.totalRuns} - {activeInning.wickets}
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 mt-2">
                {activeInning.oversDisplay} / {activeMatch.overs} OVERS
              </span>
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-4 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center font-heading font-black text-emerald-700 text-lg shadow-sm">
                {activeMatch.team2.shortName || activeMatch.team2.name.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <span className="font-heading font-black text-xl text-slate-900 block">
                  {activeMatch.team2.name}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeMatch.team2.players.length} Players Squad
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
            <span>Toss Decision: <strong className="text-slate-800">{activeMatch.tossDecision.toUpperCase()}</strong></span>
            <span>Overs Limit: <strong className="text-slate-800">{activeMatch.overs} Overs</strong></span>
            <span>DRS Reviews Available: <strong className="text-emerald-600">Yes</strong></span>
          </div>
        </div>

        {/* Broadcast Workflow & Compatibility Section */}
        <div className="mt-8 pt-10 border-t border-slate-200/80 flex flex-col gap-10">
          {/* Top: FITS YOUR BROADCAST WORKFLOW */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest font-mono">
              FITS YOUR BROADCAST WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1.5 font-sans">
              Bring your scoreboard into the tools you use.
            </h2>

            {/* 4 Tool Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {/* 1. vMix */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center gap-3.5 shadow-sm transition">
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
                <span className="font-heading font-black text-lg text-slate-900 tracking-wide">
                  vMix
                </span>
              </div>

              {/* 2. OBS */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center gap-3.5 shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-black border border-slate-700 p-1.5 flex items-center justify-center shrink-0 shadow">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-white" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="6" />
                    <path d="M50 20 A30 30 0 0 1 80 50 A15 15 0 0 0 65 35 A15 15 0 0 0 50 20 Z" />
                    <path d="M80 50 A30 30 0 0 1 50 80 A15 15 0 0 0 50 65 A15 15 0 0 0 80 50 Z" />
                    <path d="M50 80 A30 30 0 0 1 20 50 A15 15 0 0 0 35 65 A15 15 0 0 0 50 80 Z" />
                    <circle cx="50" cy="50" r="8" fill="white" />
                  </svg>
                </div>
                <span className="font-heading font-black text-lg text-slate-900 tracking-wide">
                  OBS Studio
                </span>
              </div>

              {/* 3. PRISM Live Studio */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center gap-3.5 shadow-sm transition">
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
                <span className="font-heading font-black text-lg text-slate-900 tracking-wide">
                  PRISM Live Studio
                </span>
              </div>

              {/* 4. CameraFi Live */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center gap-3.5 shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#e11d48] to-[#fb7185] p-1 flex flex-col items-center justify-center shrink-0 shadow">
                  <div className="flex items-center gap-0.5 text-[7px] font-black text-white leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>LIVE</span>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white text-white mt-0.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4zm14 2.8 4-2.4v11.2l-4-2.4V8.8z" />
                  </svg>
                </div>
                <span className="font-heading font-black text-lg text-slate-900 tracking-wide">
                  CameraFi Live
                </span>
              </div>
            </div>
          </div>

          {/* Bottom: YOUR MATCH. YOUR BROADCAST. */}
          <div className="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                YOUR MATCH. YOUR BROADCAST.
              </span>
              <h3 className="text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight mt-1.5 font-sans">
                Make every over part of the show.
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 font-normal">
                Create a tournament, score the match, and bring the live board into your stream.
              </p>
            </div>

            <Link
              to="/tournament"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm flex items-center gap-2 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition shrink-0"
            >
              <span>Create a tournament</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CREATE NEW MATCH MODAL */}
      {showCreateMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-900">
                    Start a New Match
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Starts completely fresh at 0 - 0 (0.0 overs)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateMatchModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartNewMatch} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Team 1 Name
                  </label>
                  <input
                    type="text"
                    required
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    placeholder="e.g. BANGLADESH"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Team 2 Name
                  </label>
                  <input
                    type="text"
                    required
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    placeholder="e.g. ENGLAND"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Overs Limit
                  </label>
                  <OversInput value={matchOvers} onChange={setMatchOvers} />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Match Title / Round
                  </label>
                  <input
                    type="text"
                    value={matchNo}
                    onChange={(e) => setMatchNo(e.target.value)}
                    placeholder="e.g. MATCH 1 • LIVE"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Toss Won By
                  </label>
                  <select
                    value={tossWonBy}
                    onChange={(e) => setTossWonBy(e.target.value as 'team1' | 'team2')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  >
                    <option value="team1">{team1Name || 'Team 1'}</option>
                    <option value="team2">{team2Name || 'Team 2'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    Opted To
                  </label>
                  <select
                    value={optedTo}
                    onChange={(e) => setOptedTo(e.target.value as 'bat' | 'bowl')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  >
                    <option value="bat">Bat First</option>
                    <option value="bowl">Bowl First</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateMatchModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition"
                >
                  Create & Launch Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
