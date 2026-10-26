import React from 'react';
import { Link } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
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
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { activeMatch, tournaments } = useCricket();
  const activeInning = activeMatch.innings[activeMatch.activeInningNumber - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide uppercase shadow-lg shadow-cyan-500/10 animate-in fade-in duration-300">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>OBS Studio & vMix Transparent Broadcast System</span>
          </div>

          {/* Logo Brand Banner */}
          <div className="mt-8 mb-4">
            <img
              src="/logo.png"
              alt="IconicScorer"
              className="h-24 sm:h-36 md:h-44 max-w-[85vw] w-auto object-contain drop-shadow-[0_0_35px_rgba(236,72,153,0.55)] animate-in fade-in duration-300"
            />
          </div>

          {/* Title */}
          <h1 className="mt-2 font-heading font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white max-w-4xl leading-tight">
            LIVE CRICKET SCOREBOARD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">
              CONTROLLER & OVERLAY
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Professional broadcast suite with zero-latency cross-tab synchronization, interactive player cutout studio, DRS reviews, and 4 TV-quality overlay themes.
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={`/controller/${activeMatch.id}`}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-heading font-black text-base shadow-xl shadow-cyan-500/25 active:scale-95 transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Launch Match Scorer</span>
            </Link>

            <a
              href={`/overlay/${activeMatch.id}?theme=cricpic`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-base border border-slate-700 shadow-xl active:scale-95 transition"
            >
              <Tv className="w-5 h-5 text-red-500 animate-pulse" />
              <span>Open OBS Overlay</span>
            </a>

            <Link
              to="/links"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-heading font-bold text-base border border-slate-800 transition"
            >
              <LinkIcon className="w-5 h-5 text-amber-400" />
              <span>Scoreboard Links</span>
            </Link>
          </div>

          {/* Active Live Match Quick Card */}
          <div className="mt-12 w-full max-w-3xl rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE LIVE BROADCAST MATCH
              </span>
              <span className="text-slate-400 font-mono">
                {activeMatch.venue || 'Stadium'} • {activeMatch.matchNo}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col text-left">
                <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                  {activeMatch.team1.name}
                </span>
                <span className="text-xs text-slate-400">
                  {activeMatch.team1.players.length} Players
                </span>
              </div>

              {/* Big Score Counter */}
              <div className="flex flex-col items-center">
                <div className="font-score text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 leading-none">
                  {activeInning.totalRuns} - {activeInning.wickets}
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 mt-1">
                  {activeInning.oversDisplay} / {activeMatch.overs} OVERS
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                  {activeMatch.team2.name}
                </span>
                <span className="text-xs text-slate-400">
                  {activeMatch.team2.players.length} Players
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Toss: {activeMatch.tossDecision.toUpperCase()}
              </span>
              <Link
                to={`/controller/${activeMatch.id}`}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <span>Open Controller</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            ENGINEERED FOR LIVE STREAMERS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-1">
            Broadcast-Grade Production Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">4 Broadcast Themes</h3>
            <p className="text-slate-400 text-sm">
              Switch seamlessly between CricPic Cutout Pro, Asia Cup Classic, CWC 23 Gold Edition, and IPL Cyber Neon.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Crop className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Player Photo Cutout Studio</h3>
            <p className="text-slate-400 text-sm">
              Interactive HTML5 canvas cropper with real-time zoom, pan, and rotate controls to generate TV-ready circular player portraits.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Zero-Latency State Sync</h3>
            <p className="text-slate-400 text-sm">
              Instantaneous scoring and animation dispatch powered by the BroadcastChannel API with localStorage backup.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500">
        <p>IconicScorer • Live Cricket Scoreboard Controller & Transparent Broadcast Overlay System</p>
      </footer>
    </div>
  );
};
