import React from 'react';
import { Match } from '../../types/cricket';

interface ThemeProps {
  match: Match;
}

export const AsiaCupTheme: React.FC<ThemeProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId);
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId);

  const oversDecimal = activeInning.legalBalls / 6;
  const crr = oversDecimal > 0 ? (activeInning.totalRuns / oversDecimal).toFixed(2) : '0.00';

  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 font-sans drop-shadow-2xl">
      {/* Asia Cup Classic Angular Scoreboard */}
      <div className="flex items-stretch bg-slate-950 border-t-4 border-amber-400 rounded-b-xl shadow-2xl overflow-hidden h-20 text-white">
        {/* Tournament Crest */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-5 flex flex-col justify-center items-center border-r-2 border-amber-400/50">
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-300">
            ASIA CUP
          </span>
          <span className="font-mono text-xs font-bold text-slate-200">2024</span>
        </div>

        {/* Batting Team Flag & Name */}
        <div className="flex items-center gap-3 px-5 bg-gradient-to-r from-blue-950 to-slate-900 border-r border-slate-800">
          {battingTeam.logoUrl ? (
            <img
              src={battingTeam.logoUrl}
              alt={battingTeam.name}
              className="w-10 h-10 object-contain rounded-md border border-amber-400 bg-white/10 p-0.5"
            />
          ) : (
            <div className="w-9 h-9 rounded-md bg-blue-600 border border-amber-400 flex items-center justify-center font-black text-sm">
              {battingTeam.shortName || 'BAN'}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-heading font-black text-lg text-white uppercase">{battingTeam.name || 'BANGLADESH'}</span>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              INNINGS {match.activeInningNumber}
            </span>
          </div>
        </div>

        {/* Score & Overs Center */}
        <div className="flex items-center gap-4 px-6 bg-slate-900 border-r-2 border-amber-400/60">
          <div className="font-score text-5xl font-black text-amber-400 leading-none tracking-tight">
            {activeInning.totalRuns}/{activeInning.wickets}
          </div>
          <div className="flex flex-col">
            <span className="font-score text-2xl font-bold text-white leading-none">
              {activeInning.oversDisplay} <span className="text-xs text-slate-400">/ {match.overs}</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">CRR: {crr}</span>
          </div>
        </div>

        {/* Batters */}
        <div className="flex-1 flex items-center justify-around px-4 bg-slate-950 border-r border-slate-800">
          {/* Striker */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-sm uppercase text-emerald-400">
              {striker?.shortName || striker?.name || 'T. TAMIM'}*
            </span>
            <span className="font-score text-2xl font-bold text-white">
              {striker?.runs || 0}
            </span>
            <span className="text-xs text-slate-400">({striker?.balls || 0})</span>
          </div>

          {/* Non-Striker */}
          <div className="flex items-center gap-2 opacity-80">
            <span className="font-bold text-sm uppercase text-slate-200">
              {nonStriker?.shortName || nonStriker?.name || 'N. SHANTO'}
            </span>
            <span className="font-score text-2xl font-bold text-slate-300">
              {nonStriker?.runs || 0}
            </span>
            <span className="text-xs text-slate-400">({nonStriker?.balls || 0})</span>
          </div>
        </div>

        {/* Bowler & Over Balls */}
        <div className="flex items-center gap-5 px-6 bg-slate-900">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase text-white truncate max-w-[120px]">
              {bowler?.shortName || bowler?.name || 'A. RASHID'}
            </span>
            <span className="text-xs font-mono text-amber-400">
              {bowler?.wickets}-{bowler?.runsConceded} ({bowler?.oversBowled})
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5].map((slot) => {
              const b = activeInning.currentOverBalls[slot];
              return (
                <div
                  key={slot}
                  className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-bold ${
                    b
                      ? b.isWicket
                        ? 'bg-red-600 text-white'
                        : b.runsOffBat === 4 || b.runsOffBat === 6
                        ? 'bg-amber-400 text-black'
                        : 'bg-white text-black'
                      : 'bg-slate-800 border border-slate-700'
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
