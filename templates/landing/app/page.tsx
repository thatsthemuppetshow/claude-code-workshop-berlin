'use client';
import { useState } from 'react';
import LanguageSelect from '../components/LanguageSelect';
import UploadView from '../components/UploadView';
import GalleryView, { Photo } from '../components/GalleryView';
import { Lang } from '../lib/translations';

type View = 'lang' | 'upload' | 'gallery';

export default function Home() {
  const [view, setView] = useState<View>('lang');
  const [lang, setLang] = useState<Lang>('en');
  const [photos, setPhotos] = useState<Photo[]>([]);

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

  if (view === 'lang') return <LanguageSelect onSelect={chooseLang} />;

  if (view === 'upload') return (
    <UploadView
      lang={lang}
      onUpload={addPhotos}
      onGallery={() => setView('gallery')}
      onHome={() => setView('lang')}
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
    />
  );
}
