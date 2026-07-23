

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
    role: 'مدير الفرع',
    bio: 'أمهر قليّ الطعمية في القاهرة كلها. إيده بتطلع طعمية مقرمشة من ذهب.',
    avatar: './images/imgg.png',
    gallery: [
   '/images/imgg.png',
      '/images/imgg.png',
      '/images/lembey.png',
      '/images/doksh.png',
      '/images/hesham.png',
    ],
  },
  {
    id: 'said',
    name: 'سعيد',
    role: 'مدير الفرع',
    bio: 'ملك الفول المدمس. بيراعي على الوصفة الأصيلة من أيام جدوده.',
    avatar: './images/said.png',
    gallery: [
      './images/said.png',
      './images/saidG.png',
    ],
  },
  {
    id: 'nazer',
    name: 'ناظر',
    role: '',
    bio: 'بيدير المطعم بحكمة وكرم ضيافة. ضيوفنا دايماً في أمان.',
    avatar: 'localImg',
    gallery: [
      './images/nazer.png',
      './images/nazer.png',
      './images/nazer.png',
      './images/nazer.png',
    ],
  },
];
