/**
 * api.ts — طبقة الخدمات الموحدة للواجهة الأمامية
 * تم تحويلها لخدمات Frontend-Only آمنة ومستقرة بدون أي تبعيات خادم مكسورة.
 */

export * from './restaurantService';

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
