import React, { useState } from 'react';
import { useCricket } from '../context/CricketContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { OverlayTheme } from '../types/cricket';
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
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getOverlayUrl = (theme: OverlayTheme, cameraFi = false) => {
    const origin = window.location.origin;
    const base = `${origin}/overlay/${currentMatch.id}?theme=${theme}&transparent=true`;
    return cameraFi ? `${base}&camerafi=1` : base;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-200/30 via-blue-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-blue-700 font-black text-xs uppercase tracking-wider">
                BROADCAST STUDIO
              </span>
              <span className="text-slate-500 text-xs font-mono">OBS Studio & vMix Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-slate-900 mt-1">
              <span className="text-blue-600">ALL SCOREBOARD</span> LINKS
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Copy transparent browser source links for OBS Studio, vMix, Streamlabs, or mobile streaming apps (CameraFi Live).
            </p>
          </div>

          {/* Match Selector Dropdown */}
          <div className="flex flex-col gap-1.5 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
            <label className="text-xs font-bold text-slate-500 uppercase">Select Match:</label>
            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                setActiveMatchId(e.target.value);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-blue-600 font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
            >
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.team1.name} vs {m.team2.name} ({m.matchNo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Mini Preview Canvas */}
        <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_15px_35px_rgba(2,132,199,0.06)] flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="font-heading font-bold text-lg text-slate-900">Live Preview Studio</h3>
              <span className="text-xs font-mono text-slate-400">
                (Simulating transparent OBS broadcast overlay)
              </span>
            </div>
            <a
              href={getOverlayUrl(previewTheme)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Screen Window</span>
            </a>
          </div>

          {/* 16:9 Frame Preview */}
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-slate-200 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center flex flex-col justify-end p-4 shadow-inner">
            <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
            <div className="relative z-10 w-full transform scale-90 sm:scale-100 origin-bottom">
              <iframe
                title="Overlay Preview"
                src={`/overlay/${currentMatch.id}?theme=${previewTheme}&transparent=true`}
                className="w-full h-36 border-0 bg-transparent pointer-events-none"
              />
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
              className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-heading font-black text-xs uppercase tracking-wider shrink-0 transition shadow-sm"
            >
              সাবস্ক্রাইব করুন (৳৯৯ থেকে)
            </Link>
          </div>
        )}

        {/* Table of Themes */}
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_15px_35px_rgba(2,132,199,0.06)]">
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-[0_15px_35px_rgba(2,132,199,0.06)] text-xs sm:text-sm text-slate-700 space-y-2">
          <h4 className="font-heading font-black text-base text-blue-600 uppercase tracking-wide flex items-center gap-2">
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
