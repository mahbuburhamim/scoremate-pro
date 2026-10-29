import React, { useState } from 'react';
import { useCricket } from '../context/CricketContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { OverlayTheme } from '../types/cricket';
import { CricPicTheme } from '../components/overlay/CricPicTheme';
import { AsiaCupTheme } from '../components/overlay/AsiaCupTheme';
import { CWC23Theme } from '../components/overlay/CWC23Theme';
import { IPLNeonTheme } from '../components/overlay/IPLNeonTheme';
import { Special2023Theme } from '../components/overlay/Special2023Theme';
import { ILT20SpecialTheme } from '../components/overlay/ILT20SpecialTheme';
import { ResponsiveScoreboardWrapper } from '../components/ResponsiveScoreboardWrapper';
import {
  Copy,
  ExternalLink,
  Check,
  Eye,
  Tv,
  Sparkles,
  Smartphone,
  Monitor,
  Flame,
  Lock,
} from 'lucide-react';

interface ThemeRow {
  no: number;
  id: OverlayTheme;
  name: string;
  badge: string;
  tier: string;
  description: string;
}

export const LinksPage: React.FC = () => {
  const { matches, activeMatch, setActiveMatchId } = useCricket();
  const { hasActiveSubscription } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<string>(activeMatch.id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<OverlayTheme>('cricpic');

  const currentMatch = matches.find((m) => m.id === selectedMatchId) || activeMatch;

  const themes: ThemeRow[] = [
    {
      no: 1,
      id: 'cricpic',
      name: 'CricPic Player Cutout Pro',
      badge: 'POPULAR',
      tier: 'Pro Included',
      description: 'Circular player photos with active striker green indicator & metallic badge.',
    },
    {
      no: 2,
      id: 'asiacup',
      name: 'Asia Cup Classic',
      badge: 'OFFICIAL',
      tier: 'Pro Included',
      description: 'Deep navy blue & gold angular geometry with national team crests.',
    },
    {
      no: 3,
      id: 'cwc23',
      name: 'CWC 23 Gold Edition',
      badge: 'WORLD CUP',
      tier: 'Pro Included',
      description: 'Regal obsidian black with gold filigree and stadium lighting gradients.',
    },
    {
      no: 4,
      id: 'iplneon',
      name: 'IPL Cyber Neon',
      badge: 'CYBERPUNK',
      tier: 'Pro Included',
      description: 'Futuristic neon cyan & hot pink HUD plates with glowing borders.',
    },
    {
      no: 5,
      id: 'special2023',
      name: '2023 Special',
      badge: 'EXCLUSIVE',
      tier: 'Pro Included',
      description: 'Official 2023 bilateral capsule theme with vibrant orange score, stacked dual batters & live ball tracker.',
    },
    {
      no: 6,
      id: 'ilt20special',
      name: 'ILT20 Special',
      badge: 'DP WORLD',
      tier: 'Pro Included',
      description: 'Official ILT20 Dubai broadcast theme with purple & red angled plates, dot-ball tracker & country flags.',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getOverlayUrl = (theme: OverlayTheme, cameraFi = false) => {
    const origin = window.location.origin;
    const targetId = selectedMatchId === 'active' ? 'active' : currentMatch.id;
    const base = `${origin}/overlay/${targetId}?theme=${theme}&transparent=true`;
    return cameraFi ? `${base}&camerafi=1` : base;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-200/30 via-blue-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-blue-700 font-black text-xs uppercase tracking-wider">
                BROADCAST STUDIO
              </span>
              <span className="text-slate-500 text-xs font-mono">OBS Studio & vMix Ready</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-tight text-slate-900 mt-1">
              <span className="text-blue-600">ALL SCOREBOARD</span> LINKS
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Copy transparent browser source links for OBS Studio, vMix, Streamlabs, or mobile streaming apps (CameraFi Live).
            </p>
          </div>

          {/* Match Selector Dropdown */}
          <div className="flex flex-col gap-1.5 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm w-full md:w-auto">
            <label className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase">Select Match:</label>
            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                if (e.target.value !== 'active') {
                  setActiveMatchId(e.target.value);
                }
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-blue-600 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="active">⚡ Live Active Match (Auto-Switches with Controller)</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.team1.name} vs {m.team2.name} ({m.matchNo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NEW FOOTBALL SCOREBOARD SPOTLIGHT BANNER */}
        <div className="w-full bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                  NEW RELEASE
                </span>
                <span className="text-cyan-300 font-mono text-xs font-bold">1920x1080 Full HD Top-Left Stationed</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>⚽ Football Match Scoreboard (Esports Neon Graphic)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Futuristic 3D beveled graphics with live match clock, dual team scores, goal celebration banners, red/yellow card trackers, and transparent background for OBS Studio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleCopy(`${window.location.origin}/overlay/football`, 'football_overlay')}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition active:scale-95"
              >
                {copiedKey === 'football_overlay' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'football_overlay' ? 'Copied 1080p URL!' : 'Copy 1920x1080 OBS Link'}</span>
              </button>

              <Link
                to="/football"
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg"
              >
                <span>Live Controller</span>
              </Link>

              <a
                href="/overlay/football"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Preview in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Mini Preview Canvas (Using ResponsiveScoreboardWrapper - Zero Cutoff) */}
        <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-3 sm:p-5 shadow-[0_15px_35px_rgba(2,132,199,0.06)] flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">Live Preview Studio</h3>
              <span className="text-[11px] sm:text-xs font-mono text-slate-400 hidden sm:inline">
                (Simulating transparent OBS broadcast overlay)
              </span>
            </div>
            <a
              href={getOverlayUrl(previewTheme)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Screen Window</span>
            </a>
          </div>

          {/* Stadium Frame Preview with Live Scaled Scoreboard */}
          <div className="relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px] rounded-2xl overflow-hidden border border-slate-800 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center flex flex-col justify-between p-3 sm:p-5 shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60 pointer-events-none" />

            {/* Top Indicator Header */}
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] sm:text-xs font-black tracking-widest shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>OBS 1080P BROADCAST FEED</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold shadow">
                {themes.find((t) => t.id === previewTheme)?.name}
              </div>
            </div>

            {/* Bottom Responsive Scoreboard (Zero Cutoff on Mobile & Desktop) */}
            <div className="relative z-10 w-full flex justify-center items-end overflow-hidden pb-1 pt-4">
              <ResponsiveScoreboardWrapper designWidth={1340}>
                {previewTheme === 'cricpic' && <CricPicTheme match={currentMatch} />}
                {previewTheme === 'asiacup' && <AsiaCupTheme match={currentMatch} />}
                {previewTheme === 'cwc23' && <CWC23Theme match={currentMatch} />}
                {previewTheme === 'iplneon' && <IPLNeonTheme match={currentMatch} />}
                {previewTheme === 'special2023' && <Special2023Theme match={currentMatch} />}
                {previewTheme === 'ilt20special' && <ILT20SpecialTheme match={currentMatch} />}
              </ResponsiveScoreboardWrapper>
            </div>
          </div>
        </div>

        {/* OBS Setup & Real-time Live Sync Guide */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <Tv className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-heading font-black block text-sm text-blue-950">
                OBS Studio লাইভ স্কোরবোর্ড ব্যবহারের নিয়ম
              </span>
              <span className="text-slate-600 leading-relaxed block mt-0.5">
                OBS-এ নতুন <strong>Browser Source</strong> বানিয়ে <strong>Copy</strong> করা লিঙ্কটি পেস্ট করুন (Width: 1920, Height: 1080)। যদি OBS-এ আগের কোনো ক্যাশ স্কোরবোর্ড আটকে থাকে, তবে Browser Source-এর Properties-এ গিয়ে <strong>&quot;Refresh cache of current page&quot;</strong> বাটনে চাপ দিন।
              </span>
            </div>
          </div>
        </div>

        {/* Guest Preview Notice if not subscribed */}
        {!hasActiveSubscription && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 shrink-0 font-bold">
                👀
              </div>
              <div className="text-xs">
                <span className="font-bold block text-amber-950">পাবলিক প্রিভিউ মোড (Guest Preview Active)</span>
                <span className="text-amber-800">
                  আপনি লগইন ছাড়াই সব থিমের লাইভ প্রিভিউ দেখতে পারবেন। OBS তে ব্যবহারের জন্য কপি লিঙ্ক পেতে প্যাকেজ সাবস্ক্রাইব করুন।
                </span>
              </div>
            </div>
            <Link
              to="/payment"
              className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-heading font-black text-xs uppercase tracking-wider shrink-0 transition shadow-sm w-full sm:w-auto text-center"
            >
              সাবস্ক্রাইব করুন (৳৯৯ থেকে)
            </Link>
          </div>
        )}

        {/* Mobile-Friendly Theme Cards (Visible on Small / Mobile Screens) */}
        <div className="block lg:hidden space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">
              Available Broadcast Themes
            </h3>
            <span className="text-xs text-slate-500 font-mono">Tap &quot;Preview&quot; to test theme</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {themes.map((theme) => {
              const pcLink = getOverlayUrl(theme.id);
              const mobileLink = getOverlayUrl(theme.id, true);
              const isSelected = previewTheme === theme.id;

              return (
                <div
                  key={`mobile-${theme.id}`}
                  className={`p-4 rounded-2xl border transition-all duration-200 bg-white shadow-sm flex flex-col gap-3 ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-100 bg-sky-50/40'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-mono text-xs font-bold flex items-center justify-center">
                        {theme.no}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-heading font-black text-sm text-slate-900">
                            {theme.name}
                          </h4>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {theme.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{theme.description}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] shrink-0">
                      {theme.tier}
                    </span>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewTheme(theme.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase transition flex items-center gap-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Previewing' : 'Preview'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {hasActiveSubscription ? (
                        <>
                          <button
                            onClick={() => handleCopy(pcLink, `m-pc-${theme.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 active:scale-95 transition"
                          >
                            {copiedKey === `m-pc-${theme.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-blue-600" />
                            )}
                            <span>{copiedKey === `m-pc-${theme.id}` ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => handleCopy(mobileLink, `m-cam-${theme.id}`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 active:scale-95 transition"
                            title="CameraFi Link"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Mobile</span>
                          </button>

                          <a
                            href={pcLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200"
                            title="Open Fullscreen"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200">
                          <Lock className="w-3 h-3" />
                          <span>Preview Only</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Table of Themes (Visible on Screens >= lg) */}
        <div className="hidden lg:block w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_15px_35px_rgba(2,132,199,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4 w-12 text-center">No.</th>
                  <th className="py-4 px-6">Theme Name</th>
                  <th className="py-4 px-4">Price / Tier</th>
                  <th className="py-4 px-6">Scoreboard Link (PC + Mobile)</th>
                  <th className="py-4 px-6">CameraFi Mobile Link</th>
                  <th className="py-4 px-4 text-center">Live Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {themes.map((theme) => {
                  const pcLink = getOverlayUrl(theme.id);
                  const mobileLink = getOverlayUrl(theme.id, true);

                  return (
                    <tr
                      key={theme.id}
                      className={`hover:bg-sky-50/40 transition ${
                        previewTheme === theme.id ? 'bg-sky-50/70' : ''
                      }`}
                    >
                      {/* No. */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                        {theme.no}
                      </td>

                      {/* Theme Name */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-black text-base text-slate-900">
                              {theme.name}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {theme.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 mt-0.5">{theme.description}</span>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs whitespace-nowrap">
                          {theme.tier}
                        </span>
                      </td>

                      {/* PC Link & Copy (Strictly hidden for guests/unsubscribed users) */}
                      <td className="py-4 px-6">
                        {hasActiveSubscription ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(pcLink, `pc-${theme.id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 active:scale-95 transition"
                            >
                              {copiedKey === `pc-${theme.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-blue-600" />
                              )}
                              <span>{copiedKey === `pc-${theme.id}` ? 'Copied!' : 'Copy Link'}</span>
                            </button>

                            <a
                              href={pcLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200"
                              title="Open Link in New Tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200/80 select-none">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Preview Only (No Copy)</span>
                          </span>
                        )}
                      </td>

                      {/* CameraFi Mobile Link */}
                      <td className="py-4 px-6">
                        {hasActiveSubscription ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(mobileLink, `cam-${theme.id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 active:scale-95 transition"
                            >
                              {copiedKey === `cam-${theme.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                              )}
                              <span>
                                {copiedKey === `cam-${theme.id}` ? 'Copied!' : 'CameraFi Link'}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200/80 select-none">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Preview Only</span>
                          </span>
                        )}
                      </td>

                      {/* Live Preview Button */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setPreviewTheme(theme.id)}
                          className={`px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wide transition ${
                            previewTheme === theme.id
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-sky-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* OBS Studio Integration Instructions Box */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-[0_15px_35px_rgba(2,132,199,0.06)] text-xs sm:text-sm text-slate-700 space-y-2">
          <h4 className="font-heading font-black text-sm sm:text-base text-blue-600 uppercase tracking-wide flex items-center gap-2">
            <Monitor className="w-4 h-4" /> How to use in OBS Studio / vMix / Streamlabs:
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
            <li>Copy the desired theme link from the table above.</li>
            <li>In OBS Studio, click the <strong className="text-slate-900">+</strong> icon under Sources and choose <strong className="text-slate-900">Browser</strong>.</li>
            <li>Paste the copied URL into the URL field.</li>
            <li>Set Width to <strong className="text-blue-600">1920</strong> and Height to <strong className="text-blue-600">1080</strong>.</li>
            <li>Check <strong className="text-slate-900">&quot;Shutdown source when not visible&quot;</strong> and click OK. The transparent scoreboard will appear immediately!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
