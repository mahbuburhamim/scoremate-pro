import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, signup, requestPasswordReset, appConfig } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';
  const isForgot = authModalMode === 'forgot';

  const switchMode = (mode: 'login' | 'signup' | 'forgot') => {
    setErrorMsg('');
    setInfoMsg('');
    openAuthModal(mode);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    if (!email.trim()) {
      setErrorMsg('আপনার account এর ইমেইল দিন');
      return;
    }
    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error || 'কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন');
      return;
    }
    setInfoMsg('এই ইমেইলে account থাকলে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। Inbox আর Spam দুটোই দেখুন। লিংকটি ৩০ মিনিট কাজ করবে।');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('ইমেইল দিন (Please enter your email address)');
      return;
    }
    if (!isLogin && !name.trim()) {
      setErrorMsg('আপনার নাম দিন (Please enter your full name)');
      return;
    }
    if (!password) {
      setErrorMsg('পাসওয়ার্ড দিন (Please enter your password)');
      return;
    }
    if (!isLogin && password.length < 8) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে (At least 8 characters)');
      return;
    }

    setIsLoading(true);
    const result = isLogin ? await login(email, password) : await signup(name, email, password, phone);
    setIsLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error || 'কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন');
      return;
    }
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.18)] flex flex-col gap-5 text-slate-900">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-sky-400/20 blur-2xl pointer-events-none rounded-full" />

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-3 shadow-md shadow-sky-500/10">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900">
            {isForgot ? 'পাসওয়ার্ড ভুলে গেছেন?' : isLogin ? 'Sign in to IconicScorer' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {isForgot
              ? 'আপনার account এর ইমেইল দিন, নতুন পাসওয়ার্ড সেট করার লিংক পাঠিয়ে দেব।'
              : isLogin
              ? 'Access your live cricket broadcast dashboard & active match controller'
              : 'Join IconicScorer to unlock professional broadcast overlays & scoreboards'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center font-medium">
            {infoMsg}
          </div>
        )}

        {isForgot ? (
          appConfig.emailEnabled ? (
            <form onSubmit={handleForgot} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 font-medium transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider active:scale-95 transition"
              >
                {isLoading ? 'পাঠানো হচ্ছে...' : 'Reset Link পাঠান'}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed text-center">
              পাসওয়ার্ড রিসেট করতে <a href="/contact" className="font-bold underline">Contact পেজে</a> আপনার account এর ইমেইল দিয়ে যোগাযোগ করুন। আমরা আপনাকে একটি রিসেট লিংক পাঠিয়ে দেব।
            </div>
          )
        ) : (
        <>
        <GoogleSignInButton text={isLogin ? 'signin_with' : 'signup_with'} onError={setErrorMsg} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shakib Al Hasan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 font-medium transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 font-medium transition"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp (Optional)</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+880 1700 000000 or +91 98000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 font-medium transition"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                minLength={isLogin ? undefined : 8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder={isLogin ? '••••••••' : 'কমপক্ষে ৮ অক্ষর'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 font-medium transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] active:scale-95 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
            ) : (
              <>
                <span>{isLogin ? 'Log In' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        </>
        )}

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-500">
          {isForgot ? (
            <p>
              পাসওয়ার্ড মনে পড়েছে?{' '}
              <button onClick={() => switchMode('login')} className="text-blue-600 font-bold hover:underline">
                Log in
              </button>
            </p>
          ) : isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="text-blue-600 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-blue-600 font-bold hover:underline"
              >
                Log in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
