import React, { useMemo } from 'react';
import { FootballMatch } from '../../types/football';

interface FootballScoreboardGraphicProps {
  match: FootballMatch;
  className?: string;
  isGoalAnimating?: boolean;
}

export const FootballScoreboardGraphic: React.FC<FootballScoreboardGraphicProps> = ({
  match,
  className = '',
  isGoalAnimating = false,
}) => {
  const { team1, team2, time, activeAnimation, config } = match;

  // Format timer MM:SS
  const timeFormatted = useMemo(() => {
    const mins = String(time.minutes).padStart(2, '0');
    const secs = String(time.seconds).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [time.minutes, time.seconds]);

  // Period label
  const periodLabel = useMemo(() => {
    switch (time.period) {
      case '1H':
        return '1ST HALF';
      case 'HT':
        return 'HALF TIME';
      case '2H':
        return '2ND HALF';
      case 'ET1':
        return 'EXTRA TIME 1';
      case 'ET2':
        return 'EXTRA TIME 2';
      case 'PEN':
        return 'PENALTIES';
      case 'FT':
        return 'FULL TIME';
      default:
        return 'LIVE';
    }
  }, [time.period]);

  const isGoal = isGoalAnimating || activeAnimation?.type === 'GOAL';

  return (
    <div
      className={`relative select-none transition-transform duration-300 ${className}`}
      style={{
        width: 1040,
        height: 200,
      }}
    >
      <svg
        viewBox="0 0 1040 200"
        className="w-full h-full overflow-visible"
        style={{
          filter: 'drop-shadow(0 14px 32px rgba(0, 0, 0, 0.8))',
        }}
      >
        <defs>
          {/* ===================== NEON GLOW FILTERS ===================== */}
          <filter id="esports-cyan-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="7" result="blur2" />
            <feGaussianBlur stdDeviation="14" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="esports-red-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="7" result="blur2" />
            <feGaussianBlur stdDeviation="14" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* ===================== 3D METALLIC & GLOSS GRADIENTS ===================== */}
          {/* Top Time Header Dark Titanium Plate */}
          <linearGradient id="time-plate-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08182b" />
            <stop offset="25%" stopColor="#0c2340" />
            <stop offset="70%" stopColor="#061221" />
            <stop offset="100%" stopColor="#02060d" />
          </linearGradient>

          {/* Top Time Side Wings Background */}
          <linearGradient id="time-wing-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#031021" />
            <stop offset="50%" stopColor="#0b284d" />
            <stop offset="100%" stopColor="#01060e" />
          </linearGradient>

          {/* Center Score Obsidian Shield */}
          <linearGradient id="score-shield-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2633" />
            <stop offset="12%" stopColor="#131923" />
            <stop offset="65%" stopColor="#0a0d13" />
            <stop offset="100%" stopColor="#020305" />
          </linearGradient>

          {/* Team 1 (Left Wing) Rich Royal Blue Metallic */}
          <linearGradient id="team1-metallic-grad" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#042270" />
            <stop offset="30%" stopColor="#0b48cc" />
            <stop offset="70%" stopColor="#1662f3" />
            <stop offset="100%" stopColor="#08379c" />
          </linearGradient>

          {/* Team 1 Beveled Border Frame */}
          <linearGradient id="team1-bevel-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="30%" stopColor="#0066cc" />
            <stop offset="70%" stopColor="#00224d" />
            <stop offset="100%" stopColor="#00d2ff" />
          </linearGradient>

          {/* Team 2 (Right Wing) Rich Scarlet Red Metallic */}
          <linearGradient id="team2-metallic-grad" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#6e0212" />
            <stop offset="30%" stopColor="#b30722" />
            <stop offset="70%" stopColor="#e81938" />
            <stop offset="100%" stopColor="#8c0417" />
          </linearGradient>

          {/* Team 2 Beveled Border Frame */}
          <linearGradient id="team2-bevel-frame" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff1744" />
            <stop offset="30%" stopColor="#b30024" />
            <stop offset="70%" stopColor="#4d000f" />
            <stop offset="100%" stopColor="#ff3366" />
          </linearGradient>

          {/* Specular Sheen (Glass Reflection on top half) */}
          <linearGradient id="specular-reflection" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* 1. LEFT WING: TEAM 1 (ROYAL BLUE 3D BEVELED PARALLELOGRAM SLANTED RIGHT)  */}
        {/* ========================================================================= */}
        <g id="team-1-banner">
          {/* Base Drop Shadow Outline */}
          <polygon
            points="14,84 394,84 362,168 46,168"
            fill="#010612"
            stroke="#00183d"
            strokeWidth="3"
          />

          {/* 3D Beveled Outer Frame */}
          <polygon
            points="16,86 392,86 360,166 48,166"
            fill="url(#team1-bevel-frame)"
            opacity="0.95"
          />

          {/* Inner Team 1 Royal Blue Metallic Core */}
          <polygon
            points="24,90 384,90 354,162 54,162"
            fill="url(#team1-metallic-grad)"
          />

          {/* Top Edge Intense Neon Cyan Glow Line */}
          <line
            x1="20"
            y1="87"
            x2="388"
            y2="87"
            stroke="#00f2fe"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Bottom Edge Neon Cyan Accent Bevel */}
          <line
            x1="50"
            y1="165"
            x2="358"
            y2="165"
            stroke="#00d2ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Left Angled Outer Chamfer Neon Line */}
          <line
            x1="18"
            y1="87"
            x2="48"
            y2="165"
            stroke="#00f2fe"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Top-Left Corner Accent Bright Bracket */}
          <polygon
            points="16,86 56,86 48,96 22,96"
            fill="#ffffff"
            opacity="0.95"
            filter="url(#esports-cyan-glow)"
          />

          {/* Glass Specular Reflection Sheen */}
          <polygon
            points="26,91 382,91 368,124 40,124"
            fill="url(#specular-reflection)"
            pointerEvents="none"
          />

          {/* Team 1 Bold Name Text */}
          <text
            x="195"
            y="138"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="38"
            letterSpacing="2.5"
            filter="drop-shadow(0 3px 6px rgba(0,0,0,0.95))"
            className="tracking-wider uppercase"
          >
            {team1.name}
          </text>

          {/* Team 1 Cards Indicator (if active) */}
          {config.showCards && (team1.yellowCards > 0 || team1.redCards > 0) && (
            <g transform="translate(42, 102)">
              {team1.yellowCards > 0 && (
                <g transform="translate(0, 0)">
                  <rect
                    width="14"
                    height="20"
                    rx="2"
                    fill="#eab308"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                  />
                  {team1.yellowCards > 1 && (
                    <text
                      x="7"
                      y="15"
                      textAnchor="middle"
                      fill="#000"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {team1.yellowCards}
                    </text>
                  )}
                </g>
              )}
              {team1.redCards > 0 && (
                <g transform={`translate(${team1.yellowCards > 0 ? 18 : 0}, 0)`}>
                  <rect
                    width="14"
                    height="20"
                    rx="2"
                    fill="#ef4444"
                    stroke="#b91c1c"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                  />
                  {team1.redCards > 1 && (
                    <text
                      x="7"
                      y="15"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {team1.redCards}
                    </text>
                  )}
                </g>
              )}
            </g>
          )}
        </g>

        {/* ========================================================================= */}
        {/* 2. RIGHT WING: TEAM 2 (SCARLET RED 3D BEVELED PARALLELOGRAM SLANTED RIGHT) */}
        {/* ========================================================================= */}
        <g id="team-2-banner">
          {/* Base Drop Shadow Outline */}
          <polygon
            points="646,84 1026,84 994,168 678,168"
            fill="#140104"
            stroke="#380008"
            strokeWidth="3"
          />

          {/* 3D Beveled Outer Frame */}
          <polygon
            points="648,86 1024,86 992,166 680,166"
            fill="url(#team2-bevel-frame)"
            opacity="0.95"
          />

          {/* Inner Team 2 Scarlet Red Metallic Core */}
          <polygon
            points="656,90 1016,90 986,162 686,162"
            fill="url(#team2-metallic-grad)"
          />

          {/* Top Edge Intense Neon Red Glow Line */}
          <line
            x1="652"
            y1="87"
            x2="1020"
            y2="87"
            stroke="#ff1744"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#esports-red-glow)"
          />

          {/* Bottom Edge Neon Red Accent Bevel */}
          <line
            x1="682"
            y1="165"
            x2="990"
            y2="165"
            stroke="#ff385c"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#esports-red-glow)"
          />

          {/* Right Angled Outer Chamfer Neon Line */}
          <line
            x1="1022"
            y1="87"
            x2="992"
            y2="165"
            stroke="#ff1744"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#esports-red-glow)"
          />

          {/* Top-Right Corner Accent Bright Bracket */}
          <polygon
            points="984,86 1022,86 1016,96 990,96"
            fill="#ffffff"
            opacity="0.95"
            filter="url(#esports-red-glow)"
          />

          {/* Glass Specular Reflection Sheen */}
          <polygon
            points="658,91 1014,91 1000,124 672,124"
            fill="url(#specular-reflection)"
            pointerEvents="none"
          />

          {/* Team 2 Bold Name Text */}
          <text
            x="845"
            y="138"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="38"
            letterSpacing="2.5"
            filter="drop-shadow(0 3px 6px rgba(0,0,0,0.95))"
            className="tracking-wider uppercase"
          >
            {team2.name}
          </text>

          {/* Team 2 Cards Indicator (if active) */}
          {config.showCards && (team2.yellowCards > 0 || team2.redCards > 0) && (
            <g transform="translate(980, 102)">
              {team2.yellowCards > 0 && (
                <g transform="translate(0, 0)">
                  <rect
                    width="14"
                    height="20"
                    rx="2"
                    fill="#eab308"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                  />
                  {team2.yellowCards > 1 && (
                    <text
                      x="7"
                      y="15"
                      textAnchor="middle"
                      fill="#000"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {team2.yellowCards}
                    </text>
                  )}
                </g>
              )}
              {team2.redCards > 0 && (
                <g transform={`translate(${team2.yellowCards > 0 ? -18 : 0}, 0)`}>
                  <rect
                    width="14"
                    height="20"
                    rx="2"
                    fill="#ef4444"
                    stroke="#b91c1c"
                    strokeWidth="1.5"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                  />
                  {team2.redCards > 1 && (
                    <text
                      x="7"
                      y="15"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {team2.redCards}
                    </text>
                  )}
                </g>
              )}
            </g>
          )}
        </g>

        {/* ========================================================================= */}
        {/* 3. CENTRAL SCORE SHIELD: "0 : 0" (DARK TITANIUM BEVEL + STEPPED BOTTOM)    */}
        {/* ========================================================================= */}
        <g id="center-score-shield">
          {/* Base Obsidian Backing */}
          <polygon
            points="356,76 684,76 648,180 618,180 608,188 432,188 422,180 392,180"
            fill="#030712"
            stroke="#0b1324"
            strokeWidth="3.5"
          />

          {/* Inner Dark Titanium Shield Plate */}
          <polygon
            points="360,78 680,78 644,178 616,178 606,185 434,185 424,178 396,178"
            fill="url(#score-shield-grad)"
          />

          {/* Stepped Bottom Center Cutout with Dual Glowing Accents */}
          {/* Cyan Glow under left half of score base */}
          <line
            x1="394"
            y1="178"
            x2="520"
            y2="178"
            stroke="#00d2ff"
            strokeWidth="4"
            filter="url(#esports-cyan-glow)"
          />
          <polyline
            points="424,178 434,185 520,185"
            stroke="#00f2fe"
            strokeWidth="3.5"
            fill="none"
            filter="url(#esports-cyan-glow)"
          />

          {/* Red Glow under right half of score base */}
          <line
            x1="520"
            y1="178"
            x2="646"
            y2="178"
            stroke="#ff1744"
            strokeWidth="4"
            filter="url(#esports-red-glow)"
          />
          <polyline
            points="520,185 606,185 616,178"
            stroke="#ff2652"
            strokeWidth="3.5"
            fill="none"
            filter="url(#esports-red-glow)"
          />

          {/* Left Angled Side Edge - Cyan Neon Accent */}
          <line
            x1="360"
            y1="78"
            x2="396"
            y2="178"
            stroke="#00d2ff"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Right Angled Side Edge - Red Neon Accent */}
          <line
            x1="680"
            y1="78"
            x2="644"
            y2="178"
            stroke="#ff1744"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#esports-red-glow)"
          />

          {/* Specular Sheen across upper portion of Score Plate */}
          <polygon
            points="364,80 676,80 660,126 380,126"
            fill="url(#specular-reflection)"
            pointerEvents="none"
          />

          {/* ===================== SCORE NUMBERS ("0 : 0") ===================== */}
          <g
            className={`transition-all duration-300 ${
              isGoal ? 'scale-110 drop-shadow-[0_0_30px_#facc15]' : ''
            }`}
            style={{ transformOrigin: '520px 140px' }}
          >
            {/* Team 1 Score (Left) */}
            <text
              x="460"
              y="152"
              textAnchor="end"
              fill="#ffffff"
              fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
              fontWeight="900"
              fontSize="76"
              letterSpacing="-2"
              filter="drop-shadow(0 4px 10px rgba(0,0,0,0.95))"
            >
              {team1.score}
            </text>

            {/* Score Colon Divider (":") */}
            <text
              x="520"
              y="148"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
              fontWeight="900"
              fontSize="62"
              opacity="0.9"
              filter="drop-shadow(0 4px 10px rgba(0,0,0,0.95))"
            >
              :
            </text>

            {/* Team 2 Score (Right) */}
            <text
              x="580"
              y="152"
              textAnchor="start"
              fill="#ffffff"
              fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
              fontWeight="900"
              fontSize="76"
              letterSpacing="-2"
              filter="drop-shadow(0 4px 10px rgba(0,0,0,0.95))"
            >
              {team2.score}
            </text>
          </g>
        </g>

        {/* ========================================================================= */}
        {/* 4. TOP TIME BAR: "00:00" WITH INTEGRATED GLOWING CYAN ANGLED LED SLITS    */}
        {/* ========================================================================= */}
        <g id="top-time-assembly">
          {/* Left Wing Frame with Dual Slits */}
          <polygon
            points="260,34 330,12 366,78 300,78"
            fill="url(#time-wing-grad)"
            stroke="#00f2fe"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.8))"
          />
          {/* Dual Slanted Glowing Cyan LED Bars (Left Wing) */}
          <line
            x1="282"
            y1="64"
            x2="304"
            y2="24"
            stroke="#00e5ff"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />
          <line
            x1="306"
            y1="68"
            x2="328"
            y2="28"
            stroke="#00f2fe"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Right Wing Frame with Dual Slits */}
          <polygon
            points="710,12 780,34 740,78 674,78"
            fill="url(#time-wing-grad)"
            stroke="#00f2fe"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.8))"
          />
          {/* Dual Slanted Glowing Cyan LED Bars (Right Wing) */}
          <line
            x1="708"
            y1="28"
            x2="730"
            y2="68"
            stroke="#00f2fe"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />
          <line
            x1="732"
            y1="24"
            x2="754"
            y2="64"
            stroke="#00e5ff"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Central Time Bar Trapezoid Core */}
          <polygon
            points="326,10 714,10 688,78 352,78"
            fill="#020817"
            stroke="#0c2340"
            strokeWidth="3"
          />

          <polygon
            points="330,12 710,12 684,76 356,76"
            fill="url(#time-plate-grad)"
          />

          {/* Top Neon Cyan Glowing Line */}
          <line
            x1="328"
            y1="11"
            x2="712"
            y2="11"
            stroke="#00f2fe"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#esports-cyan-glow)"
          />

          {/* Bottom Neon Seam between Time and Score */}
          <line
            x1="354"
            y1="76"
            x2="686"
            y2="76"
            stroke="#00e5ff"
            strokeWidth="3.5"
            filter="url(#esports-cyan-glow)"
          />

          {/* Angled Left & Right Neon Trims of Center Time Box */}
          <line
            x1="330"
            y1="12"
            x2="356"
            y2="76"
            stroke="#00f2fe"
            strokeWidth="3.5"
            filter="url(#esports-cyan-glow)"
          />
          <line
            x1="710"
            y1="12"
            x2="684"
            y2="76"
            stroke="#00f2fe"
            strokeWidth="3.5"
            filter="url(#esports-cyan-glow)"
          />

          {/* Glass Specular Reflection on Time Plate */}
          <polygon
            points="332,13 708,13 696,44 344,44"
            fill="url(#specular-reflection)"
            pointerEvents="none"
          />

          {/* ===================== MATCH TIME NUMBERS ("00:00") ===================== */}
          <text
            x="520"
            y="62"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
            fontWeight="900"
            fontSize="54"
            letterSpacing="2.5"
            filter="drop-shadow(0 2px 10px rgba(0, 242, 254, 0.75)) drop-shadow(0 4px 6px rgba(0,0,0,0.95))"
            className="tracking-wider"
          >
            {timeFormatted}
          </text>

          {/* Extra Stoppage Time Badge (e.g. +3') if active */}
          {time.stoppageTime > 0 && (
            <g transform="translate(654, 34)">
              <rect
                x="-4"
                y="-16"
                width="38"
                height="26"
                rx="5"
                fill="#f59e0b"
                stroke="#fbbf24"
                strokeWidth="1.5"
                filter="url(#esports-cyan-glow)"
              />
              <text
                x="15"
                y="3"
                textAnchor="middle"
                fill="#000000"
                fontFamily="'Plus Jakarta Sans', sans-serif"
                fontWeight="900"
                fontSize="16"
              >
                +{time.stoppageTime}'
              </text>
            </g>
          )}

          {/* Match Period Pill Badge */}
          {config.showPeriodBadge && (
            <g transform="translate(520, 2)">
              <rect
                x="-42"
                y="-1"
                width="84"
                height="14"
                rx="3"
                fill="#020617"
                stroke="#00e5ff"
                strokeWidth="1"
                opacity="0.95"
              />
              <text
                x="0"
                y="9"
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="9.5"
                fontWeight="900"
                letterSpacing="1"
              >
                {periodLabel}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 5. DYNAMIC CELEBRATION BANNERS                                            */}
      {/* ========================================================================= */}
      {activeAnimation?.type === 'GOAL' && (
        <div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[780px] py-3 px-8 rounded-2xl flex items-center justify-between text-white shadow-2xl z-50 animate-bounce"
          style={{
            background:
              activeAnimation.team === 1
                ? 'linear-gradient(90deg, #042270 0%, #1662f3 50%, #042270 100%)'
                : 'linear-gradient(90deg, #6e0212 0%, #e81938 50%, #6e0212 100%)',
            border:
              activeAnimation.team === 1
                ? '2.5px solid #00f2fe'
                : '2.5px solid #ff1744',
            boxShadow:
              activeAnimation.team === 1
                ? '0 0 35px rgba(0, 242, 254, 0.85)'
                : '0 0 35px rgba(255, 23, 68, 0.85)',
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-spin-slow">⚽</span>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest uppercase text-cyan-200">
                {activeAnimation.teamName} GOAL!
              </span>
              <span className="text-2xl font-black tracking-wider uppercase text-white drop-shadow">
                {activeAnimation.playerName || 'GOAL!'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black tracking-widest text-amber-300 drop-shadow">
              {timeFormatted}
            </span>
          </div>
        </div>
      )}

      {(activeAnimation?.type === 'YELLOW_CARD' || activeAnimation?.type === 'RED_CARD') && (
        <div
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-7 py-2.5 rounded-xl flex items-center gap-3.5 bg-slate-950/95 border border-slate-700 shadow-2xl z-50 animate-pulse"
        >
          <div
            className={`w-5 h-7 rounded-xs ${
              activeAnimation.type === 'YELLOW_CARD' ? 'bg-amber-400' : 'bg-rose-600'
            }`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase text-slate-400">
              {activeAnimation.type === 'YELLOW_CARD' ? 'Yellow Card' : 'Red Card'}
            </span>
            <span className="text-base font-black uppercase text-white">
              {activeAnimation.playerName || activeAnimation.teamName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
