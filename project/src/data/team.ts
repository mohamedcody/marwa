export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  gallery: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'lambi',
    name: 'الشيف اللمبي',
    role: 'رئيس شيفات المشويات والمندي',
    avatar: '/images/team/lambi.png',
    bio: 'خبرة أكثر من ١٥ عاماً في إعداد اللحوم، المندي الأصلي، والكباب المشوي على الفحم بالطرق التقليدية.',
    gallery: [
      '/images/mandi.png',
      '/images/moza.png',
      '/images/mix_grill.png'
    ]
  },
  {
    id: 'said',
    name: 'الشيف سعيد',
    role: 'رئيس قسم الطواجن والمعجنات',
    avatar: '/images/team/said.png',
    bio: 'مبتكر الطواجن الفخارية بالبصل المكرمل والحواوشي الفاخر على الفحم في مطعم المروة.',
    gallery: [
      '/images/tawgen.png',
      '/images/hawawshi.png'
    ]
  },
  {
    id: 'nazer',
    name: 'الشيف الناظر',
    role: 'كبير الطهاة والمشرف العام',
    avatar: '/images/team/nazer.png',
    bio: 'الناظر المسؤول عن جودة المكونات، تناسق النكهات، والتحضير العام للمأكولات والشوربات اليومية.',
    gallery: [
      '/images/Pasted_image.png'
    ]
  }
];
