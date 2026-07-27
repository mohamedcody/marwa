import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Play, Share2, Eye, Trash2 } from 'lucide-react';
import { videos as initialVideos } from '../data/videos';
import { fetchVideos, deleteVideoAPI, isAdminLoggedIn, likeVideoAPI, viewVideoAPI, shareVideoAPI } from '../services/api';

/**
 * دالة مساعدة لتحديد نوع الرابط وتوليد رابط التضمين المناسب (Embed URL).
 * تدعم روابط يوتيوب، فيسبوك، تيك توك، والملفات المرفوعة المباشرة (mp4).
 */
function getEmbedInfo(url: string) {
  if (!url) return { type: 'native', url: '' };

  // 1. YouTube & YouTube Shorts
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
  if (ytMatch || ytShortsMatch) {
    const id = ytMatch ? ytMatch[1] : ytShortsMatch![1];
    return {
      type: 'youtube',
      url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1`
    };
  }

  // 2. Facebook Videos & Reels
  if (url.includes('facebook.com') || url.includes('fb.watch') || url.includes('fb.gg') || url.includes('fb.me')) {
    return {
      type: 'facebook',
      url: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=true&mute=true`
    };
  }

  // 3. TikTok Videos
  const ttMatch = url.match(/tiktok\.com\/@?[^\/]+\/video\/(\d+)/i);
  if (ttMatch) {
    return {
      type: 'tiktok',
      url: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`
    };
  }

  // 4. Native Video Files (MP4, etc.)
  return { type: 'native', url };
}

export default function VideosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  
  // قائمة الفيديوهات (تدمج الفيديوهات المحلية مع الفيديوهات المرفوعة ديناميكياً من قاعدة البيانات)
  const [videoList, setVideoList] = useState<any[]>(() => {
    return initialVideos.map(v => ({
      id: String(v.id),
      author: v.author,
      caption: v.caption,
      videoUrl: v.src,
      poster: v.poster,
      likes: v.likes || 0,
      views: v.views || 0
    }));
  });

  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());

  // Track user's personal likes
  const [userLikes, setUserLikes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('marwa_user_likes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Track dynamic counts of views, likes, and shares from backend database
  const [likesCounts, setLikesCounts] = useState<Record<string, number>>({});
  const [viewsCounts, setViewsCounts] = useState<Record<string, number>>({});
  const [sharesCounts, setSharesCounts] = useState<Record<string, number>>({});

  const [pausedStates, setPausedStates] = useState<Record<number, boolean>>({});

  /**
   * جلب الفيديوهات من الباك إند ودمجها
   */
  const loadVideos = async () => {
    const apiVideos = await fetchVideos();
    const formattedStatic = initialVideos.map(v => ({
      id: String(v.id),
      author: v.author,
      caption: v.caption,
      videoUrl: v.src,
      poster: v.poster,
      likes: v.likes || 0,
      views: v.views || 0,
      shares: 0
    }));

    let merged = [];
    if (apiVideos && apiVideos.length > 0) {
      const formattedApi = apiVideos.map((v: any) => ({
        id: String(v.id),
        author: 'مسؤول المطعم',
        caption: v.description || v.title,
        videoUrl: v.videoUrl,
        poster: '',
        likes: v.likes || 0,
        views: v.views || 0,
        shares: v.shares || 0
      }));
      // الفيديوهات المرفوعة مؤخراً تظهر أولاً
      merged = [...formattedApi, ...formattedStatic];
    } else {
      merged = formattedStatic;
    }
    
    setVideoList(merged);

    // تهيئة العدادات الحقيقية من قاعدة البيانات
    const initialLikes: Record<string, number> = {};
    const initialViews: Record<string, number> = {};
    const initialShares: Record<string, number> = {};
    
    merged.forEach(v => {
      initialLikes[v.id] = v.likes || 0;
      initialViews[v.id] = v.views || 0;
      initialShares[v.id] = v.shares || 0;
    });

    setLikesCounts(initialLikes);
    setViewsCounts(initialViews);
    setSharesCounts(initialShares);
  };

  useEffect(() => {
    loadVideos();

    const checkAuth = () => setIsAdmin(isAdminLoggedIn());
    window.addEventListener('auth_change', checkAuth);
    return () => window.removeEventListener('auth_change', checkAuth);
  }, []);

  // 1. Play only active video, pause others, and increment VIEW count on play
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });

    const currentVideo = videoList[activeIdx];
    if (currentVideo) {
      const videoId = currentVideo.id;
      const sessionViewKey = `viewed_${videoId}`;
      if (!sessionStorage.getItem(sessionViewKey)) {
        sessionStorage.setItem(sessionViewKey, 'true');
        setViewsCounts((prev) => {
          const next = { ...prev, [videoId]: (prev[videoId] || 0) + 1 };
          return next;
        });
        viewVideoAPI(videoId);
      }
    }
  }, [activeIdx, videoList]);

  // 2. Intersection observer to detect active video on scroll
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
  }, [videoList]);

  // 3. Toggle Like Function
  const toggleLike = useCallback((id: string) => {
    setUserLikes((prevLikes) => {
      const nextLikes = new Set(prevLikes);
      const isLiked = nextLikes.has(id);
      
      if (isLiked) {
        nextLikes.delete(id);
      } else {
        nextLikes.add(id);
      }
      
      localStorage.setItem('marwa_user_likes', JSON.stringify(Array.from(nextLikes)));

      // Update total counts
      setLikesCounts((prevCounts) => {
        const nextCounts = {
          ...prevCounts,
          [id]: Math.max(0, (prevCounts[id] || 0) + (isLiked ? -1 : 1)),
        };
        return nextCounts;
      });

      likeVideoAPI(id, isLiked ? -1 : 1);

      return nextLikes;
    });
  }, []);

  const togglePlay = (idx: number) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const handleDeleteVideo = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الفيديو؟')) return;
    const ok = await deleteVideoAPI(id);
    if (ok) {
      setVideoList((prev) => prev.filter((v) => v.id !== id));
    } else {
      setVideoList((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-[100svh] w-full overflow-y-auto snap-y-mandatory no-scrollbar"
    >
      {videoList.map((video, idx) => {
        const embed = getEmbedInfo(video.videoUrl);
        return (
          <div
            key={video.id}
            data-index={idx}
            className="relative h-[100svh] w-full snap-start overflow-hidden bg-black"
          >
            {embed.type === 'native' ? (
              <>
                <video
                  ref={(el) => { videoRefs.current[idx] = el; }}
                  src={embed.url}
                  poster={video.poster}
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                  onPlay={() => setPausedStates(prev => ({ ...prev, [idx]: false }))}
                  onPause={() => setPausedStates(prev => ({ ...prev, [idx]: true }))}
                />

                {/* Click Overlay */}
                <div
                  className="absolute inset-0 z-10"
                  onClick={() => togglePlay(idx)}
                />
              </>
            ) : (
              activeIdx === idx ? (
                <iframe
                  src={embed.url}
                  className="h-full w-full border-0"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  scrolling="no"
                />
              ) : (
                <div className="h-full w-full relative flex items-center justify-center bg-black">
                  {video.poster ? (
                    <img src={video.poster} alt="" className="h-full w-full object-cover opacity-50" />
                  ) : (
                    <div className="h-full w-full bg-[#12211d] flex items-center justify-center p-6 text-center">
                      <p className="text-gold-bright text-lg font-bold">{video.caption}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={64} className="fill-white/80 text-white/80" />
                  </div>
                </div>
              )
            )}

            {/* Play Icon Overlay */}
            {pausedStates[idx] && embed.type === 'native' && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity">
                <Play size={64} className="fill-white/80 text-white/80" />
              </div>
            )}

            {/* Delete button for admin */}
            {isAdmin && (
              <button
                onClick={(e) => handleDeleteVideo(e, video.id)}
                className="absolute top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg transition hover:bg-red-700"
                title="حذف الفيديو"
              >
                <Trash2 size={18} />
              </button>
            )}

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Action buttons (Likes, Views, Share) */}
            <div className="absolute bottom-24 left-4 z-30 flex flex-col items-center gap-5">
              {/* Likes */}
              <button
                onClick={() => toggleLike(video.id)}
                className="flex flex-col items-center gap-1"
                aria-label="إعجاب"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-transform active:scale-90 border border-white/10">
                  <Heart
                    size={26}
                    className={userLikes.has(video.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                  />
                </span>
                <span className="text-xs font-bold text-white shadow-sm">
                  {likesCounts[video.id] || 0}
                </span>
              </button>

              {/* Views counter */}
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  <Eye size={24} className="text-gold-bright" />
                </span>
                <span className="text-xs font-bold text-white shadow-sm">
                  {viewsCounts[video.id] || 0}
                </span>
              </div>

              {/* Share */}
              <button
                className="flex flex-col items-center gap-1"
                aria-label="مشاركة"
                onClick={() => {
                  const videoId = video.id;
                  setSharesCounts((prev) => {
                    const next = { ...prev, [videoId] : (prev[videoId] || 0) + 1 };
                    return next;
                  });
                  shareVideoAPI(videoId);

                  if (navigator.share) {
                    navigator.share({ title: video.caption, url: video.videoUrl }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(video.videoUrl);
                    alert('تم نسخ رابط الفيديو إلى الحافظة!');
                  }
                }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-transform active:scale-90 border border-white/10">
                  <Share2 size={24} className="text-white" />
                </span>
                <span className="text-xs font-bold text-white shadow-sm">
                  {sharesCounts[video.id] || 0}
                </span>
              </button>
            </div>

            {/* Caption */}
            <div className="absolute bottom-24 right-4 z-30 max-w-[70%] pr-4 pointer-events-none">
              <p className="mb-1 text-sm font-bold text-gold-bright">{video.author}</p>
              <p className="text-sm text-white/90 drop-shadow-md">{video.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}