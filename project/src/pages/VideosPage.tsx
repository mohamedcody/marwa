import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Play, Share2, Eye, Trash2, Plus, Upload, X, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { videos as initialVideos } from '../data/videos';
import {
  fetchVideos, deleteVideoAPI, isAdminLoggedIn,
  likeVideoAPI, viewVideoAPI, shareVideoAPI,
  addVideoAPI, uploadVideoFile,
} from '../services/api';

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
// Upload Modal (phone video picker)
// ─────────────────────────────────────────
function UploadVideoModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<'pick' | 'uploading' | 'details' | 'done' | 'error'>('pick');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on unmount to avoid memory leak
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 100 * 1024 * 1024) { setErrorMsg('حجم الفيديو يتجاوز 100 ميجابايت'); setStep('error'); return; }
    if (!f.type.startsWith('video/')) { setErrorMsg('الملف المختار ليس فيديو صالح'); setStep('error'); return; }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setTitle(f.name.replace(/\.[^.]+$/, ''));
    setStep('uploading');
    startUpload(f);
  };

  const startUpload = async (f: File) => {
    setProgress(0);
    const url = await uploadVideoFile(f, setProgress);
    if (!url) { setErrorMsg('فشل رفع الفيديو، تأكد من الاتصال بالإنترنت وأن الخادم يعمل'); setStep('error'); return; }
    setUploadedUrl(url);
    setStep('details');
  };

  const handleSave = async () => {
    if (!title.trim()) { alert('أدخل عنوان الفيديو'); return; }
    setSaving(true);
    const result = await addVideoAPI(title.trim(), uploadedUrl, description.trim() || undefined);
    setSaving(false);
    if (!result) { setErrorMsg('تم رفع الفيديو لكن فشل حفظ بياناته، جرب مرة أخرى'); setStep('error'); return; }
    setStep('done');
    setTimeout(() => { onSuccess(); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-t-3xl bg-[#17281F] border-t border-[#2C4136] p-6 pb-10"
        style={{ animation: 'modalUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#2C4136]" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#F3E9D2]">رفع فيديو جديد</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C2E24] text-[#A9A08C] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* STEP: pick */}
        {step === 'pick' && (
          <div className="flex flex-col items-center gap-4">
            <div
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed border-[#C9A227]/40 bg-[#C9A227]/5 py-12 cursor-pointer hover:border-[#C9A227]/70 hover:bg-[#C9A227]/10 transition-all active:scale-[0.98]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/15">
                <Video size={32} className="text-[#C9A227]" />
              </div>
              <p className="text-base font-bold text-[#F3E9D2]">اضغط لاختيار فيديو</p>
              <p className="text-xs text-[#A9A08C]">MP4 · WebM · MOV — حجم أقصى 100MB</p>
            </div>
            <input ref={inputRef} type="file" accept="video/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <p className="text-xs text-[#A9A08C] text-center">
              يمكنك أيضاً التصوير مباشرة من الكاميرا
            </p>
          </div>
        )}

        {/* STEP: uploading */}
        {step === 'uploading' && (
          <div className="flex flex-col items-center gap-6 py-4">
            {previewUrl && (
              <video src={previewUrl} className="w-full max-h-48 rounded-xl object-cover" muted playsInline />
            )}
            <div className="w-full">
              <div className="flex justify-between text-xs text-[#A9A08C] mb-2">
                <span>جاري الرفع...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#1C2E24] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#E4C566] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-[#A9A08C]">{file?.name}</p>
          </div>
        )}

        {/* STEP: details */}
        {step === 'details' && (
          <div className="flex flex-col gap-4">
            {previewUrl && (
              <video src={previewUrl} className="w-full max-h-40 rounded-xl object-cover" muted playsInline controls />
            )}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#A9A08C]">عنوان الفيديو *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="أدخل عنوان الفيديو"
                className="rounded-xl bg-[#1C2E24] border border-[#2C4136] px-4 py-3 text-sm text-[#F3E9D2] outline-none focus:border-[#C9A227]/60 placeholder:text-[#A9A08C]/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#A9A08C]">وصف (اختياري)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="أضف وصفاً للفيديو..."
                rows={2}
                className="rounded-xl bg-[#1C2E24] border border-[#2C4136] px-4 py-3 text-sm text-[#F3E9D2] outline-none focus:border-[#C9A227]/60 placeholder:text-[#A9A08C]/50 transition-colors resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C566] py-3 font-bold text-[#12211D] text-sm disabled:opacity-60 transition-all active:scale-[0.98]"
            >
              {saving ? 'جاري الحفظ...' : 'نشر الفيديو'}
            </button>
          </div>
        )}

        {/* STEP: done */}
        {step === 'done' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle size={56} className="text-green-400" />
            <p className="text-base font-bold text-[#F3E9D2]">تم نشر الفيديو بنجاح!</p>
          </div>
        )}

        {/* STEP: error */}
        {step === 'error' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <AlertCircle size={48} className="text-red-400" />
            <p className="text-sm text-center text-[#F3E9D2]">{errorMsg}</p>
            <button onClick={() => setStep('pick')} className="rounded-xl bg-[#1C2E24] border border-[#2C4136] px-6 py-2 text-sm font-bold text-[#F3E9D2]">
              حاول مرة أخرى
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes modalUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function VideosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMounted = useRef(true);

  const [activeIdx, setActiveIdx] = useState(0);
  const [videoList, setVideoList] = useState<VideoItem[]>(() =>
    initialVideos.map(v => ({
      id: String(v.id), author: v.author, caption: v.caption,
      videoUrl: v.src, poster: v.poster,
      likes: v.likes || 0, views: v.views || 0, shares: 0,
    }))
  );
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());
  const [showUpload, setShowUpload] = useState(false);

  const [userLikes, setUserLikes] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('marwa_user_likes') || '[]')); }
    catch { return new Set(); }
  });
  const [likesCounts, setLikesCounts]   = useState<Record<string, number>>({});
  const [viewsCounts, setViewsCounts]   = useState<Record<string, number>>({});
  const [sharesCounts, setSharesCounts] = useState<Record<string, number>>({});
  const [pausedStates, setPausedStates] = useState<Record<number, boolean>>({});

  // ── load ──
  const loadVideos = useCallback(async () => {
    const apiVideos = await fetchVideos();
    if (!isMounted.current) return;

    const staticList: VideoItem[] = initialVideos.map(v => ({
      id: String(v.id), author: v.author, caption: v.caption,
      videoUrl: v.src, poster: v.poster,
      likes: v.likes || 0, views: v.views || 0, shares: 0,
    }));

    const merged: VideoItem[] = apiVideos.length > 0
      ? [
          ...apiVideos.map(v => ({
            id: String(v.id), author: 'مسؤول المطعم',
            caption: v.description || v.title,
            videoUrl: v.videoUrl, poster: '',
            likes: v.likes || 0, views: v.views || 0, shares: v.shares || 0,
          })),
          ...staticList,
        ]
      : staticList;

    setVideoList(merged);
    const lk: Record<string, number> = {};
    const vw: Record<string, number> = {};
    const sh: Record<string, number> = {};
    merged.forEach(v => { lk[v.id] = v.likes; vw[v.id] = v.views; sh[v.id] = v.shares; });
    setLikesCounts(lk); setViewsCounts(vw); setSharesCounts(sh);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadVideos();
    const checkAuth = () => setIsAdmin(isAdminLoggedIn());
    window.addEventListener('auth_change', checkAuth);
    return () => {
      isMounted.current = false;
      window.removeEventListener('auth_change', checkAuth);
    };
  }, [loadVideos]);

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
      viewVideoAPI(cur.id);
    }
  }, [activeIdx, videoList]);

  // ── IntersectionObserver — recreate only when videoList changes ──
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

  // ── like ──
  const toggleLike = useCallback((id: string) => {
    setUserLikes(prev => {
      const next = new Set(prev);
      const liked = next.has(id);
      liked ? next.delete(id) : next.add(id);
      localStorage.setItem('marwa_user_likes', JSON.stringify([...next]));
      setLikesCounts(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + (liked ? -1 : 1)) }));
      likeVideoAPI(id);
      return next;
    });
  }, []);

  // ── toggle native video play/pause ──
  const togglePlay = useCallback((idx: number) => {
    const v = videoRefs.current[idx];
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }, []);

  // ── delete — only remove from list if API succeeds ──
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
    const ok = await deleteVideoAPI(id);
    if (ok) {
      setVideoList(prev => prev.filter(v => v.id !== id));
    } else {
      alert('فشل حذف الفيديو، حاول مرة أخرى');
    }
  };

  // ── share ──
  const handleShare = useCallback((video: VideoItem) => {
    const shareUrl = window.location.href; // share app URL, not raw file path
    setSharesCounts(p => ({ ...p, [video.id]: (p[video.id] || 0) + 1 }));
    shareVideoAPI(video.id);
    if (navigator.share) {
      navigator.share({ title: video.caption, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('تم نسخ رابط الصفحة!');
    }
  }, []);

  return (
    <>
      {/* Upload Modal */}
      {showUpload && (
        <UploadVideoModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { loadVideos(); }}
        />
      )}

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

              {/* Admin buttons */}
              {isAdmin && (
                <div className="absolute top-4 left-4 z-40 flex gap-2">
                  <button onClick={e => handleDelete(e, video.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg hover:bg-red-700 transition">
                    <Trash2 size={17} />
                  </button>
                </div>
              )}
              {isAdmin && (
                <button
                  onClick={e => { e.stopPropagation(); setShowUpload(true); }}
                  className="absolute top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-[#12211D] shadow-lg hover:brightness-110 transition"
                  title="رفع فيديو"
                >
                  <Upload size={17} />
                </button>
              )}

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
    </>
  );
}