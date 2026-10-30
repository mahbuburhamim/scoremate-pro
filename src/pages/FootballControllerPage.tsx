import React, { useState } from 'react';
import { useFootball, FOOTBALL_PRESETS } from '../context/FootballContext';
import { useAuth } from '../context/AuthContext';
import { FootballPeriod } from '../types/football';
import { FootballScoreboardGraphic } from '../components/football/FootballScoreboardGraphic';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Tv,
  Clock,
  Shield,
  Layers,
  Sliders,
  Award,
  RefreshCw,
  Monitor,
} from 'lucide-react';

export const FootballControllerPage: React.FC = () => {
  const {
    match,
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
  } = useFootball();

  const [copied, setCopied] = useState(false);
  const [goalPlayerName, setGoalPlayerName] = useState('');
  const [previewStadium, setPreviewStadium] = useState(false);

  // Compute Overlay URL
  const { user } = useAuth();
  const overlayPath = `/overlay/football${user?.overlayKey ? `?key=${user.overlayKey}` : ''}`;
  const overlayUrl = typeof window !== 'undefined' ? `${window.location.origin}${overlayPath}` : overlayPath;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const { team1, team2, time, config } = match;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-blue-600 selection:text-white">
      {/* Top Controller Header Bar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-xl">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-wide">
                  Football Scoreboard Controller
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1920x1080 Top-Left Esports Broadcast Overlay
              </p>
            </div>
          </div>

          {/* Quick OBS Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyUrl}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied OBS URL!' : 'Copy OBS Browser Source URL'}</span>
            </button>

            <a
              href={overlayPath}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Overlay</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ========================================================================= */}
        {/* 1. LIVE SCOREBOARD VISUAL PREVIEW */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-3 bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                Live Broadcast Graphic Preview (1920x1080 Top-Left Stationed)
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewStadium((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  previewStadium
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{previewStadium ? 'Pitch Simulation: ON' : 'Transparent Mode'}</span>
              </button>
            </div>
          </div>

          <div
            className={`p-8 flex justify-center items-center overflow-x-auto min-h-[220px] transition-colors ${
              previewStadium
                ? 'bg-[url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2400&q=80")] bg-cover bg-center'
                : 'bg-slate-950/95 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
            }`}
          >
            <div className="transform scale-90 sm:scale-100 transition-transform">
              <FootballScoreboardGraphic match={match} />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MATCH CLOCK & PERIOD CONTROLLER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Clock Card */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Match Clock & Timer Engine
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    time.isRunning
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {time.isRunning ? 'Clock Running' : 'Clock Paused'}
                </span>
              </div>
            </div>

            {/* Huge Clock Digit Display */}
            <div className="flex items-center justify-center my-2 py-4 px-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
              <span className="font-mono text-5xl sm:text-7xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
              </span>
              {time.stoppageTime > 0 && (
                <span className="ml-4 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-2xl shadow-lg">
                  +{time.stoppageTime}'
                </span>
              )}
            </div>

            {/* Timer Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <button
                onClick={toggleTimer}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition shadow-lg ${
                  time.isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {time.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{time.isRunning ? 'Pause Clock' : 'Start Clock'}</span>
              </button>

              <button
                onClick={() => adjustTimeMinutes(1)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 1 Min
              </button>

              <button
                onClick={() => adjustTimeMinutes(5)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 5 Min
              </button>

              <button
                onClick={() => resetTimer(0, 0)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 font-bold text-xs border border-slate-700 hover:border-rose-700 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset (00:00)
              </button>
            </div>
          </div>

          {/* Periods & Stoppage Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Match Period
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: '1H', label: '1st Half (00:00)' },
                    { id: 'HT', label: 'Half Time (45:00)' },
                    { id: '2H', label: '2nd Half (45:00)' },
                    { id: 'ET1', label: 'Extra Time (90:00)' },
                    { id: 'PEN', label: 'Penalties' },
                    { id: 'FT', label: 'Full Time (90:00)' },
                  ] as { id: FootballPeriod; label: string }[]
                ).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition text-left ${
                      time.period === p.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Stoppage Time (Extra Minutes)
              </h4>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((min) => (
                  <button
                    key={min}
                    onClick={() => setStoppageTime(min)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition ${
                      time.stoppageTime === min
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {min === 0 ? 'None' : `+${min}'`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DUAL TEAM SCORE & CARD CONTROLS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TEAM 1 (BLUE WING) */}
          <div className="rounded-2xl border-2 border-blue-500/40 bg-gradient-to-b from-blue-950/40 to-slate-900/90 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]" />
                <h3 className="text-base font-black uppercase tracking-wider text-cyan-300">
                  Team 1 (Left Wing)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">Blue Theme</span>
            </div>

            {/* Team 1 Score Action */}
            <div className="flex items-center justify-between bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 mb-5">
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold">Goals</span>
                <div className="text-5xl font-black text-white">{team1.score}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateScore(1, -1)}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-lg transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateScore(1, 1)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 transition hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  <span>+1 GOAL!</span>
                </button>
              </div>
            </div>

            {/* Team 1 Name Edit */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Team Name (Appears on Scoreboard)
                </label>
                <input
                  type="text"
                  value={team1.name}
                  onChange={(e) => updateTeam(1, { name: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 px-3.5 py-2 rounded-xl text-white font-bold tracking-wide focus:outline-none"
                  placeholder="TEAM 1"
                />
              </div>

              {/* Cards row */}
              <div className="pt-2 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-5 rounded-xs bg-amber-400 shadow inline-block" />
                  <span className="text-xs font-bold text-slate-300">Yellow: {team1.yellowCards}</span>
                  <button
                    onClick={() => updateCards(1, 'yellow', 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateCards(1, 'yellow', -1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-5 rounded-xs bg-rose-600 shadow inline-block" />
                  <span className="text-xs font-bold text-slate-300">Red: {team1.redCards}</span>
                  <button
                    onClick={() => updateCards(1, 'red', 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateCards(1, 'red', -1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TEAM 2 (RED WING) */}
          <div className="rounded-2xl border-2 border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-slate-900/90 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-400" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#ff1744]" />
                <h3 className="text-base font-black uppercase tracking-wider text-rose-300">
                  Team 2 (Right Wing)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">Red Theme</span>
            </div>

            {/* Team 2 Score Action */}
            <div className="flex items-center justify-between bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 mb-5">
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold">Goals</span>
                <div className="text-5xl font-black text-white">{team2.score}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateScore(2, -1)}
                  className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-lg transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateScore(2, 1)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-rose-500/30 transition hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  <span>+1 GOAL!</span>
                </button>
              </div>
            </div>

            {/* Team 2 Name Edit */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Team Name (Appears on Scoreboard)
                </label>
                <input
                  type="text"
                  value={team2.name}
                  onChange={(e) => updateTeam(2, { name: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-rose-400 px-3.5 py-2 rounded-xl text-white font-bold tracking-wide focus:outline-none"
                  placeholder="TEAM 2"
                />
              </div>

              {/* Cards row */}
              <div className="pt-2 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-5 rounded-xs bg-amber-400 shadow inline-block" />
                  <span className="text-xs font-bold text-slate-300">Yellow: {team2.yellowCards}</span>
                  <button
                    onClick={() => updateCards(2, 'yellow', 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateCards(2, 'yellow', -1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-5 rounded-xs bg-rose-600 shadow inline-block" />
                  <span className="text-xs font-bold text-slate-300">Red: {team2.redCards}</span>
                  <button
                    onClick={() => updateCards(2, 'red', 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => updateCards(2, 'red', -1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MATCH EVENT TRIGGERS & CELEBRATION ENGINE */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Interactive Broadcast Celebrations & Event Triggers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                Goal Scorer Player Name (Optional banner announcement)
              </label>
              <input
                type="text"
                value={goalPlayerName}
                onChange={(e) => setGoalPlayerName(e.target.value)}
                placeholder="e.g. Haaland 24' or Messi 68'"
                className="w-full bg-slate-950 border border-slate-700 px-3.5 py-2 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearAnimation}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
              >
                Clear Active Animation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => triggerGoal(1, goalPlayerName || `${team1.name} GOAL!`)}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>⚽ {team1.name} GOAL!</span>
            </button>

            <button
              onClick={() => triggerGoal(2, goalPlayerName || `${team2.name} GOAL!`)}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>⚽ {team2.name} GOAL!</span>
            </button>

            <button
              onClick={() => triggerEvent('YELLOW_CARD', 1, `${team1.name} Yellow Card`)}
              className="py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>🟨 Yellow Card Trigger</span>
            </button>

            <button
              onClick={() => triggerEvent('RED_CARD', 2, `${team2.name} Red Card`)}
              className="py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>🟥 Red Card Trigger</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. PENALTY SHOOTOUT (PSO) CONTROL CENTER (SLIDE-DOWN TRAY ENGINE)         */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500" />

          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xl shadow-lg">
                🎯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase tracking-wider text-white">
                    Penalty Shootout Control Center
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      match.penalties?.isActive
                        ? 'bg-amber-500 text-slate-950 animate-pulse shadow-[0_0_8px_#f59e0b]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {match.penalties?.isActive ? 'Tray Active on Screen' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Slide-Down Futuristic Shootout Tray (ড্রপডাউন প্যানেল) লাইভ ব্রডকাস্ট কন্ট্রোল
                </p>
              </div>
            </div>

            {/* Toggle & Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => togglePenalties()}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg ${
                  match.penalties?.isActive
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
                }`}
              >
                {match.penalties?.isActive ? 'Hide Shootout Tray' : 'Show Shootout Tray'}
              </button>

              <button
                onClick={addSuddenDeathKick}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
                title="Add 1 more kick slot for sudden death"
              >
                + Sudden Death Kick
              </button>

              <button
                onClick={resetPenalties}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700 transition"
                title="Reset all penalty kicks"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shootout Score Display */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
            <div className="text-center flex-1">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                {team1.name}
              </span>
              <div className="text-4xl font-black text-white font-mono mt-0.5">
                {match.penalties?.team1Score ?? 0}
              </div>
            </div>

            <div className="flex flex-col items-center px-6 border-x border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                SHOOTOUT SCORE
              </span>
              <span className="text-xs text-slate-400 mt-1">
                {match.penalties?.winner
                  ? `🏆 ${match.penalties.winner === 1 ? team1.name : team2.name} Wins!`
                  : 'In Progress'}
              </span>
            </div>

            <div className="text-center flex-1">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                {team2.name}
              </span>
              <div className="text-4xl font-black text-white font-mono mt-0.5">
                {match.penalties?.team2Score ?? 0}
              </div>
            </div>
          </div>

          {/* Dual Team Kicks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 Penalty Kicks */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-cyan-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  {team1.name} Kicks
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => quickRecordNextPenalty(1, 'goal')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow transition"
                  >
                    + Goal (✓)
                  </button>
                  <button
                    onClick={() => quickRecordNextPenalty(1, 'miss')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow transition"
                  >
                    + Miss (✕)
                  </button>
                </div>
              </div>

              {/* Slot list */}
              <div className="grid grid-cols-5 gap-2">
                {(match.penalties?.team1Kicks || ['pending', 'pending', 'pending', 'pending', 'pending']).map(
                  (kick, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <span className="text-[10px] text-slate-400 font-bold">Kick #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const nextState =
                            kick === 'pending' ? 'goal' : kick === 'goal' ? 'miss' : 'pending';
                          recordPenaltyKick(1, idx, nextState);
                        }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all ${
                          kick === 'goal'
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10b981]'
                            : kick === 'miss'
                            ? 'bg-rose-600 text-white shadow-[0_0_10px_#ef4444]'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                        title="Click to toggle: Goal -> Miss -> Pending"
                      >
                        {kick === 'goal' ? '✓' : kick === 'miss' ? '✕' : '-'}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Team 2 Penalty Kicks */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-rose-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  {team2.name} Kicks
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => quickRecordNextPenalty(2, 'goal')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow transition"
                  >
                    + Goal (✓)
                  </button>
                  <button
                    onClick={() => quickRecordNextPenalty(2, 'miss')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow transition"
                  >
                    + Miss (✕)
                  </button>
                </div>
              </div>

              {/* Slot list */}
              <div className="grid grid-cols-5 gap-2">
                {(match.penalties?.team2Kicks || ['pending', 'pending', 'pending', 'pending', 'pending']).map(
                  (kick, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <span className="text-[10px] text-slate-400 font-bold">Kick #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const nextState =
                            kick === 'pending' ? 'goal' : kick === 'goal' ? 'miss' : 'pending';
                          recordPenaltyKick(2, idx, nextState);
                        }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-all ${
                          kick === 'goal'
                            ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10b981]'
                            : kick === 'miss'
                            ? 'bg-rose-600 text-white shadow-[0_0_10px_#ef4444]'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                        title="Click to toggle: Goal -> Miss -> Pending"
                      >
                        {kick === 'goal' ? '✓' : kick === 'miss' ? '✕' : '-'}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. 1920x1080 TOP-LEFT POSITION & OVERLAY CONFIGURATION */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                1920x1080 Placement & Margin Settings
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Preset Position on 1920x1080 Screen
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'top-left', label: 'Top-Left (Default)' },
                    { id: 'top-center', label: 'Top-Center' },
                    { id: 'top-right', label: 'Top-Right' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() =>
                        updateConfig({
                          position: pos.id as any,
                          offsetX: pos.id === 'top-left' ? 50 : pos.id === 'top-center' ? 480 : 910,
                        })
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                        config.position === pos.id
                          ? 'bg-blue-600 text-white shadow font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                    Left Offset (X): {config.offsetX}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="900"
                    step="10"
                    value={config.offsetX}
                    onChange={(e) => updateConfig({ offsetX: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                    Top Offset (Y): {config.offsetY}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="400"
                    step="10"
                    value={config.offsetY}
                    onChange={(e) => updateConfig({ offsetY: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Scale: {Math.round((config.scale || 1.0) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={config.scale || 1.0}
                  onChange={(e) => updateConfig({ scale: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Matchup Presets & Reset */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Quick Team Presets
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => loadPreset('default')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700 hover:border-cyan-400"
                >
                  <span className="block text-xs font-black text-white">1. Demo Graphic Preset</span>
                  <span className="text-[11px] text-slate-400">TEAM 1 (Blue) vs TEAM 2 (Red)</span>
                </button>

                <button
                  onClick={() => loadPreset('elclasico')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700 hover:border-cyan-400"
                >
                  <span className="block text-xs font-black text-white">2. El Clásico</span>
                  <span className="text-[11px] text-slate-400">REAL MADRID vs BARCELONA</span>
                </button>

                <button
                  onClick={() => loadPreset('premLeague')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700 hover:border-cyan-400"
                >
                  <span className="block text-xs font-black text-white">3. Premier League</span>
                  <span className="text-[11px] text-slate-400">MAN CITY vs ARSENAL</span>
                </button>

                <button
                  onClick={() => loadPreset('worldCup')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left transition border border-slate-700 hover:border-cyan-400"
                >
                  <span className="block text-xs font-black text-white">4. World Cup Final</span>
                  <span className="text-[11px] text-slate-400">ARGENTINA vs BRAZIL</span>
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Reset match score, timer, and cards</span>
              <button
                onClick={resetMatch}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Match</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. OBS STUDIO SETUP GUIDE CARD */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-cyan-400" />
                OBS Studio / vMix Setup Instructions (1920x1080)
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                In OBS Studio, add a <strong className="text-white">Browser Source</strong>. Set Width to <strong className="text-cyan-300">1920</strong> and Height to <strong className="text-cyan-300">1080</strong>. Paste the overlay URL. The scoreboard will automatically render transparently at the top-left corner, exactly as configured!
              </p>
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied URL!' : 'Copy 1920x1080 OBS Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
