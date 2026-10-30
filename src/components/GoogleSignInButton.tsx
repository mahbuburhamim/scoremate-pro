import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    google?: any;
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisLoading: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisLoading) return gisLoading;
  gisLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisLoading = null;
      reject(new Error('Google script failed to load'));
    };
    document.head.appendChild(script);
  });
  return gisLoading;
}

interface Props {
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  onError?: (message: string) => void;
}

/** "Sign in with Google" button. Renders nothing until Google login is configured on the server. */
export const GoogleSignInButton: React.FC<Props> = ({ text = 'continue_with', onError }) => {
  const { appConfig, loginWithGoogle } = useAuth();
  const holderRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const clientId = appConfig.googleClientId;
  // Keep the latest handlers without re-initialising Google on every render
  const loginRef = useRef(loginWithGoogle);
  const errorRef = useRef(onError);
  loginRef.current = loginWithGoogle;
  errorRef.current = onError;

  useEffect(() => {
    if (!clientId || !holderRef.current) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !holderRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential?: string }) => {
            if (!response.credential) return;
            setBusy(true);
            const result = await loginRef.current(response.credential);
            setBusy(false);
            if (!result.ok) errorRef.current?.(result.error || 'Google login failed');
          },
          ux_mode: 'popup',
          cancel_on_tap_outside: true,
        });
        holderRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(holderRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text,
          width: Math.min(holderRef.current.offsetWidth || 320, 400),
        });
      })
      .catch(() => errorRef.current?.('Google login লোড হয়নি। ইন্টারনেট সংযোগ দেখুন।'));
    return () => {
      cancelled = true;
    };
  }, [clientId, text]);

  if (!clientId) return null;

  return (
    <div className="flex flex-col gap-3">
      <div ref={holderRef} className={`w-full flex justify-center min-h-[44px] ${busy ? 'opacity-50 pointer-events-none' : ''}`} />
      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
        <div className="h-px flex-1 bg-slate-200" />
        <span>অথবা ইমেইল দিয়ে</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
};
