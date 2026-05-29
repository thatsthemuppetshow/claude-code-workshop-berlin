'use client';
import { useState, useEffect, useCallback } from 'react';
import { Lang, t } from '../lib/translations';

const ADMIN_EMAIL = 'damciogluece@gmail.com';
const ADMIN_PASSWORD = 'RobertEceLatte';

export interface Photo {
  id: string;
  src: string;
  liked: boolean;
  likes: number;
}

interface Props {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  photos: Photo[];
  onLike: (id: string) => void;
  onUpload: () => void;
  onHome: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onDelete: (id: string) => void;
}

function download(src: string, id: string) {
  const a = document.createElement('a');
  a.href = src;
  a.download = `photo-${id}.jpg`;
  a.click();
}

export default function GalleryView({ lang, onLangChange, photos, onLike, onUpload, onHome, isAdmin, onToggleAdmin, onDelete }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const T = t[lang];

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
      onToggleAdmin();
    } else {
      setLoginError('Incorrect email or password.');
    }
  }

  function openLogin() {
    setLoginError('');
    setLoginEmail('');
    setLoginPassword('');
    setShowLogin(true);
  }

  const selectedIndex = photos.findIndex(p => p.id === selectedId);
  const selected = selectedIndex >= 0 ? photos[selectedIndex] : null;

  const goPrev = useCallback(() => {
    if (selectedIndex > 0) setSelectedId(photos[selectedIndex - 1].id);
  }, [selectedIndex, photos]);

  const goNext = useCallback(() => {
    if (selectedIndex < photos.length - 1) setSelectedId(photos[selectedIndex + 1].id);
  }, [selectedIndex, photos]);

  // Keyboard navigation
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') setSelectedId(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, goPrev, goNext]);

  function handleDelete(id: string) {
    onDelete(id);
    if (selectedId === id) setSelectedId(null);
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-ink">{T.album}</span>
          {isAdmin && (
            <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">Admin</span>
          )}
          <div className="flex items-center gap-1 ml-1">
            {(['en', 'de', 'tr'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider transition ${lang === l ? 'text-accent' : 'text-ink/30 hover:text-ink/60'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <button
              onClick={onToggleAdmin}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white border border-red-500"
            >
              Exit Admin
            </button>
          ) : (
            <button
              onClick={openLogin}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-ink/20 text-ink/50 hover:border-ink/40 transition"
            >
              Admin
            </button>
          )}
          <button onClick={onUpload} className="px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold">
            {T.uploadCta}
          </button>
        </div>
      </header>

      {/* Grid */}
      <main className="flex-1 py-4">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-6">
            <p className="text-ink/40 text-lg mb-4">{T.noPhotos}</p>
            <button onClick={onUpload} className="px-6 py-3 bg-accent text-white rounded-full font-semibold">
              {T.uploadFirst}
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink/50 mb-3 px-4">{T.shared(photos.length)}</p>
            <div className="grid grid-cols-4 gap-1 px-2">
              {photos.map(photo => (
                <div
                  key={photo.id}
                  className="relative overflow-hidden aspect-square bg-muted rounded-lg"
                >
                  <button
                    onClick={() => !isAdmin && setSelectedId(photo.id)}
                    className="w-full h-full focus:outline-none"
                  >
                    <img
                      src={photo.src}
                      alt="Shared photo"
                      loading="lazy"
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                    {photo.likes > 0 && !isAdmin && (
                      <span className="absolute bottom-1 left-1 flex items-center gap-0.5 text-white text-xs font-bold drop-shadow">
                        <svg className="w-3 h-3 fill-accent" viewBox="0 0 24 24">
                          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        {photo.likes}
                      </span>
                    )}
                  </button>

                  {/* Admin delete button */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-red-600/80 transition"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Fixed home button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <button
          onClick={onHome}
          className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-ink text-paper rounded-full shadow-lg hover:bg-accent transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </button>
      </div>

      {/* Admin login modal */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="bg-paper w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-ink mb-1">Admin login</h2>
            <p className="text-sm text-ink/50 mb-6">Enter your credentials to manage the album.</p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border-2 border-ink/15 focus:border-accent focus:outline-none text-ink bg-paper transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-ink/15 focus:border-accent focus:outline-none text-ink bg-paper transition"
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-sm font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-ink text-paper rounded-full font-semibold text-lg hover:bg-accent transition mt-2"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="w-full py-3 border border-ink/20 rounded-full font-semibold text-ink"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
          onClick={() => setSelectedId(null)}
        >
          {/* Top bar */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
            <button
              onClick={(e) => { e.stopPropagation(); onHome(); }}
              className="px-4 py-1.5 bg-white/20 text-white rounded-full text-sm font-semibold"
            >
              Home
            </button>
            <span className="text-white/50 text-sm font-medium">
              {selectedIndex + 1} / {photos.length}
            </span>
            <button onClick={() => setSelectedId(null)} className="text-white text-3xl leading-none">✕</button>
          </div>

          {/* Prev arrow */}
          {selectedIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 rounded-full text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Photo */}
          <img
            key={selected.id}
            src={selected.src}
            alt="Full size"
            className="max-w-full max-h-[72vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next arrow */}
          {selectedIndex < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/30 rounded-full text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 mt-6" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onLike(selected.id)}
              className="flex items-center gap-2 text-white font-semibold text-lg"
            >
              <svg
                className={`w-7 h-7 transition-colors ${selected.liked ? 'fill-accent stroke-accent' : 'fill-none stroke-white'}`}
                strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {selected.likes > 0 && <span>{selected.likes}</span>}
            </button>

            <button
              onClick={() => download(selected.src, selected.id)}
              className="flex items-center gap-2 text-white font-semibold text-lg"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {T.save}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
