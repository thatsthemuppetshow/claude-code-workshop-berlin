'use client';
import { Lang } from '../lib/translations';

interface Props {
  onSelect: (lang: Lang) => void;
}

const options: { lang: Lang; flag: string; label: string }[] = [
  { lang: 'en', flag: '🇬🇧', label: 'English' },
  { lang: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { lang: 'tr', flag: '🇹🇷', label: 'Türkçe' },
];

export default function LanguageSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-extrabold text-ink mb-2 tracking-tight">my-qr-album</h1>
      <p className="text-ink/50 mb-14 text-center">Scan. Share. Remember.</p>

      <div className="w-full max-w-xs flex flex-col gap-4">
        {options.map(({ lang, flag, label }) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl border-2 border-ink/10 bg-muted hover:border-accent hover:bg-accent/5 transition text-left"
          >
            <span className="text-3xl">{flag}</span>
            <span className="text-lg font-semibold text-ink">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
