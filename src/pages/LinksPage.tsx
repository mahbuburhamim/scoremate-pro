import React, { useState } from 'react';
import { useCricket } from '../context/CricketContext';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                BROADCAST STUDIO
              </span>
              <span className="text-slate-400 text-xs font-mono">OBS Studio & vMix Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white mt-1">
              ALL SCOREBOARD LINKS
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Copy transparent browser source links for OBS Studio, vMix, Streamlabs, or mobile streaming apps (CameraFi Live).
            </p>
          </div>

          {/* Match Selector Dropdown */}
          <div className="flex flex-col gap-1.5 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <label className="text-xs font-bold text-slate-400 uppercase">Select Match:</label>
            <select
              value={selectedMatchId}
              onChange={(e) => {
                setSelectedMatchId(e.target.value);
                setActiveMatchId(e.target.value);
              }}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
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
        <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-lg text-white">Live Preview Studio</h3>
              <span className="text-xs font-mono text-slate-400">
                (Simulating transparent OBS broadcast overlay)
              </span>
            </div>
            <a
              href={getOverlayUrl(previewTheme)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Screen Window</span>
            </a>
          </div>

          {/* 16:9 Frame Preview */}
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-slate-800 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center flex flex-col justify-end p-4 shadow-inner">
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="relative z-10 w-full transform scale-90 sm:scale-100 origin-bottom">
              <iframe
                title="Overlay Preview"
                src={`/overlay/${currentMatch.id}?theme=${previewTheme}&transparent=true`}
                className="w-full h-36 border-0 bg-transparent pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Table of Themes (Exact CricScorer Pro Links style) */}
        <div className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4 w-12 text-center">No.</th>
                  <th className="py-4 px-6">Theme Name</th>
                  <th className="py-4 px-4">Price / Tier</th>
                  <th className="py-4 px-6">Scoreboard Link (PC + Mobile)</th>
                  <th className="py-4 px-6">CameraFi Mobile Link</th>
                  <th className="py-4 px-4 text-center">Live Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {themes.map((theme) => {
                  const pcLink = getOverlayUrl(theme.id);
                  const mobileLink = getOverlayUrl(theme.id, true);

                  return (
                    <tr
                      key={theme.id}
                      className={`hover:bg-slate-800/50 transition ${
                        previewTheme === theme.id ? 'bg-cyan-950/20' : ''
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
                            <span className="font-heading font-black text-base text-white">
                              {theme.name}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                              {theme.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 mt-0.5">{theme.description}</span>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold text-xs whitespace-nowrap">
                          {theme.tier}
                        </span>
                      </td>

                      {/* PC Link & Copy */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(pcLink, `pc-${theme.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition"
                          >
                            {copiedKey === `pc-${theme.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            <span>{copiedKey === `pc-${theme.id}` ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          <a
                            href={pcLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Open Link in New Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* CameraFi Mobile Link */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(mobileLink, `cam-${theme.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition"
                          >
                            {copiedKey === `cam-${theme.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Smartphone className="w-3.5 h-3.5 text-fuchsia-400" />
                            )}
                            <span>
                              {copiedKey === `cam-${theme.id}` ? 'Copied!' : 'CameraFi Link'}
                            </span>
                          </button>
                        </div>
                      </td>

                      {/* Live Preview Button */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setPreviewTheme(theme.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wide transition ${
                            previewTheme === theme.id
                              ? 'bg-cyan-400 text-slate-950 shadow-md ring-2 ring-cyan-400/50'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-2">
          <h4 className="font-heading font-black text-base text-cyan-400 uppercase tracking-wide flex items-center gap-2">
            <Monitor className="w-4 h-4" /> How to use in OBS Studio / vMix / Streamlabs:
          </h4>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Copy the desired theme link from the table above.</li>
            <li>In OBS Studio, click the <strong className="text-white">+</strong> icon under Sources and choose <strong className="text-white">Browser</strong>.</li>
            <li>Paste the copied URL into the URL field.</li>
            <li>Set Width to <strong className="text-cyan-400">1920</strong> and Height to <strong className="text-cyan-400">1080</strong>.</li>
            <li>Check <strong className="text-white">&quot;Shutdown source when not visible&quot;</strong> and click OK. The transparent scoreboard will appear immediately!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
