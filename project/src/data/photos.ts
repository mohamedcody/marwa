/**
 * بيانات صور المطعم الثابتة.
 * ─────────────────────────────────────
 * عشان تضيف صورة جديدة:
 *   1. ضيف عنصر جديد في الـ array
 *   2. حط رابط الصورة في src
 *   3. اكتب وصف الصورة في caption
 *   4. (اختياري) حط اسم الفرع في category: 'alaa' | 'said' | 'ahmed' | 'general'
 */

export interface PhotoItem {
  id: string | number;
  src: string;
  caption: string;
  category?: string;
}

export const photos: PhotoItem[] = [
  // ── صور عامة للمطعم ──
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop',
    caption: 'أجواء المطعم من الداخل',
    category: 'general',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop',
    caption: 'المطعم يرحب بكم',
    category: 'general',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=600&fit=crop',
    caption: 'جلسات عائلية مريحة',
    category: 'general',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop',
    caption: 'الأطباق جاهزة للتقديم',
    category: 'general',
  },

  // ── صور فرع علاء ──
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=600&fit=crop',
    caption: 'فرع علاء - المرج الشرقية',
    category: 'alaa',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=600&fit=crop',
    caption: 'جلسات فرع علاء',
    category: 'alaa',
  },

  // ── صور فرع سعيد ──
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=600&fit=crop',
    caption: 'فرع سعيد - المرج الغربية',
    category: 'said',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop',
    caption: 'أطباق فرع سعيد',
    category: 'said',
  },

  // ── صور فرع أحمد (الرئيسي) ──
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1505826759037-1a6973578162?w=600&h=600&fit=crop',
    caption: 'الفرع الرئيسي - فرع أحمد',
    category: 'ahmed',
  },
  {
    id: '10',
    src: 'https://images.unsplash.com/photo-1587574293132-fe0f0c8a646c?w=600&h=600&fit=crop',
    caption: 'أجواء الفرع الرئيسي',
    category: 'ahmed',
  },

  // ── صور أكل ──
  {
    id: '11',
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop',
    caption: 'أطباق طازجة كل يوم',
    category: 'general',
  },
  {
    id: '12',
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop',
    caption: 'أجمل الأطباق المصرية',
    category: 'general',
  },
];
