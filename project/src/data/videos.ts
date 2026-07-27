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
    id: 'v1',
    author: 'الشيف اللمبي',
    caption: 'سر تتبيلة الكباب وطريقة الشوي المثالية على الفحم مباشرة 🔥🥩',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-chef-grilling-steaks-on-a-professional-flattop-41386-large.mp4',
    poster: '/images/mix_grill.png',
    likes: 345,
    views: 1250
  },
  {
    id: 'v2',
    author: 'مطعم المروة',
    caption: 'تحضير العجين الطازج وخبز الحواوشي البلدي في الفرن الفخاري 🥖🔥',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-41380-large.mp4',
    poster: '/images/hawawshi.png',
    likes: 189,
    views: 890
  },
  {
    id: 'v3',
    author: 'الشيف سعيد',
    caption: 'تجهيز طاجن العكاوي بالبصل المكرمل مع الشوربة السرية 🧅🍲',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-pot-41584-large.mp4',
    poster: '/images/tawgen.png',
    likes: 512,
    views: 2310
  }
];
