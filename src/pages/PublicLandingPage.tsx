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
  Activity,
  Layers,
  PhoneCall,
  Smartphone,
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
      desc: 'Star Sports inspired with circular player cutout photo and vibrant broadcast gradients.',
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Soft Luminous Blue Ambient Gradients (Ada Aesthetic) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b from-sky-300/30 via-blue-200/15 to-transparent blur-[110px] pointer-events-none rounded-full" />
      <div className="absolute top-80 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-96 -right-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Top Pill Badge (Ada Style) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-[0_2px_12px_rgba(2,132,199,0.08)] text-xs font-semibold text-slate-700 backdrop-blur-md animate-in fade-in duration-300">
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>New v2.5</span>
            </span>
            <span className="text-slate-600 font-medium">OBS Studio & vMix Broadcast Overlay Suite</span>
          </div>

          {/* Official Logo Display */}
          <div className="mt-8 mb-4">
            <img
              src={logoImg}
              alt="IconicScorer"
              className="h-24 sm:h-32 md:h-40 max-w-[85vw] w-auto object-contain drop-shadow-[0_10px_25px_rgba(37,99,235,0.2)] transition-transform hover:scale-[1.02]"
            />
          </div>

          {/* Main Headline (Two-Tone Ada Style) */}
          <h1 className="mt-3 font-heading font-black text-3xl sm:text-5xl md:text-6xl text-slate-900 max-w-4xl tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500">
              Live Cricket Scoreboard
            </span>{' '}
            <br className="hidden sm:inline" />
            <span className="text-slate-900">Controller & TV Broadcast Overlay</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
            Professional broadcasting suite with real-time scorer controller, transparent 1080p overlays for OBS Studio, player cutout studio, and 4 TV themes.
          </p>

          {/* CTAs (Ada Glowing Pill Buttons) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <Link
              to="/payment"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-heading font-bold text-base shadow-[0_12px_28px_-6px_rgba(37,99,235,0.45)] hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.55)] active:scale-95 transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Choose Plan (From ₹250)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-blue-600 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] font-heading font-bold text-base active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <span>Create Free Account</span>
            </button>
          </div>

          {/* Ada-Inspired Floating App Mockup & Widgets */}
          <div className="mt-14 w-full max-w-4xl relative flex flex-col items-center">
            {/* Ambient Backlight under mockup */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-sky-300/30 to-cyan-300/20 blur-3xl rounded-full pointer-events-none" />

            {/* Floating Left Card (Ada Style) */}
            <div className="hidden lg:flex absolute left-0 top-12 z-20 items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(2,132,199,0.1),0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Run Rate</span>
                <span className="font-score text-xl font-bold text-slate-900 leading-none">8.42 CRR</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● Optimal Pace</span>
              </div>
            </div>

            {/* Floating Right Card (Ada Style) */}
            <div className="hidden lg:flex absolute right-0 top-16 z-20 items-center gap-3 p-3.5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(2,132,199,0.1),0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OBS Broadcast Sync</span>
                <span className="font-heading font-black text-sm text-slate-900 block">0ms Real-Time Stream</span>
                <span className="text-[10px] text-blue-600 font-bold block">1080p 60fps Transparent</span>
              </div>
            </div>

            {/* Center Device / Live Controller Canvas Card */}
            <div className="w-full rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/90 p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.12),0_1px_4px_rgba(0,0,0,0.04)] relative z-10 flex flex-col gap-6">
              {/* Match Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-heading font-black text-xs sm:text-sm text-emerald-700 uppercase tracking-wider">
                    LIVE MATCH BROADCAST STREAM
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200/60">
                  T20 CHAMPIONSHIP • FINAL
                </span>
              </div>

              {/* Match Overview Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-2">
                {/* Team 1 */}
                <div className="flex items-center gap-3.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-heading font-black text-base flex items-center justify-center shadow-md">
                    IND
                  </div>
                  <div className="text-left">
                    <span className="font-heading font-black text-lg text-slate-900 block">INDIA</span>
                    <span className="text-xs text-slate-500 font-mono">11 Players Squad</span>
                  </div>
                </div>

                {/* Score Counter */}
                <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-sky-50 border border-blue-200/70">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-0.5">
                    1ST INNINGS
                  </span>
                  <div className="font-score text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 leading-none">
                    184 - 3
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 mt-1.5">
                    17.4 / 20 OVERS
                  </span>
                </div>

                {/* Team 2 */}
                <div className="flex items-center gap-3.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-heading font-black text-base flex items-center justify-center shadow-md">
                    AUS
                  </div>
                  <div className="text-left">
                    <span className="font-heading font-black text-lg text-slate-900 block">AUSTRALIA</span>
                    <span className="text-xs text-slate-500 font-mono">11 Players Squad</span>
                  </div>
                </div>
              </div>

              {/* Active Batters & Bowler Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    V. Kohli* 78 (44)
                  </span>
                  <span className="text-slate-500">S. Yadav 34 (16)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">M. Starc</span>
                  <span className="text-blue-600 font-bold">3.4-0-31-2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Capabilities Section (Ada Card Grid) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80">
            OUR BROADCAST SERVICES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 mt-4 tracking-tight">
            Everything You Need For Live Cricket
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            From local club tournaments to international streams, IconicScorer provides an end-to-end cloud broadcast suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 shadow-[0_15px_35px_rgba(2,132,199,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] transition flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-sm">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">4 TV Broadcast Themes</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Transparent bottom-third scoreboards styled after world-class networks like Star Sports, Asia Cup, and IPL Cyber Neon.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 shadow-[0_15px_35px_rgba(2,132,199,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] transition flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-sm">
              <Crop className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Player Photo Cutout Studio</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload local player photos and crop them with our built-in HTML5 circular canvas studio with real-time zoom, pan, and rotate.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 shadow-[0_15px_35px_rgba(2,132,199,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] transition flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-sm">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Live Controller & DRS</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              1-click scoring keypad with legal ball tracking, automatic strike rotation on odd runs, over detection, and DRS review animations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 shadow-[0_15px_35px_rgba(2,132,199,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] transition flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Tournament & Squad Manager</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Manage complete series, teams, squads, playing XIs, tournament logos, and match schedules with manual logo uploads.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 shadow-[0_15px_35px_rgba(2,132,199,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] transition flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Zero-Latency State Sync</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Controller actions in one window instantly reflect on the OBS overlay in real-time with zero lag, backed by Server-Sent Events.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-blue-300 shadow-[0_15px_35px_rgba(2,132,199,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.12)] transition flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Flexible SaaS Pass System</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              16 flexible plans tailored to match duration and ticket counts. Instant activation via Razorpay or bKash / Nagad.
            </p>
          </div>
        </div>
      </section>

      {/* Broadcast Themes Interactive Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-y border-slate-200/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-4 py-1.5 rounded-full border border-blue-200/80">
              VISUAL EXCELLENCE
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mt-4">
              Explore 4 TV Broadcast Themes
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Each theme renders with a 100% transparent background designed to overlay directly over your live camera feed in OBS Studio or vMix.
            </p>
          </div>

          {/* Theme Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThemeTab(t.id as any)}
                className={`px-5 py-2.5 rounded-full font-heading font-bold text-xs sm:text-sm transition ${
                  activeThemeTab === t.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-sm'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Interactive Simulated Preview Box */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-2xl p-4 sm:p-8 flex flex-col items-center">
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

                <div className="px-3 py-1 rounded-lg bg-blue-600/30 border border-blue-500/50 text-blue-300 text-xs font-bold uppercase">
                  {activeThemeTab.toUpperCase()}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-600 text-center">
              Active Theme: <strong className="text-slate-900">{themes.find((t) => t.id === activeThemeTab)?.name}</strong> — {themes.find((t) => t.id === activeThemeTab)?.desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Guide (Ada Card Aesthetic) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/80">
            SIMPLE WORKFLOW
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mt-4">
            How IconicScorer Works
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Get your live cricket tournament broadcasting on Facebook & YouTube in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_10px_30px_rgba(2,132,199,0.05)] flex flex-col gap-4 relative overflow-hidden">
            <span className="font-score text-7xl font-black text-blue-500/10 absolute top-2 right-4">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-heading font-black text-lg">
              1
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Select a Plan & Sign Up</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pick from 16 flexible plans starting from ₹250 (1 Day). Instantly create an account and unlock your tickets.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_10px_30px_rgba(2,132,199,0.05)] flex flex-col gap-4 relative overflow-hidden">
            <span className="font-score text-7xl font-black text-blue-500/10 absolute top-2 right-4">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 font-heading font-black text-lg">
              2
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Score Live on the Controller</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Open your match controller on laptop, tablet, or phone. Tap runs, wickets, extras, and trigger DRS review animations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_10px_30px_rgba(2,132,199,0.05)] flex flex-col gap-4 relative overflow-hidden">
            <span className="font-score text-7xl font-black text-blue-500/10 absolute top-2 right-4">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-heading font-black text-lg">
              3
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900">Paste Link in OBS & Stream</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Copy your overlay link from Scoreboard Links and add as a 1920x1080 Browser Source in OBS or vMix. Go live immediately!
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Preview Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/70 px-4 py-1.5 rounded-full border border-blue-200/80">
              PRICING & SUBSCRIPTION
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 mt-4">
              Affordable Plans For Every Tournament
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl mx-auto">
              Choose from single-day match passes up to full annual league subscriptions with included match tickets.
            </p>
          </div>

          {/* Quick teaser cards of 4 key plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {SUBSCRIPTION_PLANS.filter((p) => ['1-day', 'weekly-v1', 'monthly-v1', 'yearly-v1'].includes(p.id)).map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 flex flex-col gap-4 shadow-[0_10px_25px_rgba(2,132,199,0.06)] hover:shadow-xl hover:border-blue-400 transition relative"
              >
                {p.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wide shadow-sm">
                    POPULAR STARTER
                  </span>
                )}
                <div className="text-left">
                  <h4 className="font-heading font-black text-lg text-slate-900">{p.name}</h4>
                  <span className="text-xs text-slate-500">{p.durationDays} Day Access</span>
                </div>

                <div className="flex items-baseline gap-1 my-1">
                  <span className="font-score text-4xl font-black text-slate-900">₹{p.price}</span>
                  <span className="text-xs text-slate-500 font-mono">/ total</span>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>{p.tickets} Match Ticket(s)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>All 4 OBS Overlay Themes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Player Photo Cutout Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Live DRS Animations</span>
                  </li>
                </ul>

                <Link
                  to="/payment"
                  className="mt-auto py-3 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-heading font-bold text-xs uppercase tracking-wide text-center transition shadow-sm"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/payment"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-heading font-bold text-sm shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition"
            >
              <span>View All 16 Flexible Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Broadcast Tools Integration Section (Ada-Inspired) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Top: FITS YOUR BROADCAST WORKFLOW */}
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest font-mono">
            FITS YOUR BROADCAST WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl text-slate-900 font-medium tracking-tight mt-2 font-sans">
            Bring your scoreboard into the tools you use.
          </h2>

          {/* 4 Tool Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* 1. vMix */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 flex items-center gap-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] transition">
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
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 flex items-center gap-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] transition">
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
                OBS
              </span>
            </div>

            {/* 3. PRISM Live Studio */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 flex items-center gap-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] transition">
              <div className="w-9 h-9 rounded-lg bg-[#0e071e] border border-purple-500/30 p-1 flex items-center justify-center shrink-0 shadow">
                <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="prismGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <polygon points="50,15 88,80 12,80" fill="none" stroke="url(#prismGradLight)" strokeWidth="8" strokeLinejoin="round" />
                  <polygon points="50,32 74,74 26,74" fill="none" stroke="url(#prismGradLight)" strokeWidth="6" strokeLinejoin="round" opacity="0.8" />
                  <polygon points="50,48 62,69 38,69" fill="url(#prismGradLight)" opacity="0.9" />
                </svg>
              </div>
              <span className="font-heading font-black text-lg text-slate-900 tracking-wide">
                PRISM Live Studio
              </span>
            </div>

            {/* 4. CameraFi Live */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 flex items-center gap-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] transition">
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
        <div className="mt-16 pt-12 border-t border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest font-mono">
              YOUR MATCH. YOUR BROADCAST.
            </span>
            <h3 className="text-3xl sm:text-4xl text-slate-900 font-medium tracking-tight mt-1.5 font-sans">
              Make every over part of the show.
            </h3>
            <p className="text-sm text-slate-600 mt-2 font-normal">
              Create a tournament, score the match, and bring the live board into your stream.
            </p>
          </div>

          <Link
            to="/tournament"
            className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-sm flex items-center gap-2 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition shrink-0"
          >
            <span>Create a tournament</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Final Banner (Ada Style Glassmorphism) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-blue-600 via-sky-600 to-blue-700 text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white max-w-2xl leading-tight">
            Ready To Upgrade Your Cricket Broadcasts?
          </h2>
          <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-xl">
            Join broadcasters and streamers using IconicScorer for live cricket broadcasting across YouTube, Facebook, and local TV networks.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/payment"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-heading font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/40 font-bold text-sm transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Clean & Light) */}
      <footer className="mt-auto py-10 border-t border-slate-200/80 bg-white text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="IconicScorer" className="h-9 w-auto" />
            <span>© 2026 IconicScorer. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/payment" className="hover:text-blue-600 transition">Payment Plans</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Contact & WhatsApp</Link>
            <button onClick={() => openAuthModal('login')} className="hover:text-blue-600 transition">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
