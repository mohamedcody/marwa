export type Video = {
  id: string;
  src: string;
  poster: string;
  caption: string;
  author: string;
};

// Vertical (portrait) stock videos from Pexels — TikTok-style feed
export const videos: Video[] = [
  {
    id: 'v1',
    src: 'https://videos.pexels.com/video-files/3015510/3015510-uhd_3840_2160_25fps.mp4',
    poster: 'https://images.pexels.com/photos/3015510/pexels-photo-3015510.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'تحضير الفول المدمس على الطريقة المصرية',
    author: 'مطعم المروة',
  },
  {
    id: 'v2',
    src: 'https://videos.pexels.com/video-files/3015512/3015512-uhd_3840_2160_25fps.mp4',
    poster: 'https://images.pexels.com/photos/3015512/pexels-photo-3015512.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'قلي الطعمية الذهبية',
    author: 'مطعم المروة',
  },
  {
    id: 'v3',
    src: 'https://videos.pexels.com/video-files/3015513/3015513-uhd_3840_2160_25fps.mp4',
    poster: 'https://images.pexels.com/photos/3015513/pexels-photo-3015513.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'تجهيز السندوتشات بكل حب',
    author: 'مطعم المروة',
  },
  {
    id: 'v4',
    src: 'https://videos.pexels.com/video-files/3015514/3015514-uhd_3840_2160_25fps.mp4',
    poster: 'https://images.pexels.com/photos/3015514/pexels-photo-3015514.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'جوه المطعم وقت الزحمة',
    author: 'مطعم المروة',
  },
];
