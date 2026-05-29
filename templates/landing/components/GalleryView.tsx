'use client';
import { useState } from 'react';
import { Lang, t } from '../lib/translations';

export interface Photo {
  id: string;
  src: string;
  liked: boolean;
  likes: number;
}

interface Props {
  lang: Lang;
  photos: Photo[];
  onLike: (id: string) => void;
  onUpload: () => void;
}

function download(src: string, id: string) {
  const a = document.createElement('a');
  a.href = src;
  a.download = `photo-${id}.jpg`;
  a.click();
}

export default function GalleryView({ lang, photos, onLike, onUpload }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = photos.find(p => p.id === selectedId) ?? null;
  const T = t[lang];

  return (
    <div className="min-h-screen bg-paper flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <span className="text-xl font-bold text-ink">{T.album}</span>
        <button onClick={onUpload} className="px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold">
          {T.uploadCta}
        </button>
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
                <button
                  key={photo.id}
                  onClick={() => setSelectedId(photo.id)}
                  className="relative overflow-hidden aspect-square bg-muted rounded-lg focus:outline-none"
                >
                  <img
                    src={photo.src}
                    alt="Shared photo"
                    loading="lazy"
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                  {photo.likes > 0 && (
                    <span className="absolute bottom-1 left-1 flex items-center gap-0.5 text-white text-xs font-bold drop-shadow">
                      <svg className="w-3 h-3 fill-accent" viewBox="0 0 24 24">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {photo.likes}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
          onClick={() => setSelectedId(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelectedId(null)}
            className="absolute top-5 right-5 text-white text-3xl leading-none"
          >
            ✕
          </button>

          {/* Photo */}
          <img
            src={selected.src}
            alt="Full size"
            className="max-w-full max-h-[75vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Actions */}
          <div
            className="flex items-center gap-6 mt-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => onLike(selected.id)}
              className="flex items-center gap-2 text-white font-semibold text-lg"
            >
              <svg
                className={`w-7 h-7 transition-colors ${selected.liked ? 'fill-accent stroke-accent' : 'fill-none stroke-white'}`}
                strokeWidth={2}
                viewBox="0 0 24 24"
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
