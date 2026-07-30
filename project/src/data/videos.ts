export interface VideoItem {
  id: string | number;
  author: string;
  caption: string;
  src: string;
  poster: string;
  likes: number;
  views: number;
}

export const videos: VideoItem[] = [];
