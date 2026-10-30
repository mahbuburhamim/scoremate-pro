import React, { useCallback, useEffect, useState } from 'react';
import { Check, X, RefreshCw, ShieldCheck, Search, Gift, Ban } from 'lucide-react';
import { useAuth, SUBSCRIPTION_PLANS } from '../context/AuthContext';
import { api } from '../utils/api';

interface PaymentRow {
  id: number;
  plan_id: string;
  plan_name: string;
  amount: number;
  method: string;
  sender: string | null;
  trx_id: string;
  status: 'pending' | 'approved' | 'rejected';
  note: string | null;
  created_at: number;
  user_name: string;
  user_email: string;
  user_phone: string | null;
}

interface UserRow {
  public_id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  plan_name: string | null;
  plan_expires_at: number | null;
  tickets_remaining: number;
  created_at: number;
}

const fmt = (ms: number | null) =>
  ms ? new Date(ms).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export const AdminPage: React.FC = () => {
  const { isAdmin, authLoading } = useAuth();
  const [tab, setTab] = useState<'payments' | 'users'>('payments');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [now, setNow] = useState<number>(Date.now());
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantPlan, setGrantPlan] = useState(SUBSCRIPTION_PLANS[0].id);

  const loadPayments = useCallback(async () => {
    const res = await api.admin.payments(status);
    if (res.ok) setPayments(res.data.payments);
    else setMessage({ type: 'err', text: res.error || 'Load failed' });
  }, [status]);

  const loadUsers = useCallback(async () => {
    const res = await api.admin.users(search);
    if (res.ok) {
      setUsers(res.data.users);
      setNow(res.data.now);
    } else setMessage({ type: 'err', text: res.error || 'Load failed' });
  }, [search]);

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'payments') loadPayments();
    else loadUsers();
  }, [isAdmin, tab, loadPayments, loadUsers]);

  // New payment requests show up without a manual refresh
  useEffect(() => {
    if (!isAdmin || tab !== 'payments') return;
    const t = setInterval(loadPayments, 30_000);
    return () => clearInterval(t);
  }, [isAdmin, tab, loadPayments]);

  const review = async (p: PaymentRow, action: 'approve' | 'reject') => {
    const verb = action === 'approve' ? 'Approve' : 'Reject';
    if (!window.confirm(`${verb}: ${p.user_email} — ${p.plan_name} ৳${p.amount}, TrxID ${p.trx_id}?`)) return;
    setBusyId(p.id);
    const res = await api.admin.review(p.id, action);
    setBusyId(null);
    setMessage(res.ok ? { type: 'ok', text: `${verb}d ${p.trx_id}` } : { type: 'err', text: res.error || 'Failed' });
    loadPayments();
  };

  const grant = async () => {
    if (!grantEmail.trim()) return;
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === grantPlan);
    if (!window.confirm(`Give ${plan?.name} to ${grantEmail.trim()} without payment?`)) return;
    const res = await api.admin.grant(grantEmail.trim(), grantPlan);
    setMessage(res.ok ? { type: 'ok', text: `Plan given to ${grantEmail.trim()}` } : { type: 'err', text: res.error || 'Failed' });
    if (res.ok) {
      setGrantEmail('');
      loadUsers();
    }
  };

  const revoke = async (email: string) => {
    if (!window.confirm(`End ${email}'s subscription now?`)) return;
    const res = await api.admin.revoke(email);
    setMessage(res.ok ? { type: 'ok', text: `Subscription ended for ${email}` } : { type: 'err', text: res.error || 'Failed' });
    loadUsers();
  };

  if (authLoading) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 text-sm font-bold">
        Admin only.
      </div>
    );
  }

  const pill = (active: boolean) =>
    `px-4 py-2 rounded-full text-xs font-bold transition ${
      active ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-5 text-slate-900">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-heading font-black text-2xl flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" /> Admin
        </h1>
        <div className="flex gap-2">
          <button className={pill(tab === 'payments')} onClick={() => setTab('payments')}>Payments</button>
          <button className={pill(tab === 'users')} onClick={() => setTab('users')}>Users</button>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-bold ${
            message.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {tab === 'payments' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
              <button key={s} className={pill(status === s)} onClick={() => setStatus(s)}>
                {s}
              </button>
            ))}
            <button onClick={loadPayments} className="ml-auto p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-50" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Approve করার আগে আপনার bKash/Nagad অ্যাপে TrxID আর টাকার পরিমাণ মিলিয়ে নিন। Approve করলেই প্যাকেজ চালু হয়ে যায়।
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">TrxID</th>
                  <th className="p-3 text-left">Sender</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">No {status} payments</td>
                  </tr>
                )}
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="p-3 whitespace-nowrap">{fmt(p.created_at)}</td>
                    <td className="p-3">
                      <div className="font-bold">{p.user_name}</div>
                      <div className="text-slate-500">{p.user_email}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {p.plan_name} <span className="font-bold">৳{p.amount}</span>
                    </td>
                    <td className="p-3 uppercase font-bold">{p.method}</td>
                    <td className="p-3 font-mono font-bold">{p.trx_id}</td>
                    <td className="p-3 font-mono">{p.sender || p.user_phone || '—'}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {p.status === 'pending' ? (
                        <div className="inline-flex gap-1.5">
                          <button
                            disabled={busyId === p.id}
                            onClick={() => review(p, 'approve')}
                            className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            disabled={busyId === p.id}
                            onClick={() => review(p, 'reject')}
                            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-red-600 font-bold inline-flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className={p.status === 'approved' ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                          {p.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'users' && (
        <>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                placeholder="Search name, email, phone"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <button onClick={loadUsers} className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">Search</button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex gap-2 flex-wrap items-center text-xs">
            <Gift className="w-4 h-4 text-blue-600" />
            <span className="font-bold">Give a plan without payment:</span>
            <input
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              placeholder="customer@email.com"
              className="px-3 py-2 rounded-xl border border-slate-200 min-w-[200px]"
            />
            <select value={grantPlan} onChange={(e) => setGrantPlan(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200">
              {SUBSCRIPTION_PLANS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button onClick={grant} className="px-4 py-2 rounded-full bg-emerald-600 text-white font-bold">Give</button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Expires</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const active = u.role === 'admin' || (!!u.plan_expires_at && u.plan_expires_at > now);
                  return (
                    <tr key={u.public_id} className="border-t border-slate-100">
                      <td className="p-3">
                        <div className="font-bold">
                          {u.name} {u.role === 'admin' && <span className="text-blue-600">(admin)</span>}
                        </div>
                        <div className="text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-3 font-mono">{u.phone || '—'}</td>
                      <td className="p-3">
                        {u.plan_name || '—'}{' '}
                        <span className={active ? 'text-emerald-600 font-bold' : 'text-slate-400'}>{active ? 'active' : 'inactive'}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap">{fmt(u.plan_expires_at)}</td>
                      <td className="p-3 whitespace-nowrap">{fmt(u.created_at)}</td>
                      <td className="p-3 text-right">
                        {active && u.role !== 'admin' && (
                          <button onClick={() => revoke(u.email)} className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-red-600 font-bold inline-flex items-center gap-1">
                            <Ban className="w-3.5 h-3.5" /> End
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
