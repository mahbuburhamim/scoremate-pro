import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldAlert, Sparkles, CreditCard, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  featureName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, featureName = 'Broadcast Feature' }) => {
  const { isAuthenticated, hasActiveSubscription, user, openAuthModal } = useAuth();

  // If user is logged in AND has an active subscription, let them in!
  if (isAuthenticated && hasActiveSubscription) {
    return <>{children}</>;
  }

  // Otherwise, render a clean, high-conversion paywall gate
  return (
    <div className="min-h-[85vh] bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-fuchsia-600/15 blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shadow-xl shadow-fuchsia-500/10 mb-6">
          <Lock className="w-8 h-8" />
        </div>

        {/* Heading */}
        <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-3.5 py-1.5 rounded-full border border-fuchsia-500/20">
          PRO SUBSCRIBER ACCESS ONLY
        </span>
        <h2 className="mt-4 font-heading font-black text-2xl sm:text-4xl text-white">
          Unlock the {featureName}
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-lg mx-auto font-normal leading-relaxed">
          {isAuthenticated
            ? `Hi ${user?.name || 'Streamer'}, you are currently signed in, but you need an active plan to access the live scorer, tournament manager, and OBS overlay links.`
            : 'IconicScorer is a commercial live broadcast software suite. Please create an account or sign in, then pick a plan to unlock live scoring and OBS overlays.'}
        </p>

        {/* Feature inclusions */}
        <div className="mt-6 py-4 px-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-left text-xs sm:text-sm text-slate-300 space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 text-white font-medium">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>4 TV-Grade transparent broadcast overlays (1080p 60fps)</span>
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Interactive real-time scorer controller & multi-undo stack</span>
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <Sparkles className="w-4 h-4 text-fuchsia-400 shrink-0" />
            <span>Circular player cutout studio & DRS umpire decisions</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/payment"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-heading font-black text-sm uppercase tracking-wider shadow-xl shadow-fuchsia-600/30 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Choose a Plan (From ₹250)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Log In to Existing Account</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
            >
              Switch Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
