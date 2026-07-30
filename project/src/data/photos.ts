export interface PhotoItem {
  id: string | number;
  src: string;
  caption: string;
  category?: string;
}

export const photos: PhotoItem[] = [];
