import React from 'react';
import { Match } from '../../types/cricket';

interface ThemeProps {
  match: Match;
}

export const CWC23Theme: React.FC<ThemeProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId);
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId);

  const oversDecimal = activeInning.legalBalls / 6;
  const crr = oversDecimal > 0 ? (activeInning.totalRuns / oversDecimal).toFixed(2) : '0.00';

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 font-sans drop-shadow-2xl">
      {/* CWC 23 Gold Edition obsidian black & gold filigree */}
      <div className="flex items-stretch bg-gradient-to-r from-neutral-950 via-slate-900 to-neutral-950 rounded-2xl border-2 border-yellow-500/70 shadow-2xl overflow-hidden h-24 text-white">
        {/* ICC Emblem */}
        <div className="bg-gradient-to-b from-yellow-600 via-amber-500 to-yellow-700 px-6 flex flex-col justify-center items-center text-slate-950 shadow-inner">
          <span className="font-heading font-black text-xs tracking-widest uppercase">
            ICC CWC
          </span>
          <span className="font-score text-3xl font-black leading-none">2023</span>
        </div>

        {/* Batting Team Crest */}
        <div className="flex items-center gap-4 px-6 border-r border-yellow-500/30">
          {battingTeam.logoUrl && (
            <img
              src={battingTeam.logoUrl}
              alt={battingTeam.name}
              className="w-12 h-12 object-contain rounded-xl bg-black/40 p-1 border border-yellow-500/40 shadow-lg"
            />
          )}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-400">
              {match.matchType.toUpperCase()}
            </span>
            <span className="font-heading font-black text-2xl tracking-wider text-white uppercase drop-shadow">
              {battingTeam.name}
            </span>
          </div>
        </div>

        {/* Center Score Badge */}
        <div className="flex items-center gap-5 px-8 bg-neutral-900/90 border-r-2 border-yellow-500/50">
          <div className="font-score text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-500 drop-shadow">
            {activeInning.totalRuns} - {activeInning.wickets}
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase font-extrabold tracking-widest text-yellow-400">
              OVERS
            </span>
            <span className="font-score text-3xl font-bold text-white leading-none">
              {activeInning.oversDisplay} <span className="text-xs font-sans text-slate-400">/ {match.overs}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-300">CRR {crr}</span>
          </div>
        </div>

        {/* Batters */}
        <div className="flex-1 flex items-center justify-around px-6 border-r border-yellow-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-yellow-400 overflow-hidden bg-slate-800">
              {striker?.photoUrl && <img src={striker.photoUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <span className="font-bold text-sm uppercase text-yellow-300 flex items-center gap-1">
                {striker?.shortName || striker?.name}*
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-score text-2xl font-bold text-white">{striker?.runs || 0}</span>
                <span className="text-xs text-slate-400">({striker?.balls || 0})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-80">
            <div className="w-9 h-9 rounded-full border border-slate-600 overflow-hidden bg-slate-800">
              {nonStriker?.photoUrl && <img src={nonStriker.photoUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div>
              <span className="font-bold text-sm uppercase text-slate-200">
                {nonStriker?.shortName || nonStriker?.name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-score text-2xl font-bold text-slate-300">{nonStriker?.runs || 0}</span>
                <span className="text-xs text-slate-400">({nonStriker?.balls || 0})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bowler */}
        <div className="flex items-center gap-5 px-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-yellow-400">BOWLING</span>
            <span className="font-heading font-black text-base uppercase text-white truncate max-w-[130px]">
              {bowler?.name || 'M STARC'}
            </span>
            <span className="font-mono text-sm text-yellow-300">
              {bowler?.wickets}-{bowler?.runsConceded} ({bowler?.oversBowled})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((slot) => {
              const b = activeInning.currentOverBalls[slot];
              return (
                <div
                  key={slot}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    b
                      ? b.isWicket
                        ? 'bg-red-600 text-white'
                        : b.runsOffBat === 4 || b.runsOffBat === 6
                        ? 'bg-yellow-400 text-slate-950 font-black'
                        : 'bg-white text-slate-950'
                      : 'bg-yellow-950/40 border border-yellow-500/30 text-transparent'
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
