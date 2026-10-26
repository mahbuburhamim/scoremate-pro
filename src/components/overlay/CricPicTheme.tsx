import React from 'react';
import { Match, Player } from '../../types/cricket';
import { Play } from 'lucide-react';

interface ThemeProps {
  match: Match;
}

export const CricPicTheme: React.FC<ThemeProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId);
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId);

  // Sub-ticker rotating or contextual message
  const oversDecimal = activeInning.legalBalls / 6;
  const currentRunRate = oversDecimal > 0 ? (activeInning.totalRuns / oversDecimal).toFixed(2) : '0.00';
  const totalFours = battingTeam.players.reduce((sum, p) => sum + (p.fours || 0), 0);
  const totalSixes = battingTeam.players.reduce((sum, p) => sum + (p.sixes || 0), 0);

  const tossWinner = match.tossWonByTeamId === match.team1.id ? match.team1.name : match.team2.name;
  const tossSummary = `TOSS: ${tossWinner} OPTED TO ${match.tossDecision.toUpperCase()}`;

  // Dynamic colors with fallback
  const team1Bg = battingTeam.primaryColor || '#1d4ed8';
  const team2Bg = bowlingTeam.primaryColor || '#eab308';

  return (
    <div className="w-full max-w-[1240px] mx-auto px-2 drop-shadow-2xl font-sans">
      <div className="flex items-stretch justify-center h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        {/* ================= LEFT WING: BATTING TEAM & BATTERS ================= */}
        <div
          style={{
            background: `linear-gradient(135deg, ${team1Bg} 0%, #0f172a 100%)`,
          }}
          className="flex-1 flex items-center justify-between px-4 sm:px-6 py-2 text-white border-r border-white/20"
        >
          {/* Batting Team Badge */}
          <div className="flex items-center gap-3 pr-3 border-r border-white/10 shrink-0">
            {battingTeam.logoUrl && (
              <img
                src={battingTeam.logoUrl}
                alt={battingTeam.name}
                className="w-10 h-10 object-contain rounded-xl bg-black/40 p-1 border border-white/20 shadow-md"
              />
            )}
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                BATTING
              </span>
              <span className="font-heading font-black text-lg sm:text-xl tracking-wider uppercase drop-shadow">
                {battingTeam.name}
              </span>
            </div>
          </div>

          {/* Batters List */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-hidden">
            {/* Striker */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                {striker?.photoUrl ? (
                  <img
                    src={striker.photoUrl}
                    alt={striker.name}
                    className="w-12 sm:w-14 h-12 sm:h-14 rounded-full object-cover border-2 border-emerald-400 shadow-lg ring-2 ring-emerald-400/40"
                  />
                ) : (
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center font-bold text-base sm:text-lg text-emerald-300">
                    {striker?.name?.[0] || 'T'}
                  </div>
                )}
                {/* Active Strike Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center shadow">
                  <Play className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-sm sm:text-base tracking-wide uppercase text-white truncate max-w-[130px]">
                    {striker?.shortName || striker?.name || 'T. TAMIM'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono">*</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-score text-2xl sm:text-3xl font-bold text-emerald-400 leading-none">
                    {striker?.runs || 0}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">({striker?.balls || 0})</span>
                  <span className="text-[10px] text-slate-400 ml-1">
                    4s: {striker?.fours || 0} 6s: {striker?.sixes || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Non-Striker */}
            <div className="flex items-center gap-2.5 sm:gap-3 pl-3 sm:pl-4 border-l border-white/10 opacity-90">
              <div className="relative">
                {nonStriker?.photoUrl ? (
                  <img
                    src={nonStriker.photoUrl}
                    alt={nonStriker.name}
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-slate-400/80 shadow"
                  />
                ) : (
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center font-bold text-sm sm:text-base text-slate-300">
                    {nonStriker?.name?.[0] || 'N'}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span className="font-heading font-bold text-xs sm:text-sm tracking-wide uppercase text-slate-200 truncate max-w-[120px]">
                  {nonStriker?.shortName || nonStriker?.name || 'N. SHANTO'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-score text-xl sm:text-2xl font-bold text-slate-100 leading-none">
                    {nonStriker?.runs || 0}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">({nonStriker?.balls || 0})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER CAPSULE: METALLIC MATCH SCORE BADGE ================= */}
        <div className="relative w-72 sm:w-80 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 text-slate-950 flex flex-col justify-between px-3 sm:px-4 py-1.5 shadow-2xl shrink-0 border-x-2 border-amber-400/60">
          {/* Metallic Top Highlights */}
          <div className="flex items-center justify-between text-slate-700 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            <span className="bg-slate-950 text-white px-2 py-0.5 rounded font-mono">
              {battingTeam.shortName || 'BAN'}
            </span>
            <span className="font-mono">{match.matchNo || 'MATCH 28'}</span>
            <span className="bg-amber-400/80 text-slate-950 px-1.5 py-0.5 rounded font-black">
              INN {match.activeInningNumber}
            </span>
          </div>

          {/* Big Score Display */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 -my-1">
            <div className="font-score text-4xl sm:text-5xl font-black tracking-tight text-slate-950 drop-shadow">
              {activeInning.totalRuns} - {activeInning.wickets}
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
                OVERS
              </span>
              <span className="font-score text-2xl sm:text-3xl font-bold text-slate-800">
                {activeInning.oversDisplay}
                <span className="text-xs sm:text-sm font-sans font-medium text-slate-500">/{match.overs}</span>
              </span>
            </div>
          </div>

          {/* Sub-ticker Bar */}
          <div className="w-full bg-slate-950 text-yellow-300 px-2 py-0.5 rounded flex items-center justify-between text-[9px] sm:text-[10px] font-bold tracking-wider overflow-hidden">
            <span>CRR: {currentRunRate}</span>
            <span className="truncate max-w-[130px] font-mono text-[9px] text-white">
              {match.targetRuns ? `TARGET: ${match.targetRuns}` : tossSummary}
            </span>
            <span>4s:{totalFours} 6s:{totalSixes}</span>
          </div>
        </div>

        {/* ================= RIGHT WING: BOWLER & OVER BALL BUBBLES ================= */}
        <div
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, ${team2Bg} 100%)`,
          }}
          className="flex-1 flex items-center justify-between px-4 sm:px-6 py-2 text-white border-l border-white/20"
        >
          {/* Bowler Details */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              {bowler?.photoUrl ? (
                <img
                  src={bowler.photoUrl}
                  alt={bowler.name}
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-full object-cover border-2 border-cyan-400 shadow-lg ring-2 ring-cyan-400/40"
                />
              ) : (
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center font-bold text-base sm:text-lg text-cyan-300">
                  {bowler?.name?.[0] || 'A'}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-300">
                BOWLING
              </span>
              <span className="font-heading font-black text-sm sm:text-base tracking-wide uppercase text-white truncate max-w-[140px]">
                {bowler?.shortName || bowler?.name || 'A. RASHID'}
              </span>
              <div className="flex items-baseline gap-1 text-slate-200">
                <span className="font-score text-xl sm:text-2xl font-bold leading-none text-white">
                  {bowler?.wickets || 0} - {bowler?.runsConceded || 0}
                </span>
                <span className="text-xs font-semibold text-slate-300">({bowler?.oversBowled || 0} ov)</span>
              </div>
            </div>
          </div>

          {/* Current Over 6 Ball Bubbles */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
              THIS OVER
            </span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                const ball = activeInning.currentOverBalls[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition ${
                      ball
                        ? ball.isWicket
                          ? 'bg-red-600 text-white font-black'
                          : ball.runsOffBat === 4
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : ball.runsOffBat === 6
                          ? 'bg-fuchsia-500 text-white font-black'
                          : ball.extraType === 'wide' || ball.extraType === 'noBall'
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-white text-slate-950'
                        : 'bg-white/20 border border-white/30 text-transparent'
                    }`}
                  >
                    {ball ? ball.displayCode : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bowling Team Badge */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/10 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-300">
                FIELDING
              </span>
              <span className="font-heading font-black text-xl tracking-wider uppercase drop-shadow text-white">
                {bowlingTeam.name}
              </span>
            </div>
            {bowlingTeam.logoUrl && (
              <img
                src={bowlingTeam.logoUrl}
                alt={bowlingTeam.name}
                className="w-11 h-11 object-contain rounded-xl bg-black/40 p-1 border border-white/20 shadow-md"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
