/**
 * بيانات الفروع لمطعم المروة.
 * الـ id لازم يطابق قيمة التصنيف (category) المستخدمة في لوحة الأدمن:
 *   - "alaa"   → فرع علاء
 *   - "said"   → فرع سعيد
 *   - "ahmed"  → فرع مدير المطعم (الفرع الرئيسي)
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  gallery: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'alaa',
    name: 'علاء',
    role: 'مدير الفرع',
    bio: 'مدير الفرع الأول لمطعم المروة، يتميز بتقديم أشهى المأكولات الشعبية بأعلى جودة.',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 'said',
    name: 'سعيد',
    role: 'مدير الفرع',
    bio: 'مدير الفرع الثاني يقدم تجربة مميزة مع أشهى السندوتشات والوجبات السريعة على الطريقة المصرية.',
    avatar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 'ahmed',
    name: 'أحمد',
    role: 'مدير الفرع (الرئيسي)',
    bio: 'مدير الفرع الرئيسي للمطعم، يجمع بين الأصالة والحداثة في تقديم الأكل المصري.',
    avatar: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1505826759037-1a6973578162?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1587574293132-fe0f0c8a646c?w=400&h=400&fit=crop',
    ],
  },
];

// للتوافق مع الكود القديم
export const team = teamMembers;
