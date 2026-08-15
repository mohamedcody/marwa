/**
 * بيانات الفيديوهات الثابتة.
 * ─────────────────────────────────────
 * عشان تضيف فيديو جديد:
 *   1. ضيف عنصر جديد في الـ array
 *   2. في src حط رابط الفيديو (يدعم YouTube و Facebook و TikTok وروابط مباشرة)
 *   3. poster هي صورة الغلاف (الـ thumbnail)
 *
 * أنواع الروابط المدعومة:
 *   - YouTube:  https://www.youtube.com/watch?v=XXXXX أو https://youtu.be/XXXXX أو shorts
 *   - Facebook: https://www.facebook.com/watch/?v=XXXXX
 *   - TikTok:   https://www.tiktok.com/@user/video/XXXXX
 *   - مباشر:    https://example.com/video.mp4
 */

export interface VideoItem {
  id: string | number;
  author: string;
  caption: string;
  src: string;
  poster: string;
  likes: number;
  views: number;
}

export const videos: VideoItem[] = [
  {
    id: '1',
    author: 'مطعم المروة',
    caption: 'تحضير الفول المدمس الأصلي على نار هادية 🔥',
    src: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1547050605-2f268cd5daf9?w=400&h=700&fit=crop',
    likes: 234,
    views: 1520,
  },
  {
    id: '2',
    author: 'مطعم المروة',
    caption: 'طعمية مقرمشة طازة كل يوم الصبح 🧆',
    src: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1593001872117-c51d3e5f3c55?w=400&h=700&fit=crop',
    likes: 189,
    views: 980,
  },
  {
    id: '3',
    author: 'مطعم المروة',
    caption: 'جولة في فرع المرج الشرقية 📍',
    src: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=700&fit=crop',
    likes: 312,
    views: 2100,
  },
  {
    id: '4',
    author: 'مطعم المروة',
    caption: 'أحلى سندوتشات في المرج 🥪',
    src: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=700&fit=crop',
    likes: 156,
    views: 870,
  },
  {
    id: '5',
    author: 'مطعم المروة',
    caption: 'يوم في المطبخ مع الشيف 👨‍🍳',
    src: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    poster: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=700&fit=crop',
    likes: 445,
    views: 3200,
  },
];
