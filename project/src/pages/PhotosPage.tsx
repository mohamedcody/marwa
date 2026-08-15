import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { photos as staticPhotos, PhotoItem } from '../data/photos';

// Constant threshold for swipe gestures (in pixels)
const SWIPE_THRESHOLD = 80;

/**
 * Sub-component for individual Photo Cards to isolate rendering and optimize performance.
 * Wrapped in React.memo to prevent unnecessary re-renders of the grid items.
 */
const PhotoCard = React.memo(({
  photo,
  index,
  onSelect,
}: {
  photo: PhotoItem;
  index: number;
  onSelect: (index: number) => void;
}) => {
  const handleClick = () => onSelect(index);

  return (
    <div
      onClick={handleClick}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-surface"
    >
      <img
        src={photo.src}
        alt={photo.caption || 'صورة من مطعم المروة'}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12211d]/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <p className="absolute bottom-2 right-2 left-2 text-right text-xs text-ivory opacity-0 transition-opacity group-hover:opacity-100 truncate">
        {photo.caption}
      </p>
    </div>
  );
});

PhotoCard.displayName = 'PhotoCard';

/**
 * PhotosPage Component — النسخة الثابتة (Static).
 * بتعرض صور المطعم من ملف data/photos.ts مباشرة — بدون API أو Admin.
 */
export default function PhotosPage() {
  const [photoList] = useState<PhotoItem[]>(staticPhotos);
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);

  const openFullscreen = useCallback((idx: number) => {
    setFullscreenIdx(idx);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenIdx(null);
  }, []);

  const next = useCallback(() => {
    setFullscreenIdx((prevIdx) => (prevIdx === null ? null : (prevIdx + 1) % photoList.length));
  }, [photoList]);

  const prev = useCallback(() => {
    setFullscreenIdx((prevIdx) =>
      prevIdx === null ? null : (prevIdx - 1 + photoList.length) % photoList.length
    );
  }, [photoList]);

  // Keyboard navigation control
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

  // Lock scroll in background when fullscreen viewer is open
  useEffect(() => {
    if (fullscreenIdx !== null) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [fullscreenIdx]);

  return (
    <div className="px-4 pb-4">
      <div className="pt-20" />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl text-ivory">صور <span className="text-gold-bright">المطعم</span></h2>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photoList.map((photo, idx) => (
          <PhotoCard
            key={photo.id || `static-${idx}`}
            photo={photo}
            index={idx}
            onSelect={openFullscreen}
          />
        ))}
      </div>

      {/* Fullscreen Viewer Overlay */}
      {fullscreenIdx !== null && photoList.length > 0 && (
        <FullscreenViewer
          photos={photoList}
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
  photos: PhotoItem[];
  index: number;
  onIndexChange: (idx: number) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

/**
 * FullscreenViewer Overlay Component with unified touch and mouse dragging swipe gestures.
 */
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

  // Unified Gesture Handlers
  const startDrag = useCallback((clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    const diff = clientX - startX.current;
    currentTranslate.current = diff;
    setTranslateX(diff);
  }, []);

  const endDrag = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    if (currentTranslate.current > SWIPE_THRESHOLD) {
      onPrev();
    } else if (currentTranslate.current < -SWIPE_THRESHOLD) {
      onNext();
    }
    
    currentTranslate.current = 0;
    setTranslateX(0);
  }, [onNext, onPrev]);

  // Touch Event bindings
  const handleTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => moveDrag(e.touches[0].clientX);
  const handleTouchEnd = () => endDrag();

  // Mouse Event bindings
  const handleMouseDown = (e: React.MouseEvent) => startDrag(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => moveDrag(e.clientX);
  const handleMouseUp = () => endDrag();

  const currentPhoto = photos[index] || photos[0];

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
          {currentPhoto && (
            <img
              src={currentPhoto.src}
              alt={currentPhoto.caption || 'صورة بملء الشاشة'}
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          )}
        </div>
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black/70 to-transparent" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
        <p className="text-center text-base text-white">{currentPhoto?.caption}</p>
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

      {/* Navigation Indicators / Dots */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.id || `dot-${i}`}
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
