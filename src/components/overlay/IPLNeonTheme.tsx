import React from 'react';
import { Match } from '../../types/cricket';

interface ThemeProps {
  match: Match;
}

export const IPLNeonTheme: React.FC<ThemeProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId);
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId);

  const oversDecimal = activeInning.legalBalls / 6;
  const crr = oversDecimal > 0 ? (activeInning.totalRuns / oversDecimal).toFixed(2) : '0.00';

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 font-mono-sport drop-shadow-2xl">
      {/* IPL Cyber Neon angled HUD bar */}
      <div className="flex items-stretch bg-slate-950/95 rounded-2xl border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] overflow-hidden h-24 text-white">
        {/* Neon Badge */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 flex flex-col justify-center items-center shadow-lg">
          <span className="font-heading font-black text-xs tracking-widest uppercase text-white">
            CYBER IPL
          </span>
          <span className="font-score text-3xl font-black text-yellow-300 leading-none">2024</span>
        </div>

        {/* Batting Team Tag */}
        <div className="flex items-center gap-3 px-6 bg-slate-900 border-r border-cyan-500/40">
          <div className="px-3 py-1 rounded bg-cyan-500 text-slate-950 font-black text-base shadow-[0_0_10px_rgba(6,182,212,0.6)]">
            {battingTeam.shortName}
          </div>
          <span className="font-heading font-black text-xl uppercase tracking-wider text-white">
            {battingTeam.name}
          </span>
        </div>

        {/* Center Score Core */}
        <div className="flex items-center gap-5 px-8 bg-black/60 border-r border-fuchsia-500/40">
          <div className="font-score text-6xl font-black text-cyan-400 tracking-tight drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            {activeInning.totalRuns}/{activeInning.wickets}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-pink-400 uppercase tracking-widest">
              OV {activeInning.oversDisplay} / {match.overs}
            </span>
            <span className="text-xs font-mono text-emerald-400">CRR: {crr}</span>
          </div>
        </div>

        {/* Batters */}
        <div className="flex-1 flex items-center justify-around px-6 border-r border-cyan-500/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg border-2 border-cyan-400 bg-slate-900 overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              {striker?.photoUrl && <img src={striker.photoUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <span className="font-bold text-sm uppercase text-cyan-300 flex items-center gap-1">
                ▶ {striker?.shortName || striker?.name}*
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-score text-3xl font-bold text-white">{striker?.runs || 0}</span>
                <span className="text-xs text-slate-400 font-mono">({striker?.balls || 0})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-80">
            <div className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
              {nonStriker?.photoUrl && <img src={nonStriker.photoUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <span className="font-bold text-sm uppercase text-slate-300">
                {nonStriker?.shortName || nonStriker?.name}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-score text-2xl font-bold text-slate-300">{nonStriker?.runs || 0}</span>
                <span className="text-xs text-slate-400 font-mono">({nonStriker?.balls || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bowler */}
        <div className="flex items-center gap-5 px-6 bg-slate-900/80">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-pink-400">BOWLER</span>
            <span className="font-heading font-black text-base uppercase text-white truncate max-w-[130px]">
              {bowler?.name || 'M STARC'}
            </span>
            <span className="font-mono text-sm text-cyan-300">
              {bowler?.wickets}-{bowler?.runsConceded} ({bowler?.oversBowled})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((slot) => {
              const b = activeInning.currentOverBalls[slot];
              return (
                <div
                  key={slot}
                  className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs ${
                    b
                      ? b.isWicket
                        ? 'bg-rose-600 text-white font-black shadow-[0_0_8px_rgba(225,29,72,0.8)]'
                        : b.runsOffBat === 4 || b.runsOffBat === 6
                        ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'bg-white text-slate-950'
                      : 'bg-slate-950 border border-slate-800 text-transparent'
                  }`}
                >
                  {b ? b.displayCode : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
