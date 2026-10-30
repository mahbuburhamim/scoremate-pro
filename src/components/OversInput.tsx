const PRESETS = [5, 10, 15, 20, 50];

interface OversInputProps {
  value: number;
  onChange: (overs: number) => void;
  variant?: 'dark' | 'light';
}

/**
 * Overs per inning: type any number (1-50) or tap a preset.
 */
export function OversInput({ value, onChange, variant = 'light' }: OversInputProps) {
  const dark = variant === 'dark';

  const handleTyped = (raw: string) => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) {
      onChange(0); // lets the field be cleared while typing; callers fall back to 20
      return;
    }
    onChange(Math.min(50, Math.max(1, n)));
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={50}
        value={value || ''}
        placeholder="e.g. 16"
        onChange={(e) => handleTyped(e.target.value)}
        className={
          dark
            ? 'w-full bg-slate-800 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-bold focus:outline-none'
            : 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition'
        }
      />
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => {
          const active = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                active
                  ? dark
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-blue-600 text-white'
                  : dark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
