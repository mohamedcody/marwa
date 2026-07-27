import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { photos as initialPhotos } from '../data/photos';
import { fetchPhotos, deletePhotoAPI, isAdminLoggedIn, PhotoData } from '../services/api';

/**
 * مكون صفحة معرض الصور (PhotosPage Component).
 * يعرض جميع صور المطعم في شبكة تفاعلية، مع دعم العرض بملء الشاشة والتقليب بالسحب أو مفاتيح الأسهم، وإمكانية حذف الصور للأدمن.
 */
export default function PhotosPage() {
  // قائمة الصور (تجلب ديناميكياً من الباك إند أو تستخدم القائمة المحلية الافتراضية)
  const [photoList, setPhotoList] = useState<PhotoData[]>(initialPhotos);
  // مؤشر الصورة المفتوحة بملء الشاشة (null إذا كانت مغلقة)
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  // حالة التحقق من صلاحيات الأدمن (محدثة تلقائياً)
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());

  useEffect(() => {
    const checkAuth = () => setIsAdmin(isAdminLoggedIn());
    window.addEventListener('auth_change', checkAuth);
    return () => window.removeEventListener('auth_change', checkAuth);
  }, []);


  /**
   * جلب الصور من الباك إند عند تحميل الصفحة
   */
  const loadPhotos = async () => {
    const apiPhotos = await fetchPhotos('general');
    if (apiPhotos && apiPhotos.length > 0) {
      // عرض الصور العامة للأكلات فقط أو التي لا تمتلك تصنيفاً
      const generalPhotos = apiPhotos.filter(p => !p.category || p.category === 'general');
      setPhotoList(generalPhotos);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  /**
   * حذف صورة محددة من المعرض (خاص بالأدمن فقط)
   */
  const handleDeletePhoto = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذه الصورة؟')) return;
    const ok = await deletePhotoAPI(id);
    if (ok) {
      setPhotoList((prev) => prev.filter((p) => p.id !== id));
    } else {
      // حذف محلي احتياطي في حال توقف الباك إند
      setPhotoList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // فتح وإغلاق الصورة بملء الشاشة
  const openFullscreen = (idx: number) => setFullscreenIdx(idx);
  const closeFullscreen = useCallback(() => setFullscreenIdx(null), []);

  // التنقل للصورة التالية أو السابقة
  const next = useCallback(() => {
    setFullscreenIdx((prev) => (prev === null ? null : (prev + 1) % photoList.length));
  }, [photoList.length]);

  const prev = useCallback(() => {
    setFullscreenIdx((prev) =>
      prev === null ? null : (prev - 1 + photoList.length) % photoList.length,
    );
  }, [photoList.length]);


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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl text-ivory">صور <span className="text-gold-bright">المطعم</span></h2>
        {isAdmin && <span className="text-xs text-gold-bright bg-surface px-2.5 py-1 rounded-full border border-gold-bright/30">أدمن: يمكنك الحذف</span>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photoList.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => openFullscreen(idx)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-surface"
          >
            <img
              src={photo.src}
              alt={photo.caption}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12211d]/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            
            <p className="absolute bottom-2 right-2 left-2 text-right text-xs text-ivory opacity-0 transition-opacity group-hover:opacity-100 truncate">
              {photo.caption}
            </p>

            {isAdmin && (
              <button
                onClick={(e) => handleDeletePhoto(e, photo.id)}
                className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition hover:bg-red-700 z-10"
                title="حذف الصورة"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen swipeable viewer */}
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
  photos: PhotoData[];
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
              alt={currentPhoto.caption}
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
