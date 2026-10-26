import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tv,
  SlidersHorizontal,
  Radio,
  Trophy,
  Zap,
  Crop,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  MessageCircle,
  Play,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Star,
  Users,
} from 'lucide-react';
import { useAuth, SUBSCRIPTION_PLANS } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

export const PublicLandingPage: React.FC = () => {
  const { openAuthModal } = useAuth();
  const [activeThemeTab, setActiveThemeTab] = useState<'cricpic' | 'asiacup' | 'cwc23' | 'iplneon'>('cricpic');

  const themes = [
    {
      id: 'cricpic',
      name: 'CricPic Cutout Pro',
      desc: 'Star Sports inspired with circular player cutout photo and vibrant gradients.',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      id: 'asiacup',
      name: 'Asia Cup Classic',
      desc: 'Emerald & Gold dual-strip design with high-contrast scoreboard typography.',
      color: 'from-emerald-600 to-teal-500',
    },
    {
      id: 'cwc23',
      name: 'CWC 23 Gold Edition',
      desc: 'ICC tournament gold styling with dynamic stadium flare and animated boundaries.',
      color: 'from-amber-600 to-yellow-500',
    },
    {
      id: 'iplneon',
      name: 'IPL Cyber Neon',
      desc: 'High-energy cyberpunk neon aesthetics designed for T20 night tournaments.',
      color: 'from-fuchsia-600 to-pink-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-600/20 via-fuchsia-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Top broadcast status pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/10 animate-in fade-in duration-300">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>OBS Studio & vMix Transparent Broadcast Suite</span>
          </div>

          {/* Official Logo Banner */}
          <div className="mt-8 mb-4">
            <img
              src={logoImg}
              alt="IconicScorer"
              className="h-28 sm:h-36 md:h-44 max-w-[90vw] w-auto object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-transform hover:scale-[1.02]"
            />
          </div>

          {/* Main Headline */}
          <h1 className="mt-2 font-heading font-black text-3xl sm:text-5xl md:text-6xl text-white max-w-4xl tracking-tight leading-tight">
            Turn Any Cricket Stream Into An <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300">
              International TV Broadcast
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            IconicScorer is the premier live cricket scoreboard controller & transparent overlay system.
            Engineered for YouTube streamers, Facebook Live broadcasters, and tournament organizers.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/payment"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-heading font-black text-base shadow-xl shadow-fuchsia-600/30 active:scale-95 transition"
            >
              <CreditCard className="w-5 h-5" />
              <span>Get Started — Choose Plan</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={() => openAuthModal('signup')}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-base border border-slate-700 shadow-xl active:scale-95 transition"
            >
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Create Account</span>
            </button>

            <Link
              to="/contact"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold text-base border border-slate-800 transition"
            >
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              <span>Contact Sales</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-center">
              <span className="block font-heading font-black text-2xl sm:text-3xl text-cyan-400">0 ms</span>
              <span className="text-xs text-slate-400 font-medium">Real-Time Sync</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-center">
              <span className="block font-heading font-black text-2xl sm:text-3xl text-fuchsia-400">4 TV</span>
              <span className="text-xs text-slate-400 font-medium">Broadcast Themes</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-center">
              <span className="block font-heading font-black text-2xl sm:text-3xl text-emerald-400">1080p</span>
              <span className="text-xs text-slate-400 font-medium">Transparent Alpha</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-center">
              <span className="block font-heading font-black text-2xl sm:text-3xl text-amber-400">100%</span>
              <span className="text-xs text-slate-400 font-medium">OBS & vMix Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Capabilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
            OUR BROADCAST SERVICES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white mt-3">
            Everything You Need For Live Cricket
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            From grass-root local tournaments to grand international leagues, IconicScorer provides an end-to-end cloud broadcast suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-cyan-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Tv className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">4 TV Broadcast Themes</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transparent bottom-third scoreboards styled after world-class networks like Star Sports, Sky Sports, and IPL Cyber Neon. Clean alpha channel for OBS Studio & vMix.
            </p>
          </div>

          {/* Service 2 */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-fuchsia-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Crop className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Player Photo Cutout Studio</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload local player photos and crop them with our built-in HTML5 circular canvas studio. Real-time zoom, pan, and rotation to generate TV-ready circular player badges.
            </p>
          </div>

          {/* Service 3 */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-emerald-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Live Controller & DRS</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              1-click scoring keypad with legal ball tracking, automatic strike rotation on odd runs, over end detection, multi-level undo stack, and full-screen DRS Third Umpire animations.
            </p>
          </div>

          {/* Service 4 */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-amber-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Tournament & Squad Manager</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Manage complete series, teams, squads, playing XIs, tournament logos, and match schedules with automatic seed data or custom team imports.
            </p>
          </div>

          {/* Service 5 */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-cyan-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Zero-Latency Sync Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Controller actions in one window instantly reflect on the OBS overlay in real-time with zero lag, backed by Server-Sent Events and dual-channel caching.
            </p>
          </div>

          {/* Service 6 */}
          <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-rose-500/40 transition">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-black text-xl text-white">Commercial SaaS Ticket Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pay-as-you-go ticket and duration plans tailored to your tournament duration. Unlocks full features for active subscribers without recurring lock-ins.
            </p>
          </div>
        </div>
      </section>

      {/* Broadcast Themes Interactive Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest bg-fuchsia-500/10 px-3.5 py-1.5 rounded-full border border-fuchsia-500/20">
              VISUAL EXCELLENCE
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-3">
              Explore 4 TV Broadcast Themes
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Each theme renders with a 100% transparent background designed to overlay directly over your live camera feed in OBS Studio or vMix.
            </p>
          </div>

          {/* Theme Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThemeTab(t.id as any)}
                className={`px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition ${
                  activeThemeTab === t.id
                    ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Interactive Simulated Preview Box */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl p-6 sm:p-10 flex flex-col items-center">
            {/* Mock Cricket Pitch Background */}
            <div className="w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-b from-sky-900 via-slate-900 to-emerald-950 relative flex items-center justify-center overflow-hidden border border-slate-800">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute top-4 left-4 bg-red-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>LIVE OBS BROADCAST FEED</span>
              </div>

              {/* Bottom Simulated Overlay Strip */}
              <div className="absolute bottom-4 left-4 right-4 max-w-4xl mx-auto rounded-2xl bg-slate-950/95 border border-slate-700/80 p-3 sm:p-4 shadow-2xl flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center font-black text-white text-xs">
                    IND
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-slate-400 font-mono block">INDIA vs PAKISTAN</span>
                    <span className="font-heading font-black text-xl sm:text-2xl text-white">
                      184 / 3 <span className="text-xs text-cyan-400 font-mono">(17.4 OV)</span>
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-yellow-400 font-bold">V. Kohli* 78 (44)</span>
                    <span className="text-slate-400 block">S. Yadav 34 (16)</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div className="text-left">
                    <span className="text-slate-300">Shaheen Afridi</span>
                    <span className="text-cyan-400 block font-bold">3.4-0-31-2</span>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-fuchsia-600/30 border border-fuchsia-500/50 text-fuchsia-300 text-xs font-bold uppercase">
                  {activeThemeTab.toUpperCase()}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 text-center">
              Active Theme: <strong className="text-white">{themes.find((t) => t.id === activeThemeTab)?.name}</strong> — {themes.find((t) => t.id === activeThemeTab)?.desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Guide */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            SIMPLE WORKFLOW
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-3">
            How IconicScorer Works
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Get your live cricket tournament broadcasting on Facebook & YouTube in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 relative">
            <span className="font-score text-6xl font-black text-cyan-500/20 absolute top-4 right-6">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-heading font-black text-lg">
              1
            </div>
            <h3 className="font-heading font-black text-xl text-white">Select a Plan & Sign Up</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pick from 16 flexible plans starting from ₹250 (1 Day). Instantly create an account and unlock your tickets.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 relative">
            <span className="font-score text-6xl font-black text-fuchsia-500/20 absolute top-4 right-6">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 font-heading font-black text-lg">
              2
            </div>
            <h3 className="font-heading font-black text-xl text-white">Score Live on the Controller</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Open your match controller on laptop, tablet, or phone. Tap runs, wickets, extras, and trigger DRS review animations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col gap-4 relative">
            <span className="font-score text-6xl font-black text-emerald-500/20 absolute top-4 right-6">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-heading font-black text-lg">
              3
            </div>
            <h3 className="font-heading font-black text-xl text-white">Paste Link in OBS & Stream</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Copy your overlay link from Scoreboard Links and add as a 1920x1080 Browser Source in OBS or vMix. Go live immediately!
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3.5 py-1.5 rounded-full border border-pink-500/20">
              PRICING & SUBSCRIPTION
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-3">
              Affordable Plans For Every Tournament
            </h2>
            <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
              Choose from single-day match passes up to full annual league subscriptions with included match tickets.
            </p>
          </div>

          {/* Quick teaser cards of 4 key plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {SUBSCRIPTION_PLANS.filter((p) => ['1-day', 'weekly-v1', 'monthly-v1', 'yearly-v1'].includes(p.id)).map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col gap-4 shadow-xl hover:border-fuchsia-500/50 transition relative"
              >
                {p.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-fuchsia-600 text-white font-bold text-[10px] uppercase tracking-wide">
                    POPULAR STARTER
                  </span>
                )}
                <div className="text-left">
                  <h4 className="font-heading font-black text-lg text-white">{p.name}</h4>
                  <span className="text-xs text-slate-400">{p.durationDays} Day Access</span>
                </div>

                <div className="flex items-baseline gap-1 my-2">
                  <span className="font-score text-4xl font-black text-white">₹{p.price}</span>
                  <span className="text-xs text-slate-400 font-mono">/ total</span>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span><strong>{p.tickets} Match Ticket(s)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All 4 OBS Overlay Themes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Player Photo Cutout Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Live DRS Animations</span>
                  </li>
                </ul>

                <Link
                  to="/payment"
                  className="mt-auto py-2.5 rounded-xl bg-slate-800 hover:bg-fuchsia-600 text-white font-heading font-bold text-xs uppercase tracking-wide text-center transition"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/payment"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-fuchsia-600/30 transition"
            >
              <span>View All 16 Flexible Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Broadcast Tools Integration & Compatibility (Exact Match from Screenshot) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-800/80">
        {/* Top: FITS YOUR BROADCAST WORKFLOW */}
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
            FITS YOUR BROADCAST WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl text-white font-medium tracking-tight mt-2 font-sans">
            Bring your scoreboard into the tools you use.
          </h2>

          {/* 4 Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* 1. vMix */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-slate-800/90 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-slate-800/90 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-slate-800/90 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
              <div className="w-9 h-9 rounded-lg bg-[#0e071e] border border-purple-500/30 p-1 flex items-center justify-center shrink-0 shadow">
                <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="prismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <polygon points="50,15 88,80 12,80" fill="none" stroke="url(#prismGrad)" strokeWidth="8" strokeLinejoin="round" />
                  <polygon points="50,32 74,74 26,74" fill="none" stroke="url(#prismGrad)" strokeWidth="6" strokeLinejoin="round" opacity="0.8" />
                  <polygon points="50,48 62,69 38,69" fill="url(#prismGrad)" opacity="0.9" />
                </svg>
              </div>
              <span className="font-heading font-black text-lg text-white tracking-wide">
                PRISM Live Studio
              </span>
            </div>

            {/* 4. CameraFi Live */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-slate-800/90 hover:border-slate-700 flex items-center gap-3.5 shadow-lg transition">
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
        <div className="mt-16 pt-12 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              YOUR MATCH. YOUR BROADCAST.
            </span>
            <h3 className="text-3xl sm:text-4xl text-white font-medium tracking-tight mt-1.5 font-sans">
              Make every over part of the show.
            </h3>
            <p className="text-sm text-slate-400 mt-2 font-normal">
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
      </section>

      {/* CTA Final Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white max-w-2xl">
            Ready To Upgrade Your Cricket Broadcasts?
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl">
            Join broadcasters and streamers using IconicScorer for live cricket broadcasting across YouTube, Facebook, and local TV networks.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/payment"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-heading font-black text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/25 active:scale-95 transition flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="IconicScorer" className="h-9 w-auto" />
            <span>© 2026 IconicScorer. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/payment" className="hover:text-white transition">Payment Plans</Link>
            <Link to="/contact" className="hover:text-white transition">Contact & WhatsApp</Link>
            <button onClick={() => openAuthModal('login')} className="hover:text-white transition">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
