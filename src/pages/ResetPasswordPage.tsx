import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const { resetPassword, openAuthModal } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const validToken = /^[a-f0-9]{64}$/.test(token);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে');
      return;
    }
    if (password !== confirm) {
      setError('দুটো পাসওয়ার্ড মিলছে না');
      return;
    }
    setBusy(true);
    const result = await resetPassword(token, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error || 'পাসওয়ার্ড বদলানো যায়নি');
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/'), 1800);
  };

  const inputCls =
    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-slate-900 placeholder-slate-400 font-medium transition';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(2,132,199,0.18)] flex flex-col gap-5 text-slate-900">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-3">
            {done ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <Lock className="w-6 h-6" />}
          </div>
          <h1 className="font-heading font-black text-2xl">{done ? 'পাসওয়ার্ড বদলানো হয়েছে' : 'নতুন পাসওয়ার্ড সেট করুন'}</h1>
          {done && <p className="text-xs text-slate-500 mt-1">আপনি এখন লগইন অবস্থায় আছেন। অন্য সব device থেকে লগআউট করে দেওয়া হয়েছে।</p>}
        </div>

        {!done && !validToken && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center leading-relaxed">
            লিংকটি সঠিক নয় বা অসম্পূর্ণ। ইমেইলের পুরো লিংকটি খুলুন, অথবা নতুন লিংক নিন।
            <button
              onClick={() => openAuthModal('forgot')}
              className="block mx-auto mt-3 px-4 py-2 rounded-full bg-blue-600 text-white font-bold"
            >
              নতুন লিংক নিন
            </button>
          </div>
        )}

        {!done && validToken && (
          <form onSubmit={submit} className="flex flex-col gap-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                {error}
                {/(মেয়াদ|expired)/i.test(error) && (
                  <button type="button" onClick={() => openAuthModal('forgot')} className="block mx-auto mt-2 font-bold underline">
                    নতুন লিংক নিন
                  </button>
                )}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">আবার লিখুন</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="একই পাসওয়ার্ড"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-1 w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-heading font-black text-sm uppercase tracking-wider active:scale-95 transition"
            >
              {busy ? 'সেভ হচ্ছে...' : 'পাসওয়ার্ড সেভ করুন'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
