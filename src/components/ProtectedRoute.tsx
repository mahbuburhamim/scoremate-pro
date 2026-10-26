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
    <div className="min-h-[85vh] bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-300/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-2xl w-full rounded-3xl bg-white/95 border border-slate-200/90 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(2,132,199,0.08)] relative overflow-hidden backdrop-blur-xl text-slate-900">
        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/10 mb-6">
          <Lock className="w-8 h-8" />
        </div>

        {/* Heading */}
        <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
          PRO SUBSCRIBER ACCESS ONLY
        </span>
        <h2 className="mt-4 font-heading font-black text-2xl sm:text-4xl text-slate-900">
          Unlock the <span className="text-blue-600">{featureName}</span>
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-normal leading-relaxed">
          {isAuthenticated
            ? `Hi ${user?.name || 'Streamer'}, you are currently signed in, but you need an active plan to access the live scorer, tournament manager, and OBS overlay links.`
            : 'IconicScorer is a commercial live broadcast software suite. Please create an account or sign in, then pick a plan to unlock live scoring and OBS overlays.'}
        </p>

        {/* Feature inclusions */}
        <div className="mt-6 py-4 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs sm:text-sm text-slate-700 space-y-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>4 TV-Grade transparent broadcast overlays (1080p 60fps)</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Interactive real-time scorer controller & multi-undo stack</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Circular player cutout studio & DRS umpire decisions</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/payment"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Choose a Plan (From ₹250)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 transition flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Log In to Existing Account</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 transition"
            >
              Switch Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
