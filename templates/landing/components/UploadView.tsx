'use client';
import { useRef, useState } from 'react';
import { Lang, t } from '../lib/translations';

interface Props {
  lang: Lang;
  onUpload: (srcs: string[]) => void;
  onGallery: () => void;
  onHome: () => void;
  photoCount: number;
  recentPhotos: string[];
}

type Status = 'idle' | 'preview' | 'uploading' | 'done';

export default function UploadView({ lang, onUpload, onGallery, onHome, photoCount, recentPhotos }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [previews, setPreviews] = useState<string[]>([]);
  const [showFaq, setShowFaq] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const T = t[lang];

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const readers = files.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(base64s => {
      setPreviews(base64s);
      setStatus('preview');
    });
  }

  function handleUpload() {
    setStatus('uploading');
    setTimeout(() => {
      onUpload(previews);
      setStatus('done');
    }, 800);
  }

  function handleSave() {
    previews.forEach((src, i) => {
      const a = document.createElement('a');
      a.href = src;
      a.download = `photo-${i + 1}.jpg`;
      setTimeout(() => a.click(), i * 150);
    });
  }

  function reset() {
    setStatus('idle');
    setPreviews([]);
    if (inputRef.current) inputRef.current.value = '';
  }

  const count = previews.length;

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
        <button onClick={onHome} className="text-xl font-bold text-ink hover:text-accent transition">
          {T.home}
        </button>
        <button
          onClick={() => setShowFaq(true)}
          className="ml-auto px-4 py-1.5 border-2 border-ink/20 rounded-full text-sm font-bold text-ink hover:border-accent hover:text-accent transition"
        >
          {T.faq}
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* ── Done ── */}
        {status === 'done' && (
          <div className="text-center w-full max-w-xs">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-1">
              {count === 1 ? T.uploaded1 : T.uploadedN(count)}
            </h2>
            <p className="text-ink/60 mb-8">{T.everyoneSee}</p>

            <button onClick={handleSave} className="w-full py-4 bg-accent text-white rounded-full font-semibold text-lg">
              {T.saveDevice}
            </button>
            <div className="h-4" />
            <button onClick={onGallery} className="w-full py-4 bg-ink text-paper rounded-full font-semibold text-lg">
              {T.checkAlbum}
            </button>
            <div className="h-4" />
            <button onClick={reset} className="w-full py-4 border-2 border-ink/20 rounded-full font-semibold text-ink">
              {T.uploadMore}
            </button>
          </div>
        )}

        {/* ── Preview / Uploading ── */}
        {(status === 'preview' || status === 'uploading') && (
          <div className="w-full max-w-sm flex flex-col items-center">
            {previews.length === 1 ? (
              <div className="w-full aspect-square rounded-3xl overflow-hidden mb-4 border-2 border-accent">
                <img src={previews[0]} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-2 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-accent">
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-ink/50 mb-4">{T.selected(count)}</p>
            <button
              onClick={handleUpload}
              disabled={status === 'uploading'}
              className="w-full py-3 bg-accent text-white rounded-full font-semibold text-lg mb-3 disabled:opacity-60"
            >
              {status === 'uploading' ? T.uploading : T.uploadBtn(count)}
            </button>
            <button onClick={reset} className="w-full py-3 border border-ink/20 rounded-full font-semibold text-ink">
              {T.chooseDifferent}
            </button>
          </div>
        )}

        {/* ── Idle ── */}
        {status === 'idle' && (
          <>
            <h1 className="text-3xl font-bold text-ink mb-2 text-center">{T.sharePhotos}</h1>
            <p className="text-ink/60 text-center mb-10">{T.tapHint}</p>

            <div className="flex gap-6">
              {/* Camera button */}
              <button onClick={() => inputRef.current?.click()} className="flex flex-col items-center gap-3 group">
                <div className="w-36 h-36 rounded-3xl bg-muted flex items-center justify-center border-2 border-transparent group-hover:border-accent transition">
                  <svg className="w-16 h-16 text-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-ink">{T.uploadPhotos}</span>
                <span className="text-xs text-ink/40">{T.noFileChosen}</span>
              </button>

              {/* Album button */}
              <button onClick={onGallery} className="flex flex-col items-center gap-3 group relative">
                <div className="w-36 h-36 rounded-3xl bg-muted border-2 border-transparent group-hover:border-ink transition relative overflow-hidden flex items-center justify-center">
                  {recentPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-0.5 w-full h-full p-1">
                      {recentPhotos.map((src, i) => (
                        <div key={i} className="rounded overflow-hidden bg-muted">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <svg className="w-16 h-16 text-ink" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  )}
                  {photoCount > 0 && (
                    <span className="absolute top-2 right-2 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {photoCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-ink">{T.viewAlbum}</span>
              </button>
            </div>
          </>
        )}
      </main>

      <input ref={inputRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFiles} aria-hidden="true" style={{ display: 'none' }} />

      {/* Fixed home button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <button
          onClick={onHome}
          className="pointer-events-auto flex items-center gap-2 px-6 py-3 bg-ink text-paper rounded-full font-semibold shadow-lg hover:bg-accent transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </button>
      </div>

      {/* FAQ overlay */}
      {showFaq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFaq(false)}>
          <div className="bg-paper w-full rounded-t-3xl px-6 pt-6 pb-10 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ink">{T.faqHeading}</h2>
              <button onClick={() => setShowFaq(false)} className="text-ink/40 hover:text-ink text-2xl leading-none">✕</button>
            </div>
            <div className="space-y-4">
              {T.faqItems.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted">
                  <p className="font-semibold text-ink mb-1">{item.q}</p>
                  <p className="text-ink/70 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
