import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, signup, demoPaidLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }
        await signup(name, email, phone, password);
      }
    } catch {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 flex flex-col gap-5 text-white">
        {/* Glow Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-cyan-500/15 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-black text-2xl text-white">
            {isLogin ? 'Sign in to IconicScorer' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {isLogin
              ? 'Access your live cricket broadcast dashboard & active match controller'
              : 'Join IconicScorer to unlock professional broadcast overlays & scoreboards'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakib Al Hasan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-500 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone / WhatsApp (Optional)</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+880 1700 000000 or +91 98000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-500 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>{isLogin ? 'Log In' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => openAuthModal('signup')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => openAuthModal('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Log in here
              </button>
            </p>
          )}
        </div>

        {/* Demo One-Click Login Button for quick client testing */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col items-center">
          <button
            type="button"
            onClick={demoPaidLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-fuchsia-950/60 to-purple-950/60 hover:from-fuchsia-900/60 hover:to-purple-900/60 border border-fuchsia-500/40 text-fuchsia-200 text-xs font-bold flex items-center justify-center gap-2 transition shadow"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>Instant Demo: Test as Paid Member (1 Click)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
