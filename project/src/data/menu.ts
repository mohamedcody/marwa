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
  { id: 'orders', label: 'طلبات', items: [] },
  { id: 'sandwiches', label: 'سندوتشات', items: [] },
];
