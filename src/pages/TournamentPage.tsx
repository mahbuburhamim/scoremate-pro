import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCricket } from '../context/CricketContext';
import {
  Trophy,
  Plus,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Tv,
  Link as LinkIcon,
  X,
  ChevronRight,
  Flame,
} from 'lucide-react';

export const TournamentPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    tournaments,
    matches,
    createTournament,
    createMatch,
    setActiveMatchId,
  } = useCricket();

  const [selectedTourId, setSelectedTourId] = useState<string>(tournaments[0]?.id || '');
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);

  // Form states for Create Tournament
  const [tourName, setTourName] = useState('');
  const [tourLocation, setTourLocation] = useState('');

  // Form states for Create Match
  const [team1Name, setTeam1Name] = useState('India');
  const [team2Name, setTeam2Name] = useState('Australia');
  const [matchOvers, setMatchOvers] = useState(20);
  const [matchNo, setMatchNo] = useState('Match 1');
  const [tossWonBy, setTossWonBy] = useState<'team1' | 'team2'>('team1');
  const [optedTo, setOptedTo] = useState<'bat' | 'bowl'>('bat');
  const [ballsPerOver, setBallsPerOver] = useState(6);
  const [matchType, setMatchType] = useState<'Group Stage' | 'Knockout' | 'Semi Final' | 'Final'>('Group Stage');

  const activeTour = tournaments.find((t) => t.id === selectedTourId) || tournaments[0];
  const tourMatches = matches.filter((m) => m.tournamentId === activeTour?.id || !m.tournamentId);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName.trim()) return;
    const newTour = createTournament(tourName, tourLocation);
    setSelectedTourId(newTour.id);
    setTourName('');
    setTourLocation('');
    setShowCreateTourModal(false);
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1Name.trim() || !team2Name.trim()) return;

    const newMatch = createMatch({
      tournamentId: activeTour.id,
      team1Name,
      team2Name,
      overs: matchOvers,
      matchNo,
      tossWonBy,
      optedTo,
      ballsPerOver,
      matchType,
    });

    setShowCreateMatchModal(false);
    navigate(`/controller/${newMatch.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-fuchsia-500 text-white font-black text-xs uppercase tracking-wider">
                TOURNAMENT MANAGEMENT
              </span>
              <span className="text-slate-400 text-xs font-mono">League & Fixtures</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-white mt-1">
              TOURNAMENTS & MATCHES
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create leagues, schedule fixtures with custom overs and toss rules, and launch live scoring sessions.
            </p>
          </div>

          <button
            onClick={() => setShowCreateTourModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-fuchsia-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament</span>
          </button>
        </div>

        {/* Tournaments Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {tournaments.map((tour) => (
            <button
              key={tour.id}
              onClick={() => setSelectedTourId(tour.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                selectedTourId === tour.id
                  ? 'bg-fuchsia-500/15 border-fuchsia-500/50 text-fuchsia-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-fuchsia-400" />
              <span>{tour.name}</span>
            </button>
          ))}
        </div>

        {/* Active Tournament Details & Match List */}
        {activeTour && (
          <div className="flex flex-col gap-6">
            {/* Tour Hero Card */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">
                  ACTIVE TOURNAMENT
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-0.5">
                  {activeTour.name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {activeTour.location || 'Stadium'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {activeTour.startDate}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCreateMatchModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-md active:scale-95 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Match In Tour</span>
              </button>
            </div>

            {/* Matches List */}
            <div className="flex flex-col gap-3">
              <h3 className="font-heading font-black text-lg text-slate-200 uppercase tracking-wider">
                Matches & Fixtures ({tourMatches.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tourMatches.map((m) => {
                  const inx = m.innings[m.activeInningNumber - 1];
                  return (
                    <div
                      key={m.id}
                      className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 shadow-xl transition flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                          {m.matchNo} • {m.matchType}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {m.status}
                        </span>
                      </div>

                      {/* Teams & Score */}
                      <div className="flex items-center justify-between py-2">
                        <div className="flex flex-col">
                          <span className="font-heading font-black text-lg text-white">
                            {m.team1.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {m.team1.players.length} Players Registered
                          </span>
                        </div>

                        <div className="font-score text-3xl font-black text-cyan-400 text-center px-4">
                          VS
                        </div>

                        <div className="flex flex-col text-right">
                          <span className="font-heading font-black text-lg text-white">
                            {m.team2.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {m.team2.players.length} Players Registered
                          </span>
                        </div>
                      </div>

                      {/* Live Score Snippet */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-300">Score:</span>
                          <span className="font-score text-xl font-bold text-emerald-400">
                            {inx.totalRuns} - {inx.wickets}
                          </span>
                          <span className="text-slate-400">({inx.oversDisplay}/{m.overs} ov)</span>
                        </div>
                        <span className="text-slate-400">
                          Toss: {m.tossDecision.toUpperCase()}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setActiveMatchId(m.id);
                            navigate(`/controller/${m.id}`);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Scorer Controller</span>
                        </button>

                        <a
                          href={`/overlay/${m.id}?theme=cricpic`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                        >
                          <Tv className="w-3.5 h-3.5 text-red-400" />
                          <span>Overlay</span>
                        </a>

                        <button
                          onClick={() => {
                            setActiveMatchId(m.id);
                            navigate(`/links`);
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Scoreboard Links"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL: CREATE TOURNAMENT ================= */}
        {showCreateTourModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-fuchsia-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-heading font-black text-lg text-fuchsia-400 uppercase">
                  Create Tournament
                </h3>
                <button
                  onClick={() => setShowCreateTourModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTournament} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Tournament Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICC Champions Trophy 2025"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">
                    Tournament Location / Stadium
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Melbourne Cricket Ground (MCG)"
                    value={tourLocation}
                    onChange={(e) => setTourLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateTourModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-bold shadow"
                  >
                    Save Tournament
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL: CREATE MATCH ================= */}
        {showCreateMatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-heading font-black text-lg text-cyan-400 uppercase">
                  Create Match in {activeTour.name}
                </h3>
                <button
                  onClick={() => setShowCreateMatchModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMatch} className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Team 1 Name *</label>
                  <input
                    type="text"
                    required
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Team 2 Name *</label>
                  <input
                    type="text"
                    required
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Total Overs *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={matchOvers}
                    onChange={(e) => setMatchOvers(parseInt(e.target.value, 10) || 20)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Match No. *</label>
                  <input
                    type="text"
                    required
                    value={matchNo}
                    onChange={(e) => setMatchNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Toss Won By</label>
                  <select
                    value={tossWonBy}
                    onChange={(e) => setTossWonBy(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="team1">{team1Name}</option>
                    <option value="team2">{team2Name}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Opted To</label>
                  <select
                    value={optedTo}
                    onChange={(e) => setOptedTo(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="bat">Bat</option>
                    <option value="bowl">Bowl</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Balls Per Over</label>
                  <input
                    type="number"
                    min="4"
                    max="8"
                    value={ballsPerOver}
                    onChange={(e) => setBallsPerOver(parseInt(e.target.value, 10) || 6)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Match Type</label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Group Stage">Group Stage</option>
                    <option value="Knockout">Knockout</option>
                    <option value="Semi Final">Semi Final</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                <div className="col-span-2 flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateMatchModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow"
                  >
                    Create Match & Open Controller
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
