import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SubscriptionCountdownProps {
  targetTimestamp?: number;
  compact?: boolean;
  className?: string;
}

export const SubscriptionCountdown: React.FC<SubscriptionCountdownProps> = ({
  targetTimestamp: propTimestamp,
  compact = false,
  className = '',
}) => {
  const { user } = useAuth();
  const timestamp = propTimestamp || user?.planExpiryTimestamp;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!timestamp) return;

    const calculateTime = () => {
      const now = Date.now();
      const diff = timestamp - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours: totalHours > 24 ? hours : totalHours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) {
    return null;
  }

  if (timeLeft.isExpired) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 border border-rose-300 font-mono text-xs font-bold ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Subscription Expired</span>
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  // Format string: e.g. "23h 59m 45s" or "3d 14h 20m 10s"
  const timeFormatted =
    timeLeft.days > 0
      ? `${timeLeft.days}d ${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`
      : `${pad(timeLeft.hours)}h ${pad(timeLeft.minutes)}m ${pad(timeLeft.seconds)}s`;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-300 font-mono text-xs font-bold ${className}`}
        title="Active Subscription Time Remaining"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <Clock className="w-3 h-3 text-emerald-600" />
        <span>{timeFormatted}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-800 shadow-sm backdrop-blur-md ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <Clock className="w-4 h-4 text-emerald-600 animate-spin-slow" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
      <div className="flex items-center gap-1 text-xs">
        <span className="font-semibold text-emerald-900 hidden sm:inline">Remaining:</span>
        <span className="font-mono font-black text-emerald-700 tracking-wide">
          {timeFormatted}
        </span>
      </div>
    </div>
  );
};
