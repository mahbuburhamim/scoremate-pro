import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, DisplayMode, UmpireDecision, Player } from '../../types/cricket';
import { Trophy, Award, Flame, Users, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

interface BroadcastCardsProps {
  match: Match;
}

export const BroadcastCards: React.FC<BroadcastCardsProps> = ({ match }) => {
  const activeInning = match.innings[match.activeInningNumber - 1];
  const battingTeam = match.team1.id === activeInning.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === activeInning.bowlingTeamId ? match.team1 : match.team2;

  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId);
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId);

  // Partnership calculation: runs scored since last wicket or start
  const lastFow = activeInning.fow[activeInning.fow.length - 1];
  const partnershipRuns = lastFow ? activeInning.totalRuns - lastFow.score : activeInning.totalRuns;

  // Third Umpire Decision Modal
  const renderUmpireDecision = () => {
    if (match.umpireDecision === 'NONE') return null;

    let bannerConfig = {
      title: 'DECISION PENDING',
      color: 'from-amber-500 to-yellow-600',
      border: 'border-yellow-400',
      icon: <ShieldAlert className="w-12 h-12 text-yellow-300 animate-pulse" />,
    };

    if (match.umpireDecision === 'OUT') {
      bannerConfig = {
        title: 'OUT',
        color: 'from-red-600 to-rose-700',
        border: 'border-red-500',
        icon: <XCircle className="w-14 h-14 text-white" />,
      };
    } else if (match.umpireDecision === 'NOT OUT') {
      bannerConfig = {
        title: 'NOT OUT',
        color: 'from-emerald-500 to-teal-600',
        border: 'border-emerald-400',
        icon: <CheckCircle2 className="w-14 h-14 text-white" />,
      };
    }

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="fixed top-24 right-16 z-50 p-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-emerald-400 shadow-2xl"
      >
        <div
          className={`px-8 py-5 rounded-[14px] bg-gradient-to-b ${bannerConfig.color} border-2 ${bannerConfig.border} flex flex-col items-center justify-center text-white min-w-[280px] shadow-2xl`}
        >
          {bannerConfig.icon}
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 mt-2 bg-white/90 px-2 py-0.5 rounded">
            THIRD UMPIRE REVIEW
          </span>
          <span className="font-heading font-black text-4xl sm:text-5xl uppercase tracking-wider drop-shadow-lg mt-1">
            {bannerConfig.title}
          </span>
        </div>
      </motion.div>
    );
  };

  // Specific Cards depending on displayMode
  switch (match.displayMode) {
    case 'TEAMS PLAYERS':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-12 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-5xl bg-slate-950/95 border-2 border-cyan-500/50 rounded-3xl p-8 shadow-2xl text-white flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-cyan-400" />
                <h2 className="font-heading font-black text-3xl tracking-wide uppercase">
                  {battingTeam.name} — PLAYING XI
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-xs">
                OFFICIAL SQUAD
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {battingTeam.players.slice(0, 11).map((player, idx) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition"
                >
                  <div className="relative">
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border border-cyan-400 shadow"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center font-bold text-sm">
                        {player.name[0]}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-slate-950 border border-cyan-400 text-[9px] font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-sm uppercase truncate max-w-[120px]">
                      {player.name}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{player.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          {renderUmpireDecision()}
        </div>
      );

    case 'SUMMARY':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-12 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-5xl bg-slate-950/95 border-2 border-fuchsia-500/50 rounded-3xl p-8 shadow-2xl text-white flex flex-col md:flex-row gap-8"
          >
            {/* Left Scorecard */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="font-heading font-black text-2xl uppercase tracking-wider text-fuchsia-400">
                  {battingTeam.name} INNINGS SCORECARD
                </h2>
                <div className="font-score text-3xl font-bold text-white">
                  {activeInning.totalRuns} - {activeInning.wickets} ({activeInning.oversDisplay} ov)
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-800/80 overflow-y-auto max-h-[380px] pr-2">
                {battingTeam.players.map((p) => {
                  const strikeRate = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0';
                  return (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold uppercase text-white">{p.name}</span>
                        <span className="text-[11px] text-slate-400 italic">
                          {p.isOut ? p.dismissalInfo || 'out' : 'not out'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="font-score text-2xl font-bold text-emerald-400 w-10 text-right">
                          {p.runs}
                        </span>
                        <span className="text-slate-400 w-8 text-right">({p.balls})</span>
                        <span className="text-slate-500 text-xs w-16 text-right hidden sm:inline">
                          SR {strikeRate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Top Performer Profile Card */}
            {striker && (
              <div className="w-80 bg-gradient-to-b from-fuchsia-950/60 to-slate-900 border border-fuchsia-500/40 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl">
                <span className="px-3 py-1 rounded-full bg-fuchsia-500 text-white font-black text-[10px] tracking-widest uppercase mb-4">
                  TOP PERFORMER
                </span>
                {striker.photoUrl ? (
                  <img
                    src={striker.photoUrl}
                    alt=""
                    className="w-28 h-28 rounded-full object-cover border-4 border-fuchsia-400 shadow-2xl mb-3"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-fuchsia-400 flex items-center justify-center font-bold text-3xl mb-3">
                    {striker.name[0]}
                  </div>
                )}
                <h3 className="font-heading font-black text-xl uppercase text-white tracking-wide">
                  {striker.name}
                </h3>
                <div className="font-score text-5xl font-black text-emerald-400 mt-2">
                  {striker.runs}{' '}
                  <span className="text-lg font-sans text-slate-400 font-semibold">({striker.balls})</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-300">
                  <span>4s: {striker.fours}</span>
                  <span>•</span>
                  <span>6s: {striker.sixes}</span>
                </div>
              </div>
            )}
          </motion.div>
          {renderUmpireDecision()}
        </div>
      );

    case 'PARTNERSHIP':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-12 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-slate-950/95 border-2 border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-white flex flex-col items-center"
          >
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              CURRENT PARTNERSHIP
            </span>
            <div className="font-score text-7xl font-black text-emerald-400 mt-2 drop-shadow">
              {partnershipRuns}{' '}
              <span className="text-2xl font-heading text-slate-400 font-semibold">RUNS</span>
            </div>

            <div className="w-full grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-800">
              <div className="flex flex-col items-center text-center">
                <span className="font-heading font-bold text-lg uppercase text-white">
                  {striker?.name}
                </span>
                <span className="font-score text-4xl font-bold text-emerald-400">
                  {striker?.runs} ({striker?.balls})
                </span>
              </div>
              <div className="flex flex-col items-center text-center border-l border-slate-800">
                <span className="font-heading font-bold text-lg uppercase text-slate-300">
                  {nonStriker?.name}
                </span>
                <span className="font-score text-4xl font-bold text-slate-300">
                  {nonStriker?.runs} ({nonStriker?.balls})
                </span>
              </div>
            </div>
          </motion.div>
          {renderUmpireDecision()}
        </div>
      );

    case 'FOW':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-12 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl bg-slate-950/95 border-2 border-red-500/50 rounded-3xl p-8 shadow-2xl text-white flex flex-col"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <Flame className="w-7 h-7 text-red-500" />
              <h2 className="font-heading font-black text-2xl uppercase tracking-wider">
                FALL OF WICKETS — {battingTeam.name}
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {activeInning.fow.length === 0 ? (
                <p className="text-slate-400 italic text-sm">No wickets fallen yet.</p>
              ) : (
                activeInning.fow.map((fow) => (
                  <div
                    key={fow.wicketNumber}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-red-400 uppercase">
                        {fow.wicketNumber} Wicket
                      </span>
                      <p className="font-heading font-bold text-sm uppercase text-white">
                        {fow.playerOutName}
                      </p>
                    </div>
                    <div className="font-score text-2xl font-bold text-white text-right">
                      {fow.score} <span className="text-xs font-sans text-slate-400">({fow.overs} ov)</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
          {renderUmpireDecision()}
        </div>
      );

    case 'B1':
    case 'B2':
    case 'BOWLER': {
      const activePlayer =
        match.displayMode === 'B1' ? striker : match.displayMode === 'B2' ? nonStriker : bowler;
      if (!activePlayer) return renderUmpireDecision();

      return (
        <div className="fixed bottom-32 left-16 z-30 pointer-events-none">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/95 border-2 border-cyan-400 shadow-2xl text-white min-w-[340px]"
          >
            {activePlayer.photoUrl ? (
              <img
                src={activePlayer.photoUrl}
                alt=""
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center font-bold text-xl">
                {activePlayer.name[0]}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                PLAYER SPOTLIGHT
              </span>
              <span className="font-heading font-black text-lg uppercase text-white">
                {activePlayer.name}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-score text-3xl font-bold text-emerald-400 leading-none">
                  {match.displayMode === 'BOWLER'
                    ? `${activePlayer.wickets}-${activePlayer.runsConceded}`
                    : `${activePlayer.runs} (${activePlayer.balls})`}
                </span>
                <span className="text-xs text-slate-400">
                  {match.displayMode === 'BOWLER' ? `${activePlayer.oversBowled} overs` : `SR ${(activePlayer.balls > 0 ? (activePlayer.runs / activePlayer.balls) * 100 : 0).toFixed(1)}`}
                </span>
              </div>
            </div>
          </motion.div>
          {renderUmpireDecision()}
        </div>
      );
    }

    case 'POINTS TABLE':
    case 'TOP BATTERS':
    case 'TOP BOWLERS':
    case 'TOP 4/6 STRIKERS':
    case 'TOP PLAYER OF SERIES':
      return (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-12 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-slate-950/95 border-2 border-amber-500/50 rounded-3xl p-8 shadow-2xl text-white flex flex-col"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <Trophy className="w-8 h-8 text-amber-400" />
              <h2 className="font-heading font-black text-3xl uppercase tracking-wider text-amber-300">
                {match.displayMode}
              </h2>
            </div>

            <div className="mt-6 divide-y divide-slate-800">
              {[
                { rank: '1', name: 'Virat Kohli', team: 'IND', score: '765 runs', avg: '95.6' },
                { rank: '2', name: 'Rohit Sharma', team: 'IND', score: '597 runs', avg: '54.2' },
                { rank: '3', name: 'Quinton de Kock', team: 'SA', score: '594 runs', avg: '59.4' },
                { rank: '4', name: 'Rachin Ravindra', team: 'NZ', score: '578 runs', avg: '64.2' },
                { rank: '5', name: 'Daryl Mitchell', team: 'NZ', score: '552 runs', avg: '69.0' },
              ].map((item) => (
                <div key={item.rank} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-amber-400 w-6">#{item.rank}</span>
                    <span className="font-heading font-bold text-base uppercase text-white">
                      {item.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {item.team}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 font-mono">
                    <span className="font-score text-2xl font-bold text-emerald-400">{item.score}</span>
                    <span className="text-xs text-slate-400">AVG {item.avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          {renderUmpireDecision()}
        </div>
      );

    default:
      return renderUmpireDecision();
  }
};
