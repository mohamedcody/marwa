export type MenuItem = {
  id: string;
  name: string;
  price: number;
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: 'orders',
    label: 'طلبات',
    items: [
      { id: 'o1', name: 'كيس فول محوج', price: 10 },
      { id: 'o2', name: 'كيس فول سادة', price: 7 },
      { id: 'o3', name: 'كيس فول مطحون', price: 7 },
      { id: 'o4', name: 'كيس فول مطحون (زيت حار + طحينة)', price: 10 },
      { id: 'o5', name: 'كيس باذنجان', price: 7 },
      { id: 'o6', name: 'كيس مسقعة', price: 7 },
      { id: 'o7', name: 'كيس مهروسة', price: 7 },
      { id: 'o8', name: 'صوابع', price: 10 },
      { id: 'o9', name: 'صوابع جمبري', price: 10 },
      { id: 'o10', name: 'بطاطس شيبسي', price: 10 },
      { id: 'o11', name: 'كيس جبنة مش', price: 7 },
      { id: 'o12', name: 'بيضة', price: 8 },
      { id: 'o13', name: 'سلطة بلدي', price: 5 },
      { id: 'o14', name: 'كيس طحينة', price: 5 },
      { id: 'o15', name: 'كيس مخلل', price: 5 },
      { id: 'o16', name: 'طعمية محشية', price: 5 },
      { id: 'o17', name: 'طعمية عادية', price: 1 },
      { id: 'o18', name: 'طعمية كبيرة سادة', price: 3 },
      { id: 'o19', name: 'عجة ببيضة واحدة', price: 15 },
      { id: 'o20', name: 'عجة بـ 2 بيض', price: 25 },
    ],
  },
  {
    id: 'sandwiches',
    label: 'سندوتشات',
    items: [
    { id: 's1', name: 'ساندوتش طعمية', price: 8 },
      { id: 's2', name: 'ساندوتش مهروسة', price: 8 },
      { id: 's3', name: 'ساندوتش جبنة', price: 8 },
      { id: 's4', name: 'ساندوتش صوابع', price: 9 },
      { id: 's5', name: 'ساندوتش شبسي', price: 9 },
      { id: 's6', name: 'ساندوتش طعمية محشية', price: 10 },
      { id: 's7', name: 'ساندوتش بيض', price: 10 },
      { id: 's8', name: 'ساندوتش مسقعة', price: 8 },
      { id: 's9', name: 'ساندوتش بيض علي مهروسة', price: 15 },
      { id: 's10', name: 'ساندوتش بيض علي طعمية', price: 15 },
      { id: 's11', name: 'ساندوتش بيض علي صوابع', price: 15 },
      { id: 's12', name: 'ساندوتش بيض بابا غنوج', price: 15 },
      { id: 's13', name: 'ساندوتش طعمية علي بابا غنوج', price: 12 },
      { id: 's14', name: 'ساندوتش فول علي طعمية', price: 12 },
      { id: 's15', name: 'ساندوتش فول وصوابع', price: 13 },
    ],
  },
];
