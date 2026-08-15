// هذا الملف لم يعد مستخدماً — الموقع أصبح ثابت (Static) بالكامل.
// يمكنك حذفه بأمان.

// ── Interfaces (تم الاحتفاظ بها لتوافق الاستيراد) ──
export interface MenuItemData {
  id: string | number;
  name: string;
  price: number;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
}

export interface PhotoData {
  id: string | number;
  src: string;
  caption: string;
  category?: string;
}

export interface VideoData {
  id: string | number;
  title: string;
  videoUrl: string;
  description?: string;
  likes?: number;
  views?: number;
  shares?: number;
  userLiked?: boolean;
}
