/**
 * site.ts — المصدر المركزي لبيانات الموقع وهوية المطور (Single Source of Truth)
 * 
 * لتغيير صورتك أو بياناتك في أي وقت:
 * يكفي تعديل هذا الملف أو استبدال ملف الصورة داخل public/images/profile/programmer.jpg
 * وسيتحدث تلقائياً في كامل أرجاء التطبيق.
 */

export interface DeveloperProfile {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  avatarAlt: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  email?: string;
}

export interface SiteConfig {
  restaurantName: string;
  tagline: string;
  description: string;
  developer: DeveloperProfile;
}

export const siteConfig: SiteConfig = {
  restaurantName: 'مطعم المروة',
  tagline: 'طعم أصيل من قلب القاهرة',
  description: 'منصة تفاعلية لعرض قائمة الطعام وأشهى المأكولات الشعبية وتجربة ريلز تفاعلية لفروع مطعم المروة.',
  developer: {
    name: 'Mohamed Saad',
    role: 'Frontend Architect & Full-Stack Developer',
    bio: 'مهندس واجهات أمامية وتطبيقات ويب تفاعلية حديثة بأعلى معايير الأداء والـ Clean Architecture.',
    avatar: '/images/profile/programmer.jpg',
    avatarAlt: 'صورة مهندس ومطور الموقع - محمد سعد',
    githubUrl: 'https://github.com/mohamedcody',
    linkedinUrl: 'https://www.linkedin.com',
    portfolioUrl: 'https://github.com/mohamedcody/marwa',
    email: 'mohamedcody18@gmail.com',
  },
};
