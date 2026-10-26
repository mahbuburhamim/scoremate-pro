import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  HelpCircle,
  RotateCcw,
  RefreshCw,
  Send,
  Edit2,
  Plus,
  X,
  Upload,
  Info,
  Sliders,
  Palette,
  Eye,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { Player, DisplayMode, UmpireDecision, AnimationTrigger } from '../types/cricket';
import { calculateStorageUsage } from '../utils/storage';
import { ImageCropperModal } from '../components/ImageCropperModal';

export const ControllerPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const {
    matches,
    activeMatch,
    setActiveMatchId,
    addBall,
    undo,
    swapBatters,
    changeBowler,
    changeStriker,
    changeNonStriker,
    retireBatter,
    endInnings,
    setDisplayMode,
    setUmpireDecision,
    triggerAnimation,
    clearAnimation,
    updateTeamColors,
    updateTeamDetails,
    addPlayersToTeam,
    updatePlayer,
    manualSyncPulse,
    isSyncing,
  } = useCricket();

  // Set active match from route param
  useEffect(() => {
    if (matchId && matchId !== activeMatch.id) {
      const found = matches.find((m) => m.id === matchId);
      if (found) {
        setActiveMatchId(matchId);
      }
    }
  }, [matchId, activeMatch.id, matches, setActiveMatchId]);

  // Modifiers state (wide, noBall, bye, legBye, wicket)
  const [isWide, setIsWide] = useState(false);
  const [isNoBall, setIsNoBall] = useState(false);
  const [isBye, setIsBye] = useState(false);
  const [isLegBye, setIsLegBye] = useState(false);
  const [isWicket, setIsWicket] = useState(false);

  // Modals state
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<'bowled' | 'caught' | 'lbw' | 'runOut' | 'stumped' | 'hitWicket' | 'retired'>('bowled');
  const [outPlayerId, setOutPlayerId] = useState<string>('');
  const [nextBatterId, setNextBatterId] = useState<string>('');
  const [pendingWicketRuns, setPendingWicketRuns] = useState<number>(0);

  const [showCustomRunsModal, setShowCustomRunsModal] = useState(false);
  const [customRunsValue, setCustomRunsValue] = useState<number>(7);

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [showShortNameModal, setShowShortNameModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [team1LogoDraft, setTeam1LogoDraft] = useState<string>('');
  const [team2LogoDraft, setTeam2LogoDraft] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Manual team logo file upload with canvas compression
  const handleLogoFileUpload = (file: File, isTeam1: boolean) => {
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
          if (isTeam1) {
            setTeam1LogoDraft(compressed);
          } else {
            setTeam2LogoDraft(compressed);
          }
        } else {
          const res = e.target?.result as string;
          if (isTeam1) setTeam1LogoDraft(res);
          else setTeam2LogoDraft(res);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Squad inputs
  const [team1BulkInput, setTeam1BulkInput] = useState('');
  const [team2BulkInput, setTeam2BulkInput] = useState('');
  const [squadPopoverTeam, setSquadPopoverTeam] = useState<'team1' | 'team2' | null>(null);

  // Player Edit & Cropper
  const [editingPlayer, setEditingPlayer] = useState<{ teamId: string; player: Player } | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>('');

  // Custom Animation text
  const [customAnimationText, setCustomAnimationText] = useState('');

  // Color picker state
  const [team1Color, setTeam1Color] = useState(activeMatch.team1.primaryColor || '#1d4ed8');
  const [team2Color, setTeam2Color] = useState(activeMatch.team2.primaryColor || '#eab308');

  // Update color local state on active match change
  useEffect(() => {
    setTeam1Color(activeMatch.team1.primaryColor || '#1d4ed8');
    setTeam2Color(activeMatch.team2.primaryColor || '#eab308');
  }, [activeMatch]);

  // Active inning calculations
  const activeInning = activeMatch.innings[activeMatch.activeInningNumber - 1];
  const battingTeam = activeMatch.team1.id === activeInning.battingTeamId ? activeMatch.team1 : activeMatch.team2;
  const bowlingTeam = activeMatch.team1.id === activeInning.bowlingTeamId ? activeMatch.team1 : activeMatch.team2;

  const striker = battingTeam.players.find((p) => p.id === activeInning.currentStrikerId);
  const nonStriker = battingTeam.players.find((p) => p.id === activeInning.currentNonStrikerId);
  const bowler = bowlingTeam.players.find((p) => p.id === activeInning.currentBowlerId);

  // Run rate calculation
  const oversDecimal = activeInning.legalBalls / 6;
  const currentRunRate = oversDecimal > 0 ? (activeInning.totalRuns / oversDecimal).toFixed(2) : '0.00';

  // Storage usage
  const storageInfo = calculateStorageUsage();

  // Reset modifiers
  const resetModifiers = () => {
    setIsWide(false);
    setIsNoBall(false);
    setIsBye(false);
    setIsLegBye(false);
    setIsWicket(false);
  };

  // Handle run click
  const handleScoreRun = (runs: number) => {
    if (isWicket) {
      setPendingWicketRuns(runs);
      setOutPlayerId(activeInning.currentStrikerId);
      // find first available batter who is not yet out and not in current striker/non-striker
      const available = battingTeam.players.filter(
        (p) => !p.isOut && p.id !== activeInning.currentStrikerId && p.id !== activeInning.currentNonStrikerId
      );
      setNextBatterId(available[0]?.id || '');
      setShowWicketModal(true);
      return;
    }

    addBall({
      runs,
      isWide,
      isNoBall,
      isBye,
      isLegBye,
      isWicket: false,
    });
    resetModifiers();
  };

  // Confirm Wicket
  const handleConfirmWicket = () => {
    addBall({
      runs: pendingWicketRuns,
      isWide,
      isNoBall,
      isBye,
      isLegBye,
      isWicket: true,
      wicketType,
      outPlayerId,
      nextBatterId,
    });
    setShowWicketModal(false);
    resetModifiers();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '6') {
        handleScoreRun(parseInt(e.key, 10));
      } else if (e.key.toLowerCase() === 'w') {
        setIsWide((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n') {
        setIsNoBall((prev) => !prev);
      } else if (e.key.toLowerCase() === 'k') {
        setIsWicket((prev) => !prev);
      } else if (e.key.toLowerCase() === 'u') {
        undo();
      } else if (e.key.toLowerCase() === 's') {
        swapBatters();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWide, isNoBall, isBye, isLegBye, isWicket, undo, swapBatters, handleScoreRun]);

  // Handle image upload from file picker
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setRawImageSrc(event.target.result as string);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Complete photo cutout crop
  const handleCropComplete = (croppedDataUrl: string) => {
    if (editingPlayer) {
      setEditingPlayer({
        ...editingPlayer,
        player: {
          ...editingPlayer.player,
          photoUrl: croppedDataUrl,
        },
      });
    }
    setCropperOpen(false);
  };

  // Save edited player stats & photo
  const handleSavePlayer = () => {
    if (editingPlayer) {
      updatePlayer(editingPlayer.teamId, editingPlayer.player);
      setEditingPlayer(null);
    }
  };

  // Save team colors
  const handleSaveColors = () => {
    updateTeamColors(activeMatch.team1.id, team1Color);
    updateTeamColors(activeMatch.team2.id, team2Color);
    manualSyncPulse();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center pb-20">
      <div className="w-full max-w-4xl px-3 sm:px-4 pt-3 flex flex-col gap-3">
        {/* =========================================================
            1. TOP STATUS BAR (Exact Replica)
        ========================================================= */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold">
          {/* Left Cyan Pill */}
          <div className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-bold shadow-sm">
            Storage: {storageInfo.usedKb}/{storageInfo.maxKb} kb
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-bold">Match Scoreboard</span>
            <Link
              to="/links"
              className="text-cyan-400 hover:text-cyan-300 underline font-bold tracking-wide"
            >
              SCOREBOARD LINKS
            </Link>
          </div>

          {/* Right Green Pill */}
          <div className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold shadow-sm">
            Account Expiry Date: Active Pro
          </div>
        </div>

        {/* =========================================================
            2. MATCH HEADER & RUN RATE BANNER (Exact Replica)
        ========================================================= */}
        <div className="w-full flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl font-heading font-black tracking-wider text-white uppercase py-1">
            {activeMatch.team2.name} VS {activeMatch.team1.name}
          </h1>

          {/* Full-width horizontal gradient bar (magenta #ec4899 to purple #7e22ce) */}
          <div className="w-full py-1.5 px-4 rounded-md bg-magenta-purple shadow-md flex items-center justify-center">
            <span className="text-sm sm:text-base font-black tracking-widest text-white uppercase drop-shadow">
              RUN RATE: {currentRunRate}
            </span>
          </div>
        </div>

        {/* =========================================================
            3. TOP 3 LIVE SCORE PREVIEW CARDS (Exact Replica)
        ========================================================= */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Left Card: Batters (Dark purple to black gradient) */}
          <div className="rounded-xl p-3.5 bg-gradient-to-b from-[#4a154b] to-[#111827] border border-fuchsia-900/40 shadow-lg flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-fuchsia-300 uppercase tracking-wider">
                {battingTeam.shortName} BATTING
              </span>
              <button
                onClick={swapBatters}
                title="Swap Striker"
                className="text-[10px] px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-200 border border-fuchsia-800 hover:bg-fuchsia-900"
              >
                SWAP
              </button>
            </div>

            {/* Striker (Neon Green) */}
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <div className="flex items-center gap-1.5 truncate">
                <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 shrink-0" />
                <span className="truncate text-sm sm:text-base tracking-wide uppercase font-mono-sport">
                  {striker?.name || 'Rohit Sharma'}
                </span>
              </div>
              <span className="font-score text-xl sm:text-2xl text-emerald-400 tracking-wider">
                {striker?.runs || 0} ({striker?.balls || 0})
              </span>
            </div>

            {/* Non-Striker (White) */}
            <div className="flex items-center justify-between text-slate-100 font-medium">
              <span className="truncate text-sm sm:text-base tracking-wide uppercase font-mono-sport pl-5">
                {nonStriker?.name || 'S Gill'}
              </span>
              <span className="font-score text-lg sm:text-xl text-slate-200 tracking-wider">
                {nonStriker?.runs || 0} ({nonStriker?.balls || 0})
              </span>
            </div>
          </div>

          {/* Center Card: Match Score (Bright Blue Gradient #0284c7 to #2563eb) */}
          <div className="rounded-xl p-3.5 bg-gradient-to-b from-[#0284c7] to-[#2563eb] text-white shadow-lg flex flex-col items-center justify-center min-h-[110px] relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100/80 mb-0.5">
              INNINGS {activeMatch.activeInningNumber}
            </span>
            <div className="font-score text-4xl sm:text-5xl font-bold leading-none tracking-wider drop-shadow-md">
              {activeInning.totalRuns} - {activeInning.wickets}
            </div>
            <div className="text-xs sm:text-sm font-black tracking-widest uppercase mt-0.5 text-blue-100">
              {activeInning.oversDisplay}/{activeMatch.overs} OVR
            </div>
            {activeMatch.targetRuns && (
              <div className="text-[11px] font-bold text-yellow-300">
                Target: {activeMatch.targetRuns} ({activeMatch.targetRuns - activeInning.totalRuns} needed)
              </div>
            )}
          </div>

          {/* Right Card: Bowler & Over Balls (Teal/Emerald to Cyan-Blue) */}
          <div className="rounded-xl p-3.5 bg-gradient-to-b from-[#10b981] to-[#0284c7] text-white shadow-lg flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between">
              <span className="truncate text-sm sm:text-base font-black tracking-wide uppercase font-mono-sport">
                {bowler?.name || 'M Starc'}
              </span>
              <span className="font-mono text-sm sm:text-base font-bold">
                {bowler?.runsConceded || 0} - {bowler?.wickets || 0} ({bowler?.oversBowled || 0})
              </span>
            </div>

            {/* 6 White Circular Ball-Tracker Slots */}
            <div className="flex items-center justify-between gap-1.5 pt-2">
              {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                const ball = activeInning.currentOverBalls[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner transition ${
                      ball
                        ? ball.isWicket
                          ? 'bg-red-600 text-white font-black'
                          : ball.runsOffBat === 4
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : ball.runsOffBat === 6
                          ? 'bg-fuchsia-500 text-white font-black'
                          : ball.extraType === 'wide' || ball.extraType === 'noBall'
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-white text-slate-900'
                        : 'bg-white/80 text-slate-400 border border-white/40'
                    }`}
                  >
                    {ball ? ball.displayCode : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SEND Button (Yellow #facc15) */}
        <div className="w-full flex justify-center -mt-1">
          <button
            onClick={manualSyncPulse}
            className={`w-full max-w-xs py-2 px-6 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black text-sm tracking-widest uppercase shadow-md active:scale-95 transition flex items-center justify-center gap-2 ${
              isSyncing ? 'ring-4 ring-yellow-400/50' : ''
            }`}
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span>SEND</span>
          </button>
        </div>

        {/* =========================================================
            4. MAIN DIAGONAL GRADIENT "CONTROLLER" BOX (Exact Replica)
        ========================================================= */}
        <div className="w-full rounded-2xl bg-diagonal-controller p-3.5 sm:p-4 shadow-xl border border-white/20 text-slate-900 flex flex-col gap-3">
          {/* Row 1 (12 Action Pills) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {[
              { label: 'SWAP BATTER', action: swapBatters },
              { label: 'RETIRE BATTER', action: () => setShowRetireModal(true) },
              { label: 'CHANGE BOWLER', action: () => setShowBowlerModal(true) },
              { label: 'Default', action: () => setDisplayMode('DEFAULT') },
              { label: 'Score', action: () => setDisplayMode('SCORE') },
              { label: 'Tour Name', action: () => setDisplayMode('DEFAULT') },
              { label: 'B1', action: () => setDisplayMode('B1') },
              { label: 'B2', action: () => setDisplayMode('B2') },
              { label: 'Bowler', action: () => setDisplayMode('BOWLER') },
              { label: 'Batting', action: () => setDisplayMode('SUMMARY') },
              { label: 'Bowling', action: () => setDisplayMode('1BALL') },
              {
                label: 'PP+',
                action: () => triggerAnimation('CUSTOM', 'POWERPLAY ON'),
              },
            ].map((pill, idx) => (
              <button
                key={idx}
                onClick={pill.action}
                className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-white/90 hover:bg-white text-slate-900 text-xs font-bold tracking-tight shadow-sm active:scale-95 transition border border-white/40"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Row 2: END Inning 1 (Purple) & UNDO (Red) */}
          <div className="flex items-center justify-between gap-3 px-2">
            <button
              onClick={endInnings}
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-95 transition"
            >
              END Inning {activeMatch.activeInningNumber}
            </button>

            <button
              onClick={undo}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>UNDO</span>
            </button>
          </div>

          {/* Row 3: Checkboxes (Wide, No Ball, Byes, Leg Byes, Wicket) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white/30 backdrop-blur-sm rounded-xl py-2 px-3 border border-white/40">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-slate-900 select-none">
              <input
                type="checkbox"
                checked={isWide}
                onChange={(e) => {
                  setIsWide(e.target.checked);
                  if (e.target.checked) {
                    setIsNoBall(false);
                    setIsBye(false);
                    setIsLegBye(false);
                  }
                }}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
              />
              Wide
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-slate-900 select-none">
              <input
                type="checkbox"
                checked={isNoBall}
                onChange={(e) => {
                  setIsNoBall(e.target.checked);
                  if (e.target.checked) {
                    setIsWide(false);
                    setIsBye(false);
                    setIsLegBye(false);
                  }
                }}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
              />
              No Ball
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-slate-900 select-none">
              <input
                type="checkbox"
                checked={isBye}
                onChange={(e) => {
                  setIsBye(e.target.checked);
                  if (e.target.checked) {
                    setIsWide(false);
                    setIsNoBall(false);
                    setIsLegBye(false);
                  }
                }}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
              />
              Byes
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-slate-900 select-none">
              <input
                type="checkbox"
                checked={isLegBye}
                onChange={(e) => {
                  setIsLegBye(e.target.checked);
                  if (e.target.checked) {
                    setIsWide(false);
                    setIsNoBall(false);
                    setIsBye(false);
                  }
                }}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 accent-cyan-600"
              />
              Leg Byes
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs sm:text-sm text-red-950 select-none">
              <input
                type="checkbox"
                checked={isWicket}
                onChange={(e) => setIsWicket(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600"
              />
              <span className="text-red-900">Wicket</span>
              <Info className="w-3.5 h-3.5 text-amber-500" />
            </label>
          </div>

          {/* Row 4: Circular Run Buttons */}
          <div className="flex flex-col items-center gap-2.5">
            {/* Row A: 0, 1, 2, 3 */}
            <div className="flex items-center justify-center gap-4">
              {[0, 1, 2, 3].map((run) => (
                <button
                  key={run}
                  onClick={() => handleScoreRun(run)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-slate-950 font-score text-2xl sm:text-3xl font-black border-2 border-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition flex items-center justify-center"
                >
                  {run}
                </button>
              ))}
            </div>

            {/* Row B: 4, 5, 6, ... */}
            <div className="flex items-center justify-center gap-4">
              {[4, 5, 6].map((run) => (
                <button
                  key={run}
                  onClick={() => handleScoreRun(run)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-slate-950 font-score text-2xl sm:text-3xl font-black border-2 border-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition flex items-center justify-center"
                >
                  {run}
                </button>
              ))}
              <button
                onClick={() => setShowCustomRunsModal(true)}
                title="Custom Runs"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-slate-950 font-bold text-lg border-2 border-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition flex items-center justify-center"
              >
                ...
              </button>
            </div>

            {/* Row C: 1D (1 Declared), ? (Help) */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleScoreRun(1)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base border-2 border-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition flex items-center justify-center"
              >
                1D
              </button>
              <button
                onClick={() => setShowHelpModal(true)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-slate-950 font-bold text-xl border-2 border-slate-900 shadow-md hover:bg-slate-100 active:scale-95 transition flex items-center justify-center"
              >
                ?
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            5. MAGENTA SQUAD MANAGEMENT STRIP (Exact Replica)
        ========================================================= */}
        <div className="w-full rounded-2xl bg-squad-strip p-4 shadow-xl text-white flex flex-col gap-3.5 relative">
          {/* Top buttons: Edit Team Short Name and Edit Logos */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowShortNameModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-xs font-bold tracking-wide border border-white/20 transition flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Team Short Name</span>
            </button>

            <button
              onClick={() => {
                setTeam1LogoDraft(activeMatch.team1.logoUrl || '');
                setTeam2LogoDraft(activeMatch.team2.logoUrl || '');
                setShowLogoModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-xs font-bold tracking-wide border border-white/20 transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Edit Logos</span>
            </button>
          </div>

          {/* Bulk Player Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Team 1 Input */}
            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/20">
              <input
                type="text"
                placeholder={`ADD PLAYER TO ${activeMatch.team1.name} (comma separated)`}
                value={team1BulkInput}
                onChange={(e) => setTeam1BulkInput(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-pink-200/70 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (team1BulkInput.trim()) {
                    addPlayersToTeam(activeMatch.team1.id, team1BulkInput.split(','));
                    setTeam1BulkInput('');
                  }
                }}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow shrink-0"
              >
                ADD
              </button>
            </div>

            {/* Team 2 Input */}
            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/20">
              <input
                type="text"
                placeholder={`ADD PLAYER TO ${activeMatch.team2.name} (comma separated)`}
                value={team2BulkInput}
                onChange={(e) => setTeam2BulkInput(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-pink-200/70 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (team2BulkInput.trim()) {
                    addPlayersToTeam(activeMatch.team2.id, team2BulkInput.split(','));
                    setTeam2BulkInput('');
                  }
                }}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow shrink-0"
              >
                ADD
              </button>
            </div>
          </div>

          {/* Squad Popover Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setSquadPopoverTeam(squadPopoverTeam === 'team1' ? null : 'team1')}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
            >
              {activeMatch.team1.name} Players ({activeMatch.team1.players.length})
            </button>
            <button
              onClick={() => setSquadPopoverTeam(squadPopoverTeam === 'team2' ? null : 'team2')}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
            >
              {activeMatch.team2.name} Players ({activeMatch.team2.players.length})
            </button>
          </div>

          {/* Squad Popover Floating Card */}
          {squadPopoverTeam && (
            <div className="mt-2 p-3 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-heading font-bold text-sm uppercase text-slate-900">
                  {squadPopoverTeam === 'team1' ? activeMatch.team1.name : activeMatch.team2.name} Squad List
                </h4>
                <button
                  onClick={() => setSquadPopoverTeam(null)}
                  className="text-slate-500 hover:text-slate-800 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 mt-2">
                {(squadPopoverTeam === 'team1' ? activeMatch.team1.players : activeMatch.team2.players).map(
                  (player, pIdx) => {
                    const isCyan = pIdx % 2 === 0;
                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold ${
                          isCyan ? 'bg-cyan-100/70 text-slate-900' : 'bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {player.photoUrl ? (
                            <img
                              src={player.photoUrl}
                              alt={player.name}
                              className="w-6 h-6 rounded-full object-cover border border-cyan-500"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold">
                              {player.name[0]}
                            </div>
                          )}
                          <span className="font-bold">{player.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {player.runs}r ({player.balls}b) | {player.wickets}w
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            setEditingPlayer({
                              teamId:
                                squadPopoverTeam === 'team1'
                                  ? activeMatch.team1.id
                                  : activeMatch.team2.id,
                              player: { ...player },
                            })
                          }
                          className="p-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            6. ANIMATIONS BAR (Black Strip - Exact Replica)
        ========================================================= */}
        <div className="w-full rounded-2xl bg-black p-3.5 shadow-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'FREE HIT', bg: 'bg-emerald-500 text-slate-950', type: 'FREE HIT' },
              { label: 'NO BALL', bg: 'bg-orange-500 text-white', type: 'NO BALL' },
              { label: 'HAT-TRICK BALL', bg: 'bg-fuchsia-600 text-white', type: 'HAT-TRICK BALL' },
              { label: 'WIDE', bg: 'bg-cyan-400 text-slate-950', type: 'WIDE' },
              { label: 'FOUR', bg: 'bg-blue-600 text-white', type: 'FOUR' },
              { label: 'SIX', bg: 'bg-yellow-400 text-slate-950', type: 'SIX' },
              { label: 'WICKET', bg: 'bg-red-600 text-white', type: 'WICKET' },
              { label: 'TOUR BOUNDARIES', bg: 'bg-indigo-600 text-white', type: 'TOUR BOUNDARIES' },
            ].map((anim, idx) => (
              <button
                key={idx}
                onClick={() => triggerAnimation(anim.type as AnimationTrigger['type'])}
                className={`px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider shadow active:scale-95 transition ${anim.bg}`}
              >
                {anim.label}
              </button>
            ))}

            {/* Red Octagonal STOP button */}
            <button
              onClick={clearAnimation}
              title="Clear Active Overlay Animation"
              className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider shadow border border-red-500 active:scale-95 transition flex items-center gap-1"
            >
              <span>STOP</span>
            </button>
          </div>

          {/* Custom Animation Input */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 shrink-0">Custom Animation :</span>
            <input
              type="text"
              maxLength={15}
              placeholder="Input max 15 chars"
              value={customAnimationText}
              onChange={(e) => setCustomAnimationText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => {
                if (customAnimationText.trim()) {
                  triggerAnimation('CUSTOM', customAnimationText.trim().toUpperCase());
                  setCustomAnimationText('');
                }
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase shrink-0 transition"
            >
              Display Animation
            </button>
          </div>
        </div>

        {/* =========================================================
            7. DISPLAY CONTROLLER & TEAM COLOR PICKER (Exact Replica)
        ========================================================= */}
        <div className="w-full rounded-2xl bg-slate-900 p-4 shadow-xl border border-slate-800 flex flex-col gap-4">
          {/* Overlay View Modes */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Display Controller (OBS Screen Views):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'DEFAULT',
                '1 BAT',
                '1 BALL',
                '1BAT',
                '2BAT',
                '1BALL',
                'SUMMARY',
                'FOW',
                'B1',
                'B2',
                'BOWLER',
                'TARGET',
                'PARTNERSHIP',
                'TEAMS PLAYERS',
                'SCORE',
              ].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDisplayMode(mode as DisplayMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                    activeMatch.displayMode === mode
                      ? 'bg-cyan-400 text-slate-950 shadow-md ring-2 ring-cyan-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Third Umpire Decision */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Third Umpire Decision:
            </span>
            <button
              onClick={() => setUmpireDecision('PENDING')}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition ${
                activeMatch.umpireDecision === 'PENDING'
                  ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-300'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}
            >
              PENDING
            </button>
            <button
              onClick={() => setUmpireDecision('OUT')}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition ${
                activeMatch.umpireDecision === 'OUT'
                  ? 'bg-red-600 text-white ring-2 ring-red-400'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              OUT
            </button>
            <button
              onClick={() => setUmpireDecision('NOT OUT')}
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition ${
                activeMatch.umpireDecision === 'NOT OUT'
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              NOT OUT
            </button>
            <button
              onClick={() => setUmpireDecision('NONE')}
              className="text-xs text-slate-400 hover:text-white underline ml-auto"
            >
              Clear Decision
            </button>
          </div>

          {/* Tournament Stats Graphics */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tournament Stats Overlays:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'POINTS TABLE',
                'TOP BATTERS',
                'TOP BOWLERS',
                'TOP 4/6 STRIKERS',
                'TOP PLAYER OF SERIES',
              ].map((statMode) => (
                <button
                  key={statMode}
                  onClick={() => setDisplayMode(statMode as DisplayMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition ${
                    activeMatch.displayMode === statMode
                      ? 'bg-fuchsia-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {statMode}
                </button>
              ))}
            </div>
          </div>

          {/* Select Team Color Pickers */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Select Team Color:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">{activeMatch.team1.name}:</span>
                <input
                  type="color"
                  value={team1Color}
                  onChange={(e) => setTeam1Color(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">{activeMatch.team2.name}:</span>
                <input
                  type="color"
                  value={team2Color}
                  onChange={(e) => setTeam2Color(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>
            </div>

            <button
              onClick={handleSaveColors}
              className="px-5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition"
            >
              SAVE COLORS
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          MODALS & FLOATING DIALOGS
      ========================================================= */}

      {/* WICKET MODAL */}
      {showWicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-black text-lg text-red-400 uppercase tracking-wide">
                Wicket Confirmation
              </h3>
              <button onClick={() => setShowWicketModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Dismissal Type</label>
                <select
                  value={wicketType}
                  onChange={(e) => setWicketType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="bowled">Bowled</option>
                  <option value="caught">Caught</option>
                  <option value="lbw">LBW</option>
                  <option value="runOut">Run Out</option>
                  <option value="stumped">Stumped</option>
                  <option value="hitWicket">Hit Wicket</option>
                  <option value="retired">Retired Hurt</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Batter Out</label>
                <select
                  value={outPlayerId}
                  onChange={(e) => setOutPlayerId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {striker && <option value={striker.id}>{striker.name} (Striker)</option>}
                  {nonStriker && <option value={nonStriker.id}>{nonStriker.name} (Non-Striker)</option>}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Next Batter Incoming</label>
                <select
                  value={nextBatterId}
                  onChange={(e) => setNextBatterId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">-- Select from Squad --</option>
                  {battingTeam.players
                    .filter(
                      (p) => !p.isOut && p.id !== activeInning.currentStrikerId && p.id !== activeInning.currentNonStrikerId
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowWicketModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWicket}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow"
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE BOWLER MODAL */}
      {showBowlerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-black text-lg text-cyan-400 uppercase">Select Bowler</h3>
              <button onClick={() => setShowBowlerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {bowlingTeam.players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    changeBowler(p.id);
                    setShowBowlerModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    p.id === activeInning.currentBowlerId
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-[11px] opacity-80">
                    {p.runsConceded}-{p.wickets} ({p.oversBowled})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RETIRE BATTER MODAL */}
      {showRetireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-fuchsia-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-black text-lg text-fuchsia-400 uppercase">Retire Batter</h3>
              <button onClick={() => setShowRetireModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (striker) retireBatter(striker.id);
                  setShowRetireModal(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left text-xs font-bold text-white flex justify-between"
              >
                <span>Retire Striker: {striker?.name}</span>
                <span className="text-emerald-400">{striker?.runs} runs</span>
              </button>
              <button
                onClick={() => {
                  if (nonStriker) retireBatter(nonStriker.id);
                  setShowRetireModal(false);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-left text-xs font-bold text-white flex justify-between"
              >
                <span>Retire Non-Striker: {nonStriker?.name}</span>
                <span className="text-slate-300">{nonStriker?.runs} runs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM RUNS MODAL */}
      {showCustomRunsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-xs w-full shadow-2xl flex flex-col gap-3">
            <h3 className="font-heading font-bold text-base text-white">Custom Runs Off Ball</h3>
            <input
              type="number"
              min="0"
              max="20"
              value={customRunsValue}
              onChange={(e) => setCustomRunsValue(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-score text-2xl text-center"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowCustomRunsModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleScoreRun(customRunsValue);
                  setShowCustomRunsModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs"
              >
                Add {customRunsValue} Runs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP / KEYBOARD SHORTCUTS MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-heading font-bold text-base text-cyan-400">Keyboard Shortcuts</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs space-y-2 text-slate-300">
              <p className="flex justify-between">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">0 - 6</span>
                <span>Score 0, 1, 2, 3, 4, 5, 6 runs</span>
              </p>
              <p className="flex justify-between">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">W</span>
                <span>Toggle Wide delivery</span>
              </p>
              <p className="flex justify-between">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">N</span>
                <span>Toggle No Ball delivery</span>
              </p>
              <p className="flex justify-between">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">K</span>
                <span>Toggle Wicket</span>
              </p>
              <p className="flex justify-between">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">U</span>
                <span>Undo last ball</span>
              </p>
              <p className="flex justify-between">
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">S</span>
                <span>Swap striker & non-striker</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TEAM SHORT NAMES MODAL */}
      {showShortNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-heading font-bold text-base text-white">Edit Team Details</h3>
              <button onClick={() => setShowShortNameModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Team 1 ({activeMatch.team1.name}) Short Code:
                </label>
                <input
                  type="text"
                  maxLength={5}
                  defaultValue={activeMatch.team1.shortName}
                  id="t1Short"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Team 2 ({activeMatch.team2.name}) Short Code:
                </label>
                <input
                  type="text"
                  maxLength={5}
                  defaultValue={activeMatch.team2.shortName}
                  id="t2Short"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const t1 = (document.getElementById('t1Short') as HTMLInputElement)?.value;
                  const t2 = (document.getElementById('t2Short') as HTMLInputElement)?.value;
                  if (t1) updateTeamDetails(activeMatch.team1.id, { shortName: t1.toUpperCase() });
                  if (t2) updateTeamDetails(activeMatch.team2.id, { shortName: t2.toUpperCase() });
                  setShowShortNameModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT & UPLOAD TEAM LOGOS MODAL */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-black text-lg text-white">Edit & Upload Team Logos</h3>
              </div>
              <button
                onClick={() => setShowLogoModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Upload logo images directly from your device (PNG with transparent background recommended) or enter an image URL.
            </p>

            <div className="space-y-4">
              {/* Team 1 Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-sm text-cyan-300 uppercase tracking-wide">
                    {activeMatch.team1.name}
                  </span>
                  {team1LogoDraft && (
                    <button
                      type="button"
                      onClick={() => setTeam1LogoDraft('')}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Preview Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-cyan-500/40 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow">
                    {team1LogoDraft ? (
                      <img src={team1LogoDraft} alt={activeMatch.team1.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] font-bold text-center">
                        <ImageIcon className="w-5 h-5 text-slate-600 mb-0.5" />
                        <span>NO LOGO</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition active:scale-95 shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoFileUpload(file, true);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Optional URL Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Or paste image URL (https://...)"
                    value={team1LogoDraft}
                    onChange={(e) => setTeam1LogoDraft(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Team 2 Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-sm text-pink-300 uppercase tracking-wide">
                    {activeMatch.team2.name}
                  </span>
                  {team2LogoDraft && (
                    <button
                      type="button"
                      onClick={() => setTeam2LogoDraft('')}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Preview Avatar */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-pink-500/40 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow">
                    {team2LogoDraft ? (
                      <img src={team2LogoDraft} alt={activeMatch.team2.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] font-bold text-center">
                        <ImageIcon className="w-5 h-5 text-slate-600 mb-0.5" />
                        <span>NO LOGO</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="w-full py-2.5 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition active:scale-95 shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoFileUpload(file, false);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Optional URL Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Or paste image URL (https://...)"
                    value={team2LogoDraft}
                    onChange={(e) => setTeam2LogoDraft(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowLogoModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateTeamDetails(activeMatch.team1.id, { logoUrl: team1LogoDraft });
                  updateTeamDetails(activeMatch.team2.id, { logoUrl: team2LogoDraft });
                  setShowLogoModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/25 active:scale-95 transition"
              >
                Save Logos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER EDIT & PHOTO CROPPER MODAL (Cyan to Green Gradient) */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-cyan-900/90 via-slate-900 to-emerald-950/90 border border-cyan-400/50 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <h3 className="font-heading font-black text-lg text-cyan-300 uppercase">
                Edit Player & Cutout
              </h3>
              <button onClick={() => setEditingPlayer(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Preview & Upload Trigger */}
            <div className="flex items-center gap-4 bg-black/30 p-3 rounded-xl border border-cyan-500/20">
              <div className="relative">
                {editingPlayer.player.photoUrl ? (
                  <img
                    src={editingPlayer.player.photoUrl}
                    alt={editingPlayer.player.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-cyan-400/50 flex items-center justify-center text-lg font-bold">
                    {editingPlayer.player.name[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-cyan-200">Player Photo Cutout</span>
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Photo +Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Editable Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Player Full Name</label>
                <input
                  type="text"
                  value={editingPlayer.player.name}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      player: { ...editingPlayer.player, name: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Runs Scored</label>
                <input
                  type="number"
                  value={editingPlayer.player.runs}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      player: { ...editingPlayer.player, runs: parseInt(e.target.value, 10) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Balls Faced</label>
                <input
                  type="number"
                  value={editingPlayer.player.balls}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      player: { ...editingPlayer.player, balls: parseInt(e.target.value, 10) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Wickets Taken</label>
                <input
                  type="number"
                  value={editingPlayer.player.wickets}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      player: { ...editingPlayer.player, wickets: parseInt(e.target.value, 10) || 0 },
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Runs Given</label>
                <input
                  type="number"
                  value={editingPlayer.player.runsConceded}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      player: {
                        ...editingPlayer.player,
                        runsConceded: parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Overs Bowled (e.g. 3.2)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingPlayer.player.oversBowled}
                  onChange={(e) =>
                    setEditingPlayer({
                      ...editingPlayer,
                      player: {
                        ...editingPlayer.player,
                        oversBowled: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/30">
              <button
                onClick={() => setEditingPlayer(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlayer}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow"
              >
                Save Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={rawImageSrc}
        onCropComplete={handleCropComplete}
        onClose={() => setCropperOpen(false)}
      />
    </div>
  );
};
