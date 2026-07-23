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
    src: '/veido/mm.mp4',
    poster: 'https://images.pexels.com/photos/3015510/pexels-photo-3015510.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'اسلام عوووفه تحضير جمبري',
    author: 'مطعم المروة',
  },
];
