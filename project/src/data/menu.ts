/**
 * بيانات المنيو الثابتة لمطعم المروة.
 * ─────────────────────────────────────
 * عشان تضيف صنف جديد:
 *   1. ضيف عنصر جديد في الـ array بتاع الـ items
 *   2. حط الاسم والسعر والوصف
 *   3. لو عندك صورة للصنف، حط رابطها في imageUrl
 *
 * عشان تضيف قسم جديد (مثلاً: مشروبات):
 *   1. ضيف كائن جديد في menuCategories
 *   2. اختار id فريد و label بالعربي
 */

export interface MenuItem {
  id: string | number;
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  imageUrl?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'orders',
    label: 'طلبات',
    items: [
      {
        id: '1',
        name: 'فول مدمس',
        price: 15,
        categoryId: 'orders',
        description: 'فول مدمس بالزيت الحار والليمون، من أجود أنواع الفول المصري',
        imageUrl: 'https://images.unsplash.com/photo-1547050605-2f268cd5daf9?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'طعمية (فلافل)',
        price: 10,
        categoryId: 'orders',
        description: 'طعمية مقرمشة من الخارج وطرية من الداخل بالخلطة السرية',
        imageUrl: 'https://images.unsplash.com/photo-1593001872117-c51d3e5f3c55?w=400&h=400&fit=crop',
      },
      {
        id: '3',
        name: 'بيض بالبسطرمة',
        price: 25,
        categoryId: 'orders',
        description: 'بيض مقلي مع شرائح البسطرمة الطازجة والطماطم',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop',
      },
      {
        id: '4',
        name: 'فول بالسجق',
        price: 20,
        categoryId: 'orders',
        description: 'فول مدمس مع شرائح سجق بلدي مشوي',
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop',
      },
      {
        id: '5',
        name: 'شكشوكة',
        price: 22,
        categoryId: 'orders',
        description: 'بيض مع طماطم وفلفل وبصل على الطريقة المصرية',
        imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=400&fit=crop',
      },
      {
        id: '6',
        name: 'فول إسكندراني',
        price: 18,
        categoryId: 'orders',
        description: 'فول بالطحينة والطماطم والبصل الأخضر',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      },
    ],
  },
  {
    id: 'sandwiches',
    label: 'سندوتشات',
    items: [
      {
        id: '7',
        name: 'سندوتش فول',
        price: 8,
        categoryId: 'sandwiches',
        description: 'عيش بلدي محشي فول مدمس بالزيت والليمون',
        imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop',
      },
      {
        id: '8',
        name: 'سندوتش طعمية',
        price: 7,
        categoryId: 'sandwiches',
        description: 'عيش بلدي مع طعمية مقرمشة وسلطة',
        imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop',
      },
      {
        id: '9',
        name: 'سندوتش بسطرمة',
        price: 15,
        categoryId: 'sandwiches',
        description: 'عيش فينو مع بسطرمة وجبنة رومي',
        imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=400&fit=crop',
      },
      {
        id: '10',
        name: 'سندوتش سجق',
        price: 12,
        categoryId: 'sandwiches',
        description: 'عيش بلدي مع سجق بلدي مشوي وطحينة',
        imageUrl: 'https://images.unsplash.com/photo-1619740455993-9d701c29072d?w=400&h=400&fit=crop',
      },
      {
        id: '11',
        name: 'سندوتش مكس',
        price: 18,
        categoryId: 'sandwiches',
        description: 'فول + طعمية + بيض في سندوتش واحد',
        imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=400&fit=crop',
      },
      {
        id: '12',
        name: 'سندوتش جبنة قديمة',
        price: 10,
        categoryId: 'sandwiches',
        description: 'عيش بلدي مع جبنة قديمة بالطماطم والفلفل',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop',
      },
    ],
  },
];
