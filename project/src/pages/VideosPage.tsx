import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Play, Share2, Eye } from 'lucide-react';
import { videos as staticVideos } from '../data/videos';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
interface VideoItem {
  id: string;
  author: string;
  caption: string;
  videoUrl: string;
  poster: string;
  likes: number;
  views: number;
  shares: number;
}

// ─────────────────────────────────────────
// Helper: parse URL → embed info
// ─────────────────────────────────────────
function getEmbedInfo(url: string) {
  if (!url) return { type: 'native', url: '' };

  const ytMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
  const ytShorts = url.match(/youtube\.com\/shorts\/([^"&?/\s]{11})/i);
  if (ytMatch || ytShorts) {
    const id = ytMatch ? ytMatch[1] : ytShorts![1];
    return { type: 'youtube', url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&playsinline=1` };
  }
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return { type: 'facebook', url: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=true&mute=true` };
  }
  const ttMatch = url.match(/tiktok\.com\/@?[^/]+\/video\/(\d+)/i);
  if (ttMatch) return { type: 'tiktok', url: `https://www.tiktok.com/embed/v2/${ttMatch[1]}` };

  return { type: 'native', url };
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function VideosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [videoList] = useState<VideoItem[]>(() =>
    staticVideos.map(v => ({
      id: String(v.id), author: v.author, caption: v.caption,
      videoUrl: v.src, poster: v.poster,
      likes: v.likes || 0, views: v.views || 0, shares: 0,
    }))
  );

  const [userLikes, setUserLikes] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('marwa_user_likes') || '[]')); }
    catch { return new Set(); }
  });
  const [likesCounts, setLikesCounts]   = useState<Record<string, number>>(() => {
    const lk: Record<string, number> = {};
    staticVideos.forEach(v => { lk[String(v.id)] = v.likes || 0; });
    return lk;
  });
  const [viewsCounts, setViewsCounts]   = useState<Record<string, number>>(() => {
    const vw: Record<string, number> = {};
    staticVideos.forEach(v => { vw[String(v.id)] = v.views || 0; });
    return vw;
  });
  const [sharesCounts, setSharesCounts] = useState<Record<string, number>>({});
  const [pausedStates, setPausedStates] = useState<Record<number, boolean>>({});

  // ── play/pause on active change ──
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) v.play().catch(() => {});
      else v.pause();
    });

    const cur = videoList[activeIdx];
    if (!cur) return;
    const key = `viewed_${cur.id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      setViewsCounts(p => ({ ...p, [cur.id]: (p[cur.id] || 0) + 1 }));
    }
  }, [activeIdx, videoList]);

  // ── IntersectionObserver ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveIdx(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { root: container, threshold: [0.6] }
    );
    container.querySelectorAll('[data-index]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [videoList]);

  // ── like (local only) ──
  const toggleLike = useCallback((id: string) => {
    setUserLikes(prev => {
      const next = new Set(prev);
      const liked = next.has(id);
      liked ? next.delete(id) : next.add(id);
      localStorage.setItem('marwa_user_likes', JSON.stringify([...next]));
      setLikesCounts(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + (liked ? -1 : 1)) }));
      return next;
    });
  }, []);

  // ── toggle native video play/pause ──
  const togglePlay = useCallback((idx: number) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }, []);

  // ── share (local only) ──
  const handleShare = useCallback((video: VideoItem) => {
    const shareUrl = window.location.href;
    setSharesCounts(p => ({ ...p, [video.id]: (p[video.id] || 0) + 1 }));
    if (navigator.share) {
      navigator.share({ title: video.caption, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('تم نسخ رابط الصفحة!');
    }
  }, []);

  // Empty state when no videos
  if (videoList.length === 0) {
    return (
      <div className="h-[100svh] w-full flex flex-col items-center justify-center bg-[#12211d] text-center px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1C2E24] border border-[#2C4136] mb-6">
          <Play size={36} className="text-[#C9A227]" />
        </div>
        <h2 className="text-xl font-bold text-[#F3E9D2] mb-2">لا توجد فيديوهات حالياً</h2>
        <p className="text-sm text-[#A9A08C] max-w-xs">
          أضف فيديوهات في ملف <code className="text-[#C9A227] bg-[#1C2E24] px-1.5 py-0.5 rounded text-xs">data/videos.ts</code>
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-[100svh] w-full overflow-y-auto snap-y snap-mandatory no-scrollbar">
      {videoList.map((video, idx) => {
        const embed = getEmbedInfo(video.videoUrl);
        const isLiked = userLikes.has(video.id);

        return (
          <div
            key={video.id}
            data-index={idx}
            className="relative h-[100svh] w-full snap-start overflow-hidden bg-black"
          >
            {/* ── Video Content ── */}
            {embed.type === 'native' ? (
              <>
                <video
                  ref={el => { videoRefs.current[idx] = el; }}
                  src={embed.url}
                  poster={video.poster || undefined}
                  loop playsInline preload="metadata"
                  className="h-full w-full object-cover"
                  onPlay={()  => setPausedStates(p => ({ ...p, [idx]: false }))}
                  onPause={() => setPausedStates(p => ({ ...p, [idx]: true  }))}
                />
                <div className="absolute inset-0 z-10" onClick={() => togglePlay(idx)} />
              </>
            ) : activeIdx === idx ? (
              <iframe
                src={embed.url}
                className="h-full w-full border-0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-black">
                {video.poster
                  ? <img src={video.poster} alt="" className="h-full w-full object-cover opacity-50" />
                  : <div className="h-full w-full bg-[#12211d] flex items-center justify-center"><p className="text-[#C9A227] text-lg font-bold px-6 text-center">{video.caption}</p></div>
                }
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play size={64} className="fill-white/80 text-white/80" />
                </div>
              </div>
            )}

            {/* Paused overlay for native */}
            {pausedStates[idx] && embed.type === 'native' && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <Play size={64} className="fill-white/80 text-white/80" />
              </div>
            )}

            {/* Gradient */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

            {/* Action Sidebar */}
            <div className="absolute bottom-28 left-4 z-30 flex flex-col items-center gap-5">
              {/* Like */}
              <button onClick={() => toggleLike(video.id)} className="flex flex-col items-center gap-1" aria-label="إعجاب">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md border transition-all active:scale-90 ${isLiked ? 'bg-red-500/30 border-red-500/50' : 'bg-black/40 border-white/10'}`}>
                  <Heart size={26} className={isLiked ? 'fill-red-500 text-red-500' : 'text-white'} />
                </span>
                <span className="text-xs font-bold text-white drop-shadow">{likesCounts[video.id] ?? 0}</span>
              </button>

              {/* Views */}
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  <Eye size={24} className="text-[#C9A227]" />
                </span>
                <span className="text-xs font-bold text-white drop-shadow">{viewsCounts[video.id] ?? 0}</span>
              </div>

              {/* Share */}
              <button onClick={() => handleShare(video)} className="flex flex-col items-center gap-1" aria-label="مشاركة">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition active:scale-90">
                  <Share2 size={24} className="text-white" />
                </span>
                <span className="text-xs font-bold text-white drop-shadow">{sharesCounts[video.id] ?? 0}</span>
              </button>
            </div>

            {/* Caption */}
            <div className="absolute bottom-28 right-4 z-30 max-w-[62%] text-right pointer-events-none">
              <p className="mb-1 text-sm font-bold text-[#C9A227] drop-shadow">{video.author}</p>
              <p className="text-sm text-white/90 drop-shadow-md leading-snug">{video.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}