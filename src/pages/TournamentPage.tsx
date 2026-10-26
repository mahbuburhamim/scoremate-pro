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
  Upload,
  Image as ImageIcon,
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
  const [team1Logo, setTeam1Logo] = useState('');
  const [team2Name, setTeam2Name] = useState('Australia');
  const [team2Logo, setTeam2Logo] = useState('');
  const [matchOvers, setMatchOvers] = useState(20);
  const [matchNo, setMatchNo] = useState('Match 1');
  const [tossWonBy, setTossWonBy] = useState<'team1' | 'team2'>('team1');
  const [optedTo, setOptedTo] = useState<'bat' | 'bowl'>('bat');
  const [ballsPerOver, setBallsPerOver] = useState(6);
  const [matchType, setMatchType] = useState<'Group Stage' | 'Knockout' | 'Semi Final' | 'Final'>('Group Stage');

  const handleLogoUpload = (file: File, isTeam1: boolean) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new (window as any).Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/png');
          if (isTeam1) setTeam1Logo(compressed);
          else setTeam2Logo(compressed);
        } else {
          const res = e.target?.result as string;
          if (isTeam1) setTeam1Logo(res);
          else setTeam2Logo(res);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
      team1LogoUrl: team1Logo,
      team2LogoUrl: team2Logo,
    });

    setShowCreateMatchModal(false);
    navigate(`/controller/${newMatch.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-sky-200/30 via-blue-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-blue-700 font-black text-xs uppercase tracking-wider">
                TOURNAMENT MANAGEMENT
              </span>
              <span className="text-slate-500 text-xs font-mono">League & Fixtures</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-slate-900 mt-1">
              <span className="text-blue-600">TOURNAMENTS</span> & MATCHES
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Create leagues, schedule fixtures with custom overs and toss rules, and launch live scoring sessions.
            </p>
          </div>

          <button
            onClick={() => setShowCreateTourModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-sm shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament</span>
          </button>
        </div>

        {/* Tournaments Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tournaments.map((tour) => (
            <button
              key={tour.id}
              onClick={() => setSelectedTourId(tour.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                selectedTourId === tour.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{tour.name}</span>
            </button>
          ))}
        </div>

        {/* Active Tournament Details & Match List */}
        {activeTour && (
          <div className="flex flex-col gap-6">
            {/* Tour Hero Card */}
            <div className="rounded-3xl bg-white/95 border border-slate-200/90 p-6 sm:p-8 shadow-[0_15px_35px_rgba(2,132,199,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  ACTIVE TOURNAMENT
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-0.5">
                  {activeTour.name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> {activeTour.location || 'Stadium'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {activeTour.startDate}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCreateMatchModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 border border-sky-200 font-bold text-sm shadow-sm active:scale-95 transition shrink-0"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Create Match In Tour</span>
              </button>
            </div>

            {/* Matches List */}
            <div className="flex flex-col gap-3">
              <h3 className="font-heading font-black text-lg text-slate-800 uppercase tracking-wider">
                Matches & Fixtures ({tourMatches.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tourMatches.map((m) => {
                  const inx = m.innings[m.activeInningNumber - 1];
                  return (
                    <div
                      key={m.id}
                      className="rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-[0_15px_30px_rgba(2,132,199,0.08)] p-5 shadow-sm transition flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold">
                          {m.matchNo} • {m.matchType}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          {m.status}
                        </span>
                      </div>

                      {/* Teams & Score */}
                      <div className="flex items-center justify-between py-2">
                        <div className="flex flex-col">
                          <span className="font-heading font-black text-lg text-slate-900">
                            {m.team1.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {m.team1.players.length} Players Registered
                          </span>
                        </div>

                        <div className="font-score text-3xl font-black text-blue-600 text-center px-4">
                          VS
                        </div>

                        <div className="flex flex-col text-right">
                          <span className="font-heading font-black text-lg text-slate-900">
                            {m.team2.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {m.team2.players.length} Players Registered
                          </span>
                        </div>
                      </div>

                      {/* Live Score Snippet */}
                      <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Score:</span>
                          <span className="font-score text-xl font-bold text-blue-600">
                            {inx.totalRuns} - {inx.wickets}
                          </span>
                          <span className="text-slate-500">({inx.oversDisplay}/{m.overs} ov)</span>
                        </div>
                        <span className="text-slate-500">
                          Toss: {m.tossDecision.toUpperCase()}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setActiveMatchId(m.id);
                            navigate(`/controller/${m.id}`);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Scorer Controller</span>
                        </button>

                        <a
                          href={`/overlay/${m.id}?theme=cricpic`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
                        >
                          <Tv className="w-3.5 h-3.5 text-rose-600" />
                          <span>Overlay</span>
                        </a>

                        <button
                          onClick={() => {
                            setActiveMatchId(m.id);
                            navigate(`/links`);
                          }}
                          className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-4 text-slate-900 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase">
                  Create Tournament
                </h3>
                <button
                  onClick={() => setShowCreateTourModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTournament} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tournament Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICC Champions Trophy 2025"
                    value={tourName}
                    onChange={(e) => setTourName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2.5 text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tournament Location / Stadium
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Melbourne Cricket Ground (MCG)"
                    value={tourLocation}
                    onChange={(e) => setTourLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2.5 text-slate-900 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowCreateTourModal(false)}
                    className="px-4 py-2 rounded-full text-slate-500 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold shadow-md shadow-blue-500/25"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-slate-900 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase">
                  Create Match in {activeTour.name}
                </h3>
                <button
                  onClick={() => setShowCreateMatchModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMatch} className="grid grid-cols-2 gap-3 text-xs">
                {/* Team 1 Config */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Team 1 Name *</label>
                  <input
                    type="text"
                    required
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 text-xs"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    {team1Logo ? (
                      <img src={team1Logo} alt="T1 Logo" className="w-9 h-9 rounded-xl object-contain bg-slate-50 border border-blue-400 p-0.5 shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <label className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-blue-700 cursor-pointer flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{team1Logo ? 'Change' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file, true);
                        }}
                      />
                    </label>
                    {team1Logo && (
                      <button
                        type="button"
                        onClick={() => setTeam1Logo('')}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Team 2 Config */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Team 2 Name *</label>
                  <input
                    type="text"
                    required
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 text-xs"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    {team2Logo ? (
                      <img src={team2Logo} alt="T2 Logo" className="w-9 h-9 rounded-xl object-contain bg-slate-50 border border-pink-400 p-0.5 shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    <label className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-pink-700 cursor-pointer flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{team2Logo ? 'Change' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file, false);
                        }}
                      />
                    </label>
                    {team2Logo && (
                      <button
                        type="button"
                        onClick={() => setTeam2Logo('')}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Overs *</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={matchOvers}
                    onChange={(e) => setMatchOvers(parseInt(e.target.value, 10) || 20)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Match No. *</label>
                  <input
                    type="text"
                    required
                    value={matchNo}
                    onChange={(e) => setMatchNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Toss Won By</label>
                  <select
                    value={tossWonBy}
                    onChange={(e) => setTossWonBy(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 text-xs"
                  >
                    <option value="team1">{team1Name}</option>
                    <option value="team2">{team2Name}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Opted To</label>
                  <select
                    value={optedTo}
                    onChange={(e) => setOptedTo(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 text-xs"
                  >
                    <option value="bat">Bat</option>
                    <option value="bowl">Bowl</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Balls Per Over</label>
                  <input
                    type="number"
                    min="4"
                    max="8"
                    value={ballsPerOver}
                    onChange={(e) => setBallsPerOver(parseInt(e.target.value, 10) || 6)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Match Type</label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl p-2 text-slate-900 text-xs"
                  >
                    <option value="Group Stage">Group Stage</option>
                    <option value="Knockout">Knockout</option>
                    <option value="Semi Final">Semi Final</option>
                    <option value="Final">Final</option>
                  </select>
                </div>

                <div className="col-span-2 flex justify-end gap-2 pt-3 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowCreateMatchModal(false)}
                    className="px-4 py-2 rounded-full text-slate-500 hover:bg-slate-100 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold text-xs shadow-md shadow-blue-500/25"
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
