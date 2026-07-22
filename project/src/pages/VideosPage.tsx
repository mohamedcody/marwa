import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Play, Share2 } from 'lucide-react';
import { videos } from '../data/videos';

export default function VideosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  // Play only the active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIdx]);

  // Intersection observer to detect active video on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIdx(idx);
          }
        });
      },
      { root: containerRef.current, threshold: [0.6] },
    );
    const items = containerRef.current?.querySelectorAll('[data-index]');
    items?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[100svh] w-full overflow-y-auto snap-y-mandatory no-scrollbar"
    >
      {videos.map((video, idx) => (
        <div
          key={video.id}
          data-index={idx}
          className="relative h-[100svh] w-full snap-start overflow-hidden bg-black"
        >
          <video
            ref={(el) => { videoRefs.current[idx] = el; }}
            src={video.src}
            poster={video.poster}
            loop
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            onClick={(e) => {
              const v = e.currentTarget;
              if (v.paused) v.play().catch(() => {});
              else v.pause();
            }}
          />

          {/* Play overlay when paused */}
          <PlayIndicator videoRef={() => videoRefs.current[idx]} />

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Right action bar */}
          <div className="absolute bottom-24 left-4 flex flex-col items-center gap-5">
            <button
              onClick={() => toggleLike(video.id)}
              className="flex flex-col items-center gap-1"
              aria-label="إعجاب"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-transform active:scale-90">
                <Heart
                  size={26}
                  className={liked.has(video.id) ? 'fill-[var(--color-maroon-light)] text-[var(--color-maroon-light)]' : 'text-white'}
                />
              </span>
              <span className="text-xs text-white">{liked.has(video.id) ? '1' : '0'}</span>
            </button>
            <button
              className="flex flex-col items-center gap-1"
              aria-label="مشاركة"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: video.caption, url: video.src }).catch(() => {});
                }
              }}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-transform active:scale-90">
                <Share2 size={24} className="text-white" />
              </span>
              <span className="text-xs text-white">مشاركة</span>
            </button>
          </div>

          {/* Caption */}
          <div className="absolute bottom-24 right-4 max-w-[70%] pr-4">
            <p className="mb-1 text-sm font-bold text-white">{video.author}</p>
            <p className="text-sm text-white/90">{video.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlayIndicator({ videoRef }: { videoRef: () => HTMLVideoElement | null }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const v = videoRef();
    if (!v) return;
    const onPlay = () => setShow(false);
    const onPause = () => setShow(true);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [videoRef]);

  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <Play size={64} className="fill-white/80 text-white/80" />
    </div>
  );
}
