
// بتعمل استدعاء للصورة وتديها أي اسم متغير، مثلاً localImg
import localImg from "../image/Pasted image.png";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  gallery: string[];
};

export const teamMembers: TeamMember[] = [
  {
    id: 'lambi',
    name: 'اللمبي',
    role: 'شيف الطعمية',
    bio: 'أمهر قليّ الطعمية في القاهرة كلها. إيده بتطلع طعمية مقرمشة من ذهب.',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: [
       localImg,
      'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/3777947/pexels-photo-3777947.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/3777950/pexels-photo-3777950.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
  },
  {
    id: 'said',
    name: 'سعيد',
    role: 'شيف الفول',
    bio: 'ملك الفول المدمس. بيراعي على الوصفة الأصيلة من أيام جدوده.',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: [
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/8472992/pexels-photo-8472992.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/5409026/pexels-photo-5409026.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/4194683/pexels-photo-4194683.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
  },
  {
    id: 'nazer',
    name: 'ناظر',
    role: 'مدير المطعم',
    bio: 'بيدير المطعم بحكمة وكرم ضيافة. ضيوفنا دايماً في أمان.',
    avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=600',
    gallery: [
      'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/3219547/pexels-photo-3219547.jpeg?auto=compress&cs=tinysrgb&w=1000',
      'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1000',
    ],
  },
];
