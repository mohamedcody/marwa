/**
 * restaurantInfo.ts — بيانات مطعم المروة ومعلومات التواصل والفروع
 * بيانات محلية متكاملة وسريعة تعمل مباشرة في الواجهة بدون الحاجة لأي خادم.
 */

export interface RestaurantInfoData {
  id?: number | string;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  workingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  branches: Array<{
    name: string;
    address: string;
    phone: string;
    hours: string;
  }>;
}

export const defaultRestaurantInfo: RestaurantInfoData = {
  id: 1,
  name: 'مطعم المروة',
  description: 'أشهى المأكولات الشعبية المصرية المحضرة يومياً بكل حب من أجود المكونات الطازجة.',
  address: 'القاهرة - المرج',
  phoneNumber: '01221365286',
  whatsappNumber: '201221365286',
  email: 'info@marwa-restaurant.com',
  workingHours: 'يومياً من الساعة 4:00 صباحاً وحتى 4:00 مساءً',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  branches: [
    {
      name: 'المرج الشرقية',
      address: 'بجوار نادي المرج',
      phone: '01288722713',
      hours: 'يومياً 4 ص - 4 م',
    },
    {
      name: 'المرج الغربية (مدرسة العين)',
      address: 'بجوار مدرسة العين الخاصة',
      phone: '01004851243',
      hours: 'يومياً 4 ص - 4 م',
    },
    {
      name: 'المرج الغربية (شارع العدل)',
      address: 'بجوار شارع العدل',
      phone: '01507379992',
      hours: 'يومياً 4 ص - 4 م',
    },
  ],
};
