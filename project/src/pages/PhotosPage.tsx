import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { photos } from '../data/photos';

export default function PhotosPage() {
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);

  const openFullscreen = (idx: number) => setFullscreenIdx(idx);
  const closeFullscreen = useCallback(() => setFullscreenIdx(null), []);

  const next = useCallback(() => {
    setFullscreenIdx((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, []);
  const prev = useCallback(() => {
    setFullscreenIdx((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length,
    );
  }, []);

  // Keyboard nav
  useEffect(() => {
    if (fullscreenIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === 'ArrowLeft') next();
      if (e.key === 'ArrowRight') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreenIdx, closeFullscreen, next, prev]);

  // Lock body scroll when fullscreen open
  useEffect(() => {
    if (fullscreenIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreenIdx]);

  return (
    <div className="px-4 pb-4">
      <div className="pt-20" />
      <h2 className="mb-4 text-2xl text-ivory">صور <span className="text-gold-bright">المطعم</span></h2>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, idx) => (
          <button
            key={photo.id}
            onClick={() => openFullscreen(idx)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-surface"
            aria-label={`فتح صورة: ${photo.caption}`}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12211d]/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <p className="absolute bottom-2 right-2 text-right text-xs text-ivory opacity-0 transition-opacity group-hover:opacity-100">
              {photo.caption}
            </p>
          </button>
        ))}
      </div>

      {/* Fullscreen swipeable viewer */}
      {fullscreenIdx !== null && (
        <FullscreenViewer
          photos={photos}
          index={fullscreenIdx}
          onIndexChange={setFullscreenIdx}
          onClose={closeFullscreen}
          onNext={next}
          onPrev={prev}
        />
      )}
    </div>
  );
}

type FullscreenViewerProps = {
  photos: typeof photos;
  index: number;
  onIndexChange: (idx: number) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

function FullscreenViewer({
  photos,
  index,
  onIndexChange,
  onClose,
  onNext,
  onPrev,
}: FullscreenViewerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const isDragging = useRef(false);
  const [translateX, setTranslateX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - startX.current;
    currentTranslate.current = diff;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const threshold = 80;
    if (currentTranslate.current > threshold) {
      onPrev();
    } else if (currentTranslate.current < -threshold) {
      onNext();
    }
    currentTranslate.current = 0;
    setTranslateX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;
    currentTranslate.current = diff;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 80;
    if (currentTranslate.current > threshold) {
      onPrev();
    } else if (currentTranslate.current < -threshold) {
      onNext();
    }
    currentTranslate.current = 0;
    setTranslateX(0);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
          aria-label="إغلاق"
        >
          <X size={22} className="text-white" />
        </button>
        <span className="text-sm font-semibold text-white/80">
          {index + 1} / {photos.length}
        </span>
        <div className="w-10" />
      </div>

      {/* Swipeable image track */}
      <div
        ref={trackRef}
        className="flex h-full w-full items-center overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.3s ease',
          }}
        >
          <img
            src={photos[index].src}
            alt={photos[index].caption}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black/70 to-transparent" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        <p className="text-center text-base text-white">{photos[index].caption}</p>
      </div>

      {/* Arrow buttons (desktop) */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20 sm:flex"
        aria-label="السابق"
      >
        <ChevronRight size={28} className="text-white" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20 sm:flex"
        aria-label="التالي"
      >
        <ChevronLeft size={28} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-[var(--color-gold-bright)]' : 'w-2 bg-white/40'
            }`}
            aria-label={`صورة ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
