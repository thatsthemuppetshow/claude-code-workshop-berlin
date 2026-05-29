'use client';
import { useState, useEffect } from 'react';
import LanguageSelect from '../components/LanguageSelect';
import UploadView from '../components/UploadView';
import GalleryView, { Photo } from '../components/GalleryView';
import { Lang } from '../lib/translations';

type View = 'lang' | 'upload' | 'gallery';

export default function Home() {
  const [view, setView] = useState<View>('lang');
  const [lang, setLang] = useState<Lang>('en');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load saved photos on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('qr-album-photos');
      if (saved) setPhotos(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist photos whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('qr-album-photos', JSON.stringify(photos));
    } catch {}
  }, [photos]);

  function chooseLang(l: Lang) {
    setLang(l);
    setView('upload');
  }

  function addPhotos(srcs: string[]) {
    const newPhotos = srcs.map((src, i) => ({ id: `${Date.now()}-${i}`, src, liked: false, likes: 0 }));
    setPhotos(prev => [...newPhotos, ...prev]);
  }

  function toggleLike(id: string) {
    setPhotos(prev =>
      prev.map(p =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  }

  function deletePhoto(id: string) {
    setPhotos(prev => prev.filter(p => p.id !== id));
  }

  if (view === 'lang') return <LanguageSelect onSelect={chooseLang} />;

  if (view === 'upload') return (
    <UploadView
      lang={lang}
      onUpload={addPhotos}
      onGallery={() => setView('gallery')}
      onHome={() => setView('upload')}
      photoCount={photos.length}
      recentPhotos={photos.slice(0, 4).map(p => p.src)}
    />
  );

  return (
    <GalleryView
      lang={lang}
      photos={photos}
      onLike={toggleLike}
      onUpload={() => setView('upload')}
      onHome={() => setView('upload')}
      isAdmin={isAdmin}
      onToggleAdmin={() => setIsAdmin(a => !a)}
      onDelete={deletePhoto}
    />
  );
}
