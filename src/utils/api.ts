// Client for the PHP API in public/api. Session is an HttpOnly cookie set by the server.

export interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

const REQUEST_TIMEOUT_MS = 10_000;

async function request<T = any>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  // A slow server must never leave requests hanging: they pile up and block the whole site
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(path, {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
      ...init,
      headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...(init?.headers || {}) },
    });
    if (res.status === 204) return { ok: true, status: 204 };
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      return { ok: false, status: res.status, error: 'সার্ভার থেকে সঠিক উত্তর আসেনি (Server error)' };
    }
    if (!res.ok || json?.ok === false) {
      return { ok: false, status: res.status, error: json?.error || `Request failed (${res.status})`, data: json };
    }
    return { ok: true, status: res.status, data: json };
  } catch {
    return { ok: false, status: 0, error: 'ইন্টারনেট সংযোগ নেই বা সার্ভারে পৌঁছানো যাচ্ছে না (Network error)' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Repeating poll that never overlaps (the next run waits for the previous one) and slows down
 * while the server is failing, so a struggling server isn't hammered.
 * `run` returns true on success, false on failure.
 */
export function startPoller(run: () => Promise<boolean>, intervalMs: number, maxBackoffMs = 15_000) {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let failures = 0;
  const tick = async () => {
    if (stopped) return;
    let ok = false;
    try {
      ok = await run();
    } catch {
      ok = false;
    }
    if (stopped) return;
    failures = ok ? 0 : failures + 1;
    const delay = failures === 0 ? intervalMs : Math.min(maxBackoffMs, intervalMs * 2 ** Math.min(failures, 6));
    timer = setTimeout(tick, delay);
  };
  tick();
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}

const post = <T = any>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

export type Sport = 'cricket' | 'football';

export const api = {
  me: () => request('/api/auth.php?action=me'),
  login: (email: string, password: string) => post('/api/auth.php', { action: 'login', email, password }),
  signup: (name: string, email: string, password: string, phone?: string) =>
    post('/api/auth.php', { action: 'signup', name, email, password, phone }),
  logout: () => post('/api/auth.php', { action: 'logout' }),
  config: () => request('/api/auth.php?action=config'),
  forgotPassword: (email: string) => post('/api/auth.php', { action: 'forgot', email }),
  resetPassword: (token: string, password: string) => post('/api/auth.php', { action: 'reset', token, password }),
  google: (credential: string) => post('/api/auth.php', { action: 'google', credential }),

  getState: (sport: Sport, since = 0) =>
    request(`/api/state.php?sport=${sport}${since ? `&since=${since}` : ''}`),
  saveState: (sport: Sport, data: unknown) => post('/api/state.php', { sport, data }),

  getOverlay: (key: string, sport: Sport, since = 0) =>
    request(`/api/overlay.php?key=${encodeURIComponent(key)}&sport=${sport}${since ? `&since=${since}` : ''}`),

  submitPayment: (planId: string, method: 'bkash' | 'nagad', trxId: string, sender?: string) =>
    post('/api/payments.php', { planId, method, trxId, sender }),
  myPayments: () => request('/api/payments.php'),

  admin: {
    payments: (status: 'pending' | 'approved' | 'rejected' | 'all' = 'pending') =>
      request(`/api/admin.php?view=payments&status=${status}`),
    users: (q = '') => request(`/api/admin.php?view=users&q=${encodeURIComponent(q)}`),
    review: (paymentId: number, action: 'approve' | 'reject', note?: string) =>
      post('/api/admin.php', { action, paymentId, note }),
    grant: (email: string, planId: string) => post('/api/admin.php', { action: 'grant', email, planId }),
    revoke: (email: string) => post('/api/admin.php', { action: 'revoke', email }),
    resetLink: (email: string) => post('/api/admin.php', { action: 'reset_link', email }),
  },
};

/**
 * Pushes state to the server at most every `waitMs`, always sending the latest value.
 * Scoring fires many updates quickly (timer ticks, ball taps); this keeps the server load sane
 * without dropping the final state.
 */
export function createThrottledSaver(sport: Sport, waitMs = 300) {
  let pending: unknown = undefined;
  let hasPending = false;
  let inFlight = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastError: string | null = null;
  const listeners = new Set<(err: string | null) => void>();

  const flush = async () => {
    timer = null;
    if (inFlight || !hasPending) return;
    const data = pending;
    hasPending = false;
    inFlight = true;
    const res = await api.saveState(sport, data);
    inFlight = false;
    const err = res.ok ? null : res.error || 'Save failed';
    if (err !== lastError) {
      lastError = err;
      listeners.forEach((l) => l(err));
    }
    if (hasPending) schedule();
  };

  const schedule = () => {
    if (!timer) timer = setTimeout(flush, waitMs);
  };

  return {
    save(data: unknown) {
      pending = data;
      hasPending = true;
      schedule();
    },
    /** Drop anything not yet sent (used when the logged-in account changes) */
    cancel() {
      if (timer) clearTimeout(timer);
      timer = null;
      hasPending = false;
      pending = undefined;
    },
    onError(listener: (err: string | null) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
