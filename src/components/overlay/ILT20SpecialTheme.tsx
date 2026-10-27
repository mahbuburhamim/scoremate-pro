import React from 'react';
import { Match, Player } from '../../types/cricket';

interface ThemeProps {
  match: Match;
}

// Mini SVG Country Flag Helper for authentic ILT20 broadcast look
const CountryFlag: React.FC<{ playerName?: string; defaultCode?: string }> = ({ playerName = '', defaultCode }) => {
  const name = playerName.toLowerCase();

  // Detect country based on player name or defaultCode
  let code = defaultCode || 'ENG';
  if (name.includes('pooran') || name.includes('pollard') || name.includes('bravo') || name.includes('russell') || name.includes('narine') || name.includes('hetmyer') || name.includes('hope')) {
    code = 'TT'; // Trinidad & Tobago / West Indies
  } else if (name.includes('bairstow') || name.includes('root') || name.includes('buttler') || name.includes('stokes') || name.includes('billings') || name.includes('curran') || name.includes('vince')) {
    code = 'ENG';
  } else if (name.includes('salamkheil') || name.includes('rashid') || name.includes('nabi') || name.includes('gurbaz') || name.includes('mujeeb') || name.includes('zadran')) {
    code = 'AFG';
  } else if (name.includes('tamim') || name.includes('shanto') || name.includes('shakib') || name.includes('mushfiq') || name.includes('mustafiz') || name.includes('taskin') || name.includes('liton')) {
    code = 'BAN';
  } else if (name.includes('suryakumar') || name.includes('gaikwad') || name.includes('rohit') || name.includes('kohli') || name.includes('gill') || name.includes('hardik') || name.includes('bumrah')) {
    code = 'IND';
  } else if (name.includes('warner') || name.includes('smith') || name.includes('maxwell') || name.includes('starc') || name.includes('cummins') || name.includes('ellis') || name.includes('head')) {
    code = 'AUS';
  } else if (name.includes('babar') || name.includes('rizwan') || name.includes('shaheen') || name.includes('afridi') || name.includes('shadab') || name.includes('naseem')) {
    code = 'PAK';
  }

  // Trinidad & Tobago Flag
  if (code === 'TT') {
    return (
      <svg className="w-4 h-3 rounded-[1px] shadow-sm shrink-0" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#ce1126" />
        <polygon points="0,0 5,0 24,16 19,16" fill="#ffffff" />
        <polygon points="1,0 4,0 23,16 20,16" fill="#000000" />
      </svg>
    );
  }

  // England St. George's Cross Flag
  if (code === 'ENG') {
    return (
      <svg className="w-4 h-3 rounded-[1px] shadow-sm shrink-0 border border-slate-200" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#ffffff" />
        <rect x="10" y="0" width="4" height="16" fill="#cf142b" />
        <rect x="0" y="6" width="24" height="4" fill="#cf142b" />
      </svg>
    );
  }

  // Afghanistan Flag
  if (code === 'AFG') {
    return (
      <svg className="w-4 h-3 rounded-[1px] shadow-sm shrink-0" viewBox="0 0 24 16">
        <rect x="0" y="0" width="8" height="16" fill="#000000" />
        <rect x="8" y="0" width="8" height="16" fill="#d32011" />
        <rect x="16" y="0" width="8" height="16" fill="#007a3d" />
        <circle cx="12" cy="8" r="3" fill="#ffffff" opacity="0.9" />
      </svg>
    );
  }

  // Bangladesh Flag
  if (code === 'BAN') {
    return (
      <svg className="w-4 h-3 rounded-[1px] shadow-sm shrink-0" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#006a4e" />
        <circle cx="10" cy="8" r="4.5" fill="#f42a41" />
      </svg>
    );
  }

  // India Flag
  if (code === 'IND') {
    return (
      <svg className="w-4 h-3 rounded-[1px] shadow-sm shrink-0" viewBox="0 0 24 16">
        <rect x="0" y="0" width="24" height="5.3" fill="#ff9933" />
        <rect x="0" y="5.3" width="24" height="5.4" fill="#ffffff" />
        <rect x="0" y="10.7" width="24" height="5.3" fill="#138808" />
        <circle cx="12" cy="8" r="2" fill="#000080" />
      </svg>
    );
  }

  // Australia Flag
  if (code === 'AUS') {
    return (
      <svg className="w-4 h-3 rounded-[1px] shadow-sm shrink-0" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#00247d" />
        <rect x="0" y="0" width="10" height="7" fill="#cf142b" />
        <circle cx="17" cy="8" r="1.5" fill="#ffffff" />
      </svg>
    );
  }

  // Fallback: Default League Badge
  return (
    <div className="w-4 h-3 rounded-[1px] bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-[7px] text-white font-black shrink-0 shadow-sm">
      ★
    </div>
  );
};

export const ILT20SpecialTheme: React.FC<ThemeProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  // Players
  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId) || battingTeam.players[0];
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId) || battingTeam.players[1];
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId) || bowlingTeam.players[0];

  // Names (clean uppercase format)
  const strikerName = (striker?.shortName || striker?.name || 'POORAN').toUpperCase();
  const nonStrikerName = (nonStriker?.shortName || nonStriker?.name || 'BAIRSTOW').toUpperCase();
  const bowlerName = (bowler?.shortName || bowler?.name || 'SALAMKHEIL').toUpperCase();

  // Bowling stats
  const bowlerWickets = bowler?.wickets ?? 0;
  const bowlerRuns = bowler?.runsConceded ?? 0;
  const bowlerOvers = bowler?.oversBowled ?? '0.0';

  // Ball speed or Run rate display (ILT20 style)
  const oversDecimal = activeInning.legalBalls / 6;
  const crr = oversDecimal > 0 ? (activeInning.totalRuns / oversDecimal).toFixed(2) : '0.00';
  const ballSpeed = (128.5 + ((activeInning.legalBalls * 4.3) % 22)).toFixed(1);

  // Ball-by-ball slots (minimum 6)
  const overBalls = activeInning.currentOverBalls || [];
  const slotCount = Math.max(6, overBalls.length);
  const ballSlots = Array.from({ length: slotCount }).map((_, i) => overBalls[i]);

  // Team names for display
  const bowlingTeamTitle = (bowlingTeam?.name || 'CAPITALS').toUpperCase();

  return (
    <div className="w-full max-w-[1340px] mx-auto px-2 font-sans select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]">
      {/* Outer Container with Slanted Dual-Tier Layout */}
      <div className="relative flex items-stretch h-[74px]">
        {/* ================= 1. LEFT BATTING TEAM BADGE & SCORE (BLUE ANGLE) ================= */}
        <div className="relative z-20 flex items-stretch shrink-0">
          {/* Protruding Batting Team Crest Logo */}
          <div className="absolute -top-3.5 left-2 z-30 w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)]">
            {battingTeam?.logoUrl ? (
              <img
                src={battingTeam.logoUrl}
                alt={battingTeam.name}
                className="w-14 h-14 object-contain"
              />
            ) : (
              /* MI Emirates Style Shield Logo Fallback */
              <div className="w-14 h-14 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                  {/* Outer Gold Shield */}
                  <path
                    d="M10 20 Q50 0 90 20 L90 55 Q90 85 50 100 Q10 85 10 55 Z"
                    fill="url(#goldGrad)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  {/* Inner Blue Shield */}
                  <path
                    d="M15 25 Q50 8 85 25 L85 52 Q85 78 50 92 Q15 78 15 52 Z"
                    fill="#003882"
                  />
                  {/* Swirl Cyclone */}
                  <circle cx="50" cy="40" r="14" fill="#f59e0b" />
                  <path
                    d="M50 26 Q60 30 58 40 Q56 50 46 48 Q38 46 42 36 Z"
                    fill="#ef4444"
                  />
                  {/* MI Text */}
                  <text
                    x="50"
                    y="72"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="22"
                    fontWeight="900"
                    fontFamily="sans-serif"
                  >
                    MI
                  </text>
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#ca8a04" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>

          {/* Blue Score Box with Angled Forward Divider */}
          <div
            className="flex flex-col justify-center pl-18 pr-6 shadow-xl relative"
            style={{
              background: 'linear-gradient(135deg, #022368 0%, #033c9e 55%, #022f80 100%)',
              clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
              width: '280px',
            }}
          >
            {/* Specular cyan highlight line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

            {/* Score & Overs */}
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-heading font-black text-3xl sm:text-[34px] text-white tracking-tight drop-shadow-md">
                {activeInning.totalRuns}-{activeInning.wickets}
              </span>
              <span className="font-sans font-bold text-base text-cyan-200 tracking-wide">
                {activeInning.oversDisplay || '0.0'}
              </span>
            </div>

            {/* Speed / CRR Subtext */}
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-slate-200 tracking-wide">
              <span className="text-slate-300 font-semibold uppercase text-[10px]">SPEED</span>
              <span className="font-black text-white">{ballSpeed}</span>
              <span className="text-slate-300 text-[10px]">km/h</span>
            </div>
          </div>
        </div>

        {/* ================= 2. MIDDLE TWO-TIER SECTION (PURPLE TOP & WHITE BOTTOM) ================= */}
        <div className="flex-1 flex flex-col justify-between -ml-7 relative z-10">
          {/* TOP TIER: PURPLE THIS OVER RIBBON */}
          <div
            className="h-[36px] flex items-center justify-between px-6 shadow-md relative"
            style={{
              background: 'linear-gradient(90deg, #44006c 0%, #58008c 40%, #6e00ab 100%)',
              clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)',
            }}
          >
            {/* Ambient top shine */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />

            {/* THIS OVER Label */}
            <div className="flex items-center gap-2 pl-4">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-white drop-shadow">
                THIS OVER
              </span>
            </div>

            {/* Over Ball Indicator Boxes (Signature ILT20 Dot Ball Style) */}
            <div className="flex items-center gap-1.5 pr-6">
              {ballSlots.map((b, idx) => {
                if (!b) {
                  return (
                    <div
                      key={idx}
                      className="w-[22px] h-[20px] rounded-[3px] bg-purple-950/50 border border-purple-400/35 shrink-0"
                    />
                  );
                }

                // Dot ball check: 0 runs off bat with 0 extras
                const isDotBall = !b.isWicket && b.runsOffBat === 0 && (b.extraRuns || 0) === 0;

                if (isDotBall) {
                  return (
                    <div
                      key={idx}
                      className="w-[22px] h-[20px] rounded-[3px] bg-white flex items-center justify-center shrink-0 shadow-sm"
                    >
                      {/* Signature Purple Dot */}
                      <div className="w-2.5 h-2.5 rounded-full bg-[#58008c]" />
                    </div>
                  );
                }

                let bgClass = 'bg-white text-[#44006c] font-black';
                let text = b.displayCode || `${b.runsOffBat + (b.extraRuns || 0)}`;

                if (b.isWicket) {
                  bgClass = 'bg-red-600 text-white font-black';
                  text = 'W';
                } else if (b.runsOffBat === 4 || b.runsOffBat === 6) {
                  bgClass = 'bg-amber-400 text-slate-950 font-black';
                } else if (b.extraType === 'wide') {
                  bgClass = 'bg-white text-[#44006c] font-black';
                  text = 'WD';
                } else if (b.extraType === 'noBall') {
                  bgClass = 'bg-white text-[#44006c] font-black';
                  text = 'NB';
                }

                return (
                  <div
                    key={idx}
                    className={`w-[22px] h-[20px] rounded-[3px] flex items-center justify-center text-[11px] shadow-sm shrink-0 leading-none ${bgClass}`}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM TIER: METALLIC WHITE BATTERS & BOWLER PLATE */}
          <div
            className="h-[38px] flex items-center justify-between px-6 shadow-inner relative"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 60%, #e2e8f0 100%)',
              clipPath: 'polygon(2.5% 0, 100% 0, 98% 100%, 0 100%)',
            }}
          >
            {/* Batters List */}
            <div className="flex items-center gap-3 pl-4">
              {/* Striker */}
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-sm uppercase text-slate-900 tracking-wide truncate max-w-[110px]">
                  {strikerName}
                </span>
                <CountryFlag playerName={striker?.name || strikerName} defaultCode="TT" />
                <div className="flex items-baseline ml-1">
                  <span className="font-sans font-black text-base text-slate-950 leading-none">
                    {striker?.runs ?? 0}
                  </span>
                  <span className="font-sans font-bold text-xs text-slate-500 ml-1 leading-none">
                    {striker?.balls ?? 0}
                  </span>
                </div>
              </div>

              {/* Slash Divider */}
              <span className="text-slate-400 font-bold text-sm mx-1">/</span>

              {/* Non-Striker */}
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="font-heading font-black text-sm uppercase text-slate-800 tracking-wide truncate max-w-[110px]">
                  {nonStrikerName}
                </span>
                <CountryFlag playerName={nonStriker?.name || nonStrikerName} defaultCode="ENG" />
                <div className="flex items-baseline ml-1">
                  <span className="font-sans font-black text-base text-slate-950 leading-none">
                    {nonStriker?.runs ?? 0}
                  </span>
                  <span className="font-sans font-bold text-xs text-slate-500 ml-1 leading-none">
                    {nonStriker?.balls ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Bowler Stats in White Plate */}
            <div className="flex items-center gap-2 pr-4 border-l border-slate-300 pl-4">
              <span className="font-heading font-black text-sm uppercase text-slate-900 tracking-wide truncate max-w-[120px]">
                {bowlerName}
              </span>
              <CountryFlag playerName={bowler?.name || bowlerName} defaultCode="AFG" />
              <div className="flex items-baseline ml-1">
                <span className="font-sans font-black text-base text-slate-950 leading-none">
                  {bowlerWickets}-{bowlerRuns}
                </span>
                <span className="font-sans font-bold text-xs text-slate-500 ml-1 leading-none">
                  {bowlerOvers}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. RIGHT BOWLING TEAM BANNER & LOGO (RED ANGLE) ================= */}
        <div className="relative z-20 flex items-stretch shrink-0 -ml-4">
          {/* Red Team Banner with Slanted Geometry */}
          <div
            className="flex flex-col justify-center px-8 shadow-xl relative"
            style={{
              background: 'linear-gradient(135deg, #e11d48 0%, #dc2626 50%, #b91c1c 100%)',
              clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
              width: '180px',
            }}
          >
            {/* Top red sheen */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300 to-transparent opacity-80" />

            <div className="flex items-center justify-center pl-2">
              <span className="font-heading font-black text-base uppercase text-white tracking-wider drop-shadow">
                {bowlingTeamTitle}
              </span>
            </div>
          </div>

          {/* Protruding Bowling Team Crest Logo */}
          <div className="absolute -top-3.5 right-2 z-30 w-16 h-16 flex items-center justify-center filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.7)]">
            {bowlingTeam?.logoUrl ? (
              <img
                src={bowlingTeam.logoUrl}
                alt={bowlingTeam.name}
                className="w-14 h-14 object-contain"
              />
            ) : (
              /* Dubai Capitals Style Crest Shield Fallback */
              <div className="w-14 h-14 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                  {/* Outer Flame Top */}
                  <path
                    d="M30 15 Q50 0 70 15 L62 25 Q50 15 38 25 Z"
                    fill="#f97316"
                  />
                  {/* Shield Body */}
                  <path
                    d="M15 22 Q50 14 85 22 L85 58 Q85 86 50 100 Q15 86 15 58 Z"
                    fill="#0f2b6b"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Inner Red Wing Accents */}
                  <path
                    d="M20 28 L35 28 L25 50 Z"
                    fill="#dc2626"
                  />
                  <path
                    d="M80 28 L65 28 L75 50 Z"
                    fill="#dc2626"
                  />
                  {/* Eagle Head */}
                  <circle cx="50" cy="50" r="16" fill="#ffffff" />
                  <polygon points="50,48 58,54 50,60" fill="#f59e0b" />
                  <circle cx="46" cy="46" r="2.5" fill="#000000" />
                  {/* DUBAI CAPITALS Text Ribbon */}
                  <rect x="18" y="66" width="64" height="15" rx="3" fill="#ffffff" />
                  <text
                    x="50"
                    y="77"
                    textAnchor="middle"
                    fill="#0f2b6b"
                    fontSize="9"
                    fontWeight="900"
                    fontFamily="sans-serif"
                  >
                    CAPITALS
                  </text>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ================= 4. BASE ACCENT BAR ACROSS THE BOTTOM ================= */}
        <div className="absolute bottom-0 inset-x-0 h-[4.5px] bg-gradient-to-r from-[#03256c] via-[#52007e] to-[#991b1b] shadow-md z-40 rounded-b-sm" />
      </div>
    </div>
  );
};
