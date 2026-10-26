import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AnimationTrigger } from '../../types/cricket';

interface EventRibbonProps {
  animation: AnimationTrigger | null;
  onComplete: () => void;
}

export const EventRibbon: React.FC<EventRibbonProps> = ({ animation, onComplete }) => {
  useEffect(() => {
    if (!animation) return;

    // Trigger confetti for boundary or wicket events
    if (animation.type === 'SIX' || animation.type === 'FOUR') {
      try {
        confetti({
          particleCount: animation.type === 'SIX' ? 80 : 45,
          spread: 70,
          origin: { y: 0.8 },
          colors: animation.type === 'SIX' ? ['#facc15', '#ec4899', '#38bdf8'] : ['#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch {
        // ignore
      }
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [animation, onComplete]);

  if (!animation) return null;

  const getStyle = () => {
    switch (animation.type) {
      case 'SIX':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600',
          text: 'SIX  •  MAXIMUM  •  SIX  •  MAXIMUM',
          textColor: 'text-slate-950',
          shadow: 'shadow-yellow-500/50',
        };
      case 'FOUR':
        return {
          bg: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700',
          text: 'FOUR  •  BOUNDARY  •  FOUR  •  BOUNDARY',
          textColor: 'text-white',
          shadow: 'shadow-cyan-500/50',
        };
      case 'WICKET':
        return {
          bg: 'bg-gradient-to-r from-red-700 via-rose-600 to-red-800',
          text: 'WICKET  •  OUT  •  WICKET  •  OUT',
          textColor: 'text-white',
          shadow: 'shadow-red-600/50',
        };
      case 'FREE HIT':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-700',
          text: '⚡ FREE HIT  •  FREE HIT  •  FREE HIT ⚡',
          textColor: 'text-slate-950',
          shadow: 'shadow-emerald-500/50',
        };
      case 'NO BALL':
        return {
          bg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-700',
          text: 'NO BALL  •  FREE HIT NEXT',
          textColor: 'text-white',
          shadow: 'shadow-orange-500/50',
        };
      case 'WIDE':
        return {
          bg: 'bg-gradient-to-r from-cyan-600 via-sky-400 to-cyan-700',
          text: 'WIDE BALL  •  EXTRA +1',
          textColor: 'text-slate-950',
          shadow: 'shadow-cyan-500/50',
        };
      case 'HAT-TRICK BALL':
        return {
          bg: 'bg-gradient-to-r from-fuchsia-700 via-purple-600 to-fuchsia-800',
          text: '🔥 HAT-TRICK BALL 🔥',
          textColor: 'text-white',
          shadow: 'shadow-fuchsia-600/50',
        };
      case 'TOUR BOUNDARIES':
        return {
          bg: 'bg-gradient-to-r from-indigo-700 via-violet-500 to-indigo-800',
          text: '🏆 TOURNAMENT BOUNDARY MOMENT 🏆',
          textColor: 'text-white',
          shadow: 'shadow-indigo-600/50',
        };
      case 'CUSTOM':
      default:
        return {
          bg: 'bg-gradient-to-r from-emerald-500 via-cyan-400 to-fuchsia-500',
          text: animation.customText || 'SPECIAL MOMENT',
          textColor: 'text-slate-950',
          shadow: 'shadow-purple-500/50',
        };
    }
  };

  const style = getStyle();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 150, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 150, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        className="fixed bottom-28 left-0 right-0 z-40 flex items-center justify-center px-8 pointer-events-none"
      >
        <div
          className={`w-full max-w-5xl py-3 px-6 rounded-2xl ${style.bg} ${style.textColor} shadow-2xl ${style.shadow} border-2 border-white/40 flex items-center justify-center overflow-hidden`}
        >
          <motion.div
            animate={{ x: ['0%', '-5%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="flex items-center gap-6 whitespace-nowrap"
          >
            <span className="font-heading font-black text-3xl sm:text-4xl tracking-widest uppercase drop-shadow">
              {style.text}
            </span>
            <span className="font-heading font-black text-3xl sm:text-4xl tracking-widest uppercase drop-shadow">
              {style.text}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
