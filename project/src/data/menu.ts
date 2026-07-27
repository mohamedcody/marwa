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
        id: 1,
        name: 'موزة ضأن بالرز',
        price: 380,
        categoryId: 'orders',
        description: 'موزة ضأن بلدي مطبوخة ببطء تقدم مع أرز بسمتي بالخلطة والمكسرات والشوربة.',
        imageUrl: '/images/moza.png'
      },
      {
        id: 2,
        name: 'نصف تيس مندي',
        price: 2400,
        categoryId: 'orders',
        description: 'تيس بلدي كامل مطبوخ على الطريقة المندية الأصلية في حفرة البرميل، يقدم مع أرز المندي.',
        imageUrl: '/images/mandi.png'
      },
      {
        id: 3,
        name: 'طاجن عكاوي بالبصل',
        price: 290,
        categoryId: 'orders',
        description: 'طاجن عكاوي بلدي مع البصل المكرمل والبهارات الشرقية المميزة مطبوخ في الفرن الفخاري.',
        imageUrl: '/images/tawgen.png'
      },
      {
        id: 4,
        name: 'وجبة كفتة وطرب المروة',
        price: 220,
        categoryId: 'orders',
        description: 'سيخ كفتة مشوية وسيخ طرب بلدي على الفحم، يقدم مع أرز وسلطات وخضار.',
        imageUrl: '/images/mix_grill.png'
      }
    ]
  },
  {
    id: 'sandwiches',
    label: 'سندوتشات',
    items: [
      {
        id: 5,
        name: 'سندوتش طرب فاخر',
        price: 75,
        categoryId: 'sandwiches',
        description: 'طرب بلدي مشوي على الفحم داخل خبز بلدي طازج مع الطحينة والبقدونس.',
        imageUrl: '/images/tarb_sandwich.png'
      },
      {
        id: 6,
        name: 'سندوتش كفتة المروة',
        price: 60,
        categoryId: 'sandwiches',
        description: 'كفتة بلدي مشوية على الفحم مع سلطة الطحينة المميزة في خبز طازج.',
        imageUrl: '/images/kofta_sandwich.png'
      },
      {
        id: 7,
        name: 'سندوتش كبدة إسكندراني',
        price: 55,
        categoryId: 'sandwiches',
        description: 'كبدة بلدي مطبوخة بالفلفل الحار والثوم وعصير الليمون تقدم في خبز فينو.',
        imageUrl: '/images/kebda_sandwich.png'
      },
      {
        id: 8,
        name: 'سندوتش حواوشي عالفحم',
        price: 65,
        categoryId: 'sandwiches',
        description: 'رغيف حواوشي بلدي محشو باللحم المفروم المتبل ومسوى على الفحم مباشرة.',
        imageUrl: '/images/hawawshi.png'
      }
    ]
  }
];
