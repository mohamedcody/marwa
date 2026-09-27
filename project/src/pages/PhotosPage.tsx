import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { photos as staticPhotos, PhotoItem } from '../data/photos';

// Constant threshold for swipe gestures (in pixels)
const SWIPE_THRESHOLD = 80;

/**
 * Auto-scrolling horizontal photo carousel with drag/swipe support.
 * The photos scroll slowly and infinitely; the user can also drag left/right.
 */
export default function PhotosPage() {
  const [photoList] = useState<PhotoItem[]>(staticPhotos);
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const scrollSpeed = useRef(0.5); // pixels per frame — nice and slow
  const isUserDragging = useRef(false);
  const isPaused = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  // ───── Auto-scroll loop ─────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // نكرر الصور 3 مرات عشان نعمل تأثير لا نهائي
    const tick = () => {
      if (!isUserDragging.current && !isPaused.current && el) {
        el.scrollLeft += scrollSpeed.current;

        // لما نوصل لنهاية الكلون الأوسط → نرجع ببلاش لبداية الكلون الأوسط
        const singleSetWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        }
        if (el.scrollLeft <= 0) {
          el.scrollLeft += singleSetWidth;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };

    // Initialize scroll position at the middle clone
    el.scrollLeft = el.scrollWidth / 3;
    animRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animRef.current);
  }, [photoList]);

  // ───── Drag / Swipe handlers ─────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isUserDragging.current = true;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isUserDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartX.current;
    el.scrollLeft = dragScrollLeft.current - dx;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isUserDragging.current = false;
    const el = scrollRef.current;
    if (el) {
      el.style.cursor = 'grab';
      el.releasePointerCapture(e.pointerId);
    }
  }, []);

  // ───── Pause on hover (desktop) ─────
  const handleMouseEnter = useCallback(() => {
    isPaused.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    isPaused.current = false;
  }, []);

  // ───── Open photo in fullscreen ─────
  const openFullscreen = useCallback((idx: number) => {
    setFullscreenIdx(idx);
  }, []);
  const closeFullscreen = useCallback(() => {
    setFullscreenIdx(null);
  }, []);

  const next = useCallback(() => {
    setFullscreenIdx((p) => (p === null ? null : (p + 1) % photoList.length));
  }, [photoList]);
  const prev = useCallback(() => {
    setFullscreenIdx((p) => (p === null ? null : (p - 1 + photoList.length) % photoList.length));
  }, [photoList]);

  // Keyboard nav in fullscreen
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

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (fullscreenIdx !== null) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [fullscreenIdx]);

  // نكرر الصور 3 مرات عشان الحركة اللانهائية تكون سلسة
  const tripled = [...photoList, ...photoList, ...photoList];

  return (
    <div className="pb-28">
      <div className="pt-20" />

      {/* ── العنوان ── */}
      <div className="px-4 mb-6">
        <h2 className="text-2xl text-ivory font-display">
          صور <span className="text-gold-bright">المطعم</span>
        </h2>
        <p className="mt-1 text-sm text-muted">اسحب يمين أو شمال لاستعراض الصور</p>
      </div>

      {/* ══════════ HORIZONTAL AUTO-SCROLL CAROUSEL ══════════ */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="no-scrollbar flex gap-4 overflow-x-auto px-4 select-none"
        style={{ cursor: 'grab', scrollbarWidth: 'none', touchAction: 'pan-y' }}
      >
        {tripled.map((photo, i) => {
          // الـ real index في القائمة الأصلية
          const realIdx = i % photoList.length;
          return (
            <div
              key={`carousel-${i}`}
              onClick={() => openFullscreen(realIdx)}
              className="group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#2c4136]/60"
              style={{ width: 260, height: 340 }}
            >
              <img
                src={photo.src}
                alt={photo.caption || 'صورة من مطعم المروة'}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12211d]/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-sm text-white/90 font-semibold truncate">{photo.caption}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════ GRID SECTION (اختياري — الصور كلها كـ Grid تحت) ══════════ */}
      <div className="px-4 mt-10">
        <h3 className="text-xl text-ivory font-display mb-4">
          كل الصور
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photoList.map((photo, idx) => (
            <div
              key={photo.id || `grid-${idx}`}
              onClick={() => openFullscreen(idx)}
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
          ))}
        </div>
      </div>

      {/* ── Fullscreen Viewer ── */}
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

/* ═══════════════════════════════════════════════════════════
   Fullscreen Viewer (preserved from original)
   ═══════════════════════════════════════════════════════════ */

type FullscreenViewerProps = {
  photos: PhotoItem[];
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

  const handleTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => moveDrag(e.touches[0].clientX);
  const handleTouchEnd = () => endDrag();
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

      {/* Dots */}
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
