import React from 'react';
import { Match } from '../../types/cricket';

interface ThemeProps {
  match: Match;
}

export const Special2023Theme: React.FC<ThemeProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  // Striker & Non-Striker resolution
  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId) || battingTeam.players[0];
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId) || battingTeam.players[1];
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId) || bowlingTeam.players[0];

  // Team Short Codes
  const battingTeamCode = battingTeam?.shortName?.toUpperCase() || battingTeam?.name?.substring(0, 3).toUpperCase() || 'IND';
  const bowlingTeamCode = bowlingTeam?.shortName?.toUpperCase() || bowlingTeam?.name?.substring(0, 3).toUpperCase() || 'AUS';

  // Batter names (last name or full uppercase)
  const strikerName = (striker?.shortName || striker?.name || 'SURYAKUMAR').toUpperCase();
  const nonStrikerName = (nonStriker?.shortName || nonStriker?.name || 'GAIKWAD').toUpperCase();
  const bowlerName = (bowler?.shortName || bowler?.name || 'ELLIS').toUpperCase();

  // Bowler stats
  const bowlerWickets = bowler?.wickets ?? 0;
  const bowlerRuns = bowler?.runsConceded ?? 0;
  const bowlerOvers = bowler?.oversBowled ?? '0.0';

  // Ball-by-ball slots (minimum 6)
  const overBalls = activeInning.currentOverBalls || [];
  const slotCount = Math.max(6, overBalls.length);
  const ballSlots = Array.from({ length: slotCount }).map((_, i) => overBalls[i]);

  return (
    <div className="w-full max-w-[1340px] mx-auto px-2 font-sans select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]">
      {/* Outer Pill Container */}
      <div className="relative flex items-stretch h-[68px] rounded-full border border-white/25 overflow-hidden shadow-2xl bg-gradient-to-r from-[#031544] via-[#06226b] to-[#031544]">
        {/* Specular glassy shine on top edge */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

        {/* Ambient radial lighting flares behind sections */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* ================= 1. BATTING TEAM LOGO, CODE & OVERS ================= */}
        <div className="relative flex items-center gap-3 pl-5 pr-5 border-r border-white/15 shrink-0 bg-gradient-to-r from-[#021035] to-[#051c57]">
          {/* Batting Team Logo / Emblem */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            {battingTeam?.logoUrl ? (
              <img
                src={battingTeam.logoUrl}
                alt={battingTeam.name}
                className="w-10 h-10 object-contain rounded-full bg-white/5 p-0.5 shadow-md"
              />
            ) : (
              /* Authentic BCCI-style blue radial star emblem */
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 via-sky-600 to-indigo-950 p-[1.5px] shadow-lg flex items-center justify-center border border-white/30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="#041a54" stroke="#ffcc00" strokeWidth="2.5" />
                  {/* Starburst rays */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="50"
                      y1="10"
                      x2="50"
                      y2="90"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1.5"
                      transform={`rotate(${deg} 50 50)`}
                    />
                  ))}
                  <polygon
                    points="50,22 58,40 78,42 62,56 67,76 50,65 33,76 38,56 22,42 42,40"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle cx="50" cy="50" r="9" fill="#031544" stroke="#ffcc00" strokeWidth="1.5" />
                </svg>
              </div>
            )}
          </div>

          {/* Batting Team Code & Overs */}
          <div className="flex flex-col justify-center leading-none">
            <span className="font-heading font-black text-2xl tracking-wider text-white drop-shadow">
              {battingTeamCode}
            </span>
            <span className="font-sans font-bold text-sm tracking-wide text-cyan-200 mt-1">
              {activeInning.oversDisplay || '0.0'}
            </span>
          </div>

          {/* Bottom Orange Accent Underline Bar */}
          <div className="absolute bottom-0 left-4 right-3 h-[3.5px] bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </div>

        {/* ================= 2. MAIN SCORE (RUNS-WICKETS) ================= */}
        <div className="flex items-center px-6 border-r border-white/15 shrink-0 bg-[#041d5e]/70">
          <span className="font-sans font-black text-[38px] leading-none tracking-tight text-[#ff7800] drop-shadow-[0_2px_8px_rgba(255,120,0,0.4)]">
            {activeInning.totalRuns}-{activeInning.wickets}
          </span>
        </div>

        {/* ================= 3. BATTERS (STRIKER & NON-STRIKER) ================= */}
        <div className="flex-1 flex flex-col justify-center px-4 min-w-[210px] max-w-[280px] border-r border-white/15">
          {/* Striker Row */}
          <div className="flex items-center justify-between pb-1 border-b border-white/15">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Orange Triangle Striker Indicator */}
              <span className="text-[#ff7800] text-[11px] font-black leading-none shrink-0 drop-shadow">
                ▶
              </span>
              <span className="font-heading font-black text-sm uppercase text-white tracking-wider truncate">
                {strikerName}
              </span>
            </div>
            <div className="flex items-baseline pl-2 shrink-0">
              <span className="font-sans font-black text-lg text-white leading-none">
                {striker?.runs ?? 0}
              </span>
              <span className="font-sans font-bold text-[11px] text-slate-300 ml-1 leading-none">
                {striker?.balls ?? 0}
              </span>
            </div>
          </div>

          {/* Non-Striker Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 min-w-0 pl-[15px]">
              <span className="font-heading font-black text-sm uppercase text-slate-100 tracking-wider truncate opacity-95">
                {nonStrikerName}
              </span>
            </div>
            <div className="flex items-baseline pl-2 shrink-0">
              <span className="font-sans font-black text-lg text-white leading-none">
                {nonStriker?.runs ?? 0}
              </span>
              <span className="font-sans font-bold text-[11px] text-slate-300 ml-1 leading-none">
                {nonStriker?.balls ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* ================= 4. CENTER SPONSOR / CHANNEL BADGE ================= */}
        <div className="flex items-center justify-center px-5 shrink-0 bg-gradient-to-b from-[#87e8ff] via-[#48cbf8] to-[#27baf4] border-r border-sky-400/40 shadow-inner">
          <span className="font-heading font-black text-base tracking-wider text-[#031d4e] uppercase drop-shadow-sm">
            BCCI.TV
          </span>
        </div>

        {/* ================= 5. OPPONENT MATCHUP ================= */}
        <div className="flex items-center px-4 shrink-0 border-r border-white/15 bg-[#041a54]/80">
          <span className="font-sans font-semibold text-xs text-slate-300 mr-1.5 italic">v</span>
          <span className="font-heading font-black text-lg text-white tracking-wider">
            {bowlingTeamCode}
          </span>
        </div>

        {/* ================= 6. BOWLING TEAM LOGO ================= */}
        <div className="relative flex items-center justify-center px-4 shrink-0 border-r border-white/15 bg-gradient-to-r from-[#041b57] to-[#031448]">
          <div className="w-10 h-10 flex items-center justify-center">
            {bowlingTeam?.logoUrl ? (
              <img
                src={bowlingTeam.logoUrl}
                alt={bowlingTeam.name}
                className="w-9 h-9 object-contain rounded-md bg-white/5 p-0.5 shadow-md"
              />
            ) : (
              /* Authentic Australia-style shield SVG */
              <div className="w-9 h-9 rounded-md bg-gradient-to-b from-blue-900 to-indigo-950 p-0.5 shadow-md flex items-center justify-center border border-white/25">
                <svg viewBox="0 0 100 120" className="w-7 h-8 drop-shadow">
                  <path
                    d="M10 10 L90 10 L90 70 Q90 110 50 120 Q10 110 10 70 Z"
                    fill="#041f5a"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  {/* Sunburst rays in shield */}
                  <circle cx="50" cy="50" r="16" fill="#fbbf24" />
                  <path
                    d="M50 20 L50 40 M20 50 L40 50 M80 50 L60 50 M30 30 L44 44 M70 30 L56 44"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Bottom Yellow Accent Underline Bar */}
          <div className="absolute bottom-0 left-2 right-2 h-[3.5px] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
        </div>

        {/* ================= 7. BOWLER & OVER BALL-BY-BALL TRACKER ================= */}
        <div className="flex-1 flex flex-col justify-center px-4 min-w-[200px] pr-6 bg-gradient-to-r from-[#041c59] to-[#020e30]">
          {/* Bowler Row */}
          <div className="flex items-center justify-between pb-1 border-b border-white/15">
            <span className="font-heading font-black text-sm uppercase text-white tracking-wider truncate">
              {bowlerName}
            </span>
            <div className="flex items-baseline pl-2 shrink-0">
              <span className="font-sans font-black text-base text-white leading-none">
                {bowlerWickets}-{bowlerRuns}
              </span>
              <span className="font-sans font-bold text-[11px] text-slate-300 ml-1 leading-none">
                {bowlerOvers}
              </span>
            </div>
          </div>

          {/* Ball-by-Ball Tracker Row */}
          <div className="flex items-center gap-1.5 pt-1">
            {ballSlots.map((b, idx) => {
              if (!b) {
                return (
                  <div
                    key={idx}
                    className="w-[22px] h-[19px] rounded-[3px] bg-slate-800/60 border border-slate-600/40 shrink-0"
                  />
                );
              }

              let bgClass = 'bg-white text-slate-950 font-black';
              let text = b.displayCode || `${b.runsOffBat + (b.extraRuns || 0)}`;

              if (b.isWicket) {
                bgClass = 'bg-red-600 text-white font-black';
                text = 'W';
              } else if (b.runsOffBat === 4 || b.runsOffBat === 6) {
                bgClass = 'bg-amber-400 text-slate-950 font-black';
              } else if (b.extraType === 'wide') {
                bgClass = 'bg-white text-slate-950 font-black';
                text = 'WD';
              } else if (b.extraType === 'noBall') {
                bgClass = 'bg-white text-slate-950 font-black';
                text = 'NB';
              }

              return (
                <div
                  key={idx}
                  className={`w-[22px] h-[19px] rounded-[3px] flex items-center justify-center text-[10px] shadow-sm shrink-0 leading-none ${bgClass}`}
                >
                  {text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
