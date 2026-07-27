import { useEffect, useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { menuCategories as defaultCategories } from '../data/menu';
import { fetchMenuItems, deleteMenuItemAPI, isAdminLoggedIn, MenuItemData } from '../services/api';

interface MenuPageProps {
  onEditItem?: (item: MenuItemData) => void;
}

/**
 * مكون صفحة قائمه الطعام / المنيو (MenuPage Component).
 * يعرض أصناف الطعام المتاحة مقسمة حسب الفئات (طلبات / سندوتشات)، مع إمكانية جلبها ديناميكياً من الباك إند أو استخدام البيانات الافتراضية، وحذف وتعديل الأصناف في حال تسجيل الدخول كأدمن.
 */
export default function MenuPage({ onEditItem }: MenuPageProps) {
  // القسم النشط حالياً (الافتراضي: 'orders' أي طلبات)
  const [activeCat, setActiveCat] = useState('orders');
  // قائمة الفئات والأصناف
  const [categories, setCategories] = useState(defaultCategories);
  // حالة التحقق من تسجيل دخول المسؤول (محدثة تلقائياً)
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());

  useEffect(() => {
    const checkAuth = () => setIsAdmin(isAdminLoggedIn());
    window.addEventListener('auth_change', checkAuth);
    return () => window.removeEventListener('auth_change', checkAuth);
  }, []);


  /**
   * جلب المنيو من خادم الباك إند وتجميع الأصناف بحسب أقسامها
   */
  const loadMenu = async () => {
    const apiItems = await fetchMenuItems();
    if (apiItems && apiItems.length > 0) {
      // تجميع عناصر الـ API حسب القسم
      const orders = apiItems.filter((i) => i.categoryId === 'orders');
      const sandwiches = apiItems.filter((i) => i.categoryId === 'sandwiches');

      setCategories([
        {
          id: 'orders',
          label: 'طلبات',
          items: orders.length > 0 ? (orders as any) : defaultCategories[0].items,
        },
        {
          id: 'sandwiches',
          label: 'سندوتشات',
          items: sandwiches.length > 0 ? (sandwiches as any) : defaultCategories[1].items,
        },
      ]);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  /**
   * حذف صنف محدد من المنيو (خاص بالأدمن فقط)
   */
  const handleDeleteItem = async (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف من المنيو؟')) return;
    const ok = await deleteMenuItemAPI(id);
    if (ok) {
      loadMenu();
    } else {
      // حذف محلي احتياطي إذا كان الباك إند متوقفاً
      setCategories((prevCats) =>
        prevCats.map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.id !== id),
        }))
      );
    }
  };


  const current = categories.find((c) => c.id === activeCat) ?? categories[0];

  return (
    <div className="pb-4">
      {/* Hero image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src="/images/Pasted_image.png"
          alt="قائمة الطعام"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#12211d]" />
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <h2 className="font-display text-2xl text-[var(--color-gold)]">قائمة الطعام</h2>
        </div>
      </div>

      <div className="px-4">
        <div className="pt-4" />

        {/* Category tabs */}
        <div className="sticky top-16 z-30 -mx-4 mb-4 bg-[#12211d]/90 px-4 py-3 backdrop-blur-md">
          <div className="flex gap-2">
            {categories.map((cat) => {
              const active = cat.id === activeCat;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    active
                      ? 'bg-[var(--color-gold)] text-[#12211d]'
                      : 'border border-surface text-muted'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <ul className="flex flex-col gap-3">
          {current.items.map((item, idx) => (
            <li
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-surface bg-surface/50 p-4 transition-colors hover:border-[var(--color-gold)]/40"
              style={{ animation: `fadeInUp 0.4s ease ${idx * 0.05}s both` }}
            >
              <div className="flex items-start gap-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover border border-surface bg-[#0a1412] shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-maroon)]/30 text-[10px] font-bold text-[var(--color-gold-bright)]">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-ivory">{item.name}</h4>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted leading-relaxed mt-1 max-w-md">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-surface/20 pt-3 sm:border-none sm:pt-0 shrink-0">
                <span className="font-display text-lg text-gold-bright">
                  {item.price} <span className="text-xs text-muted">ج.م</span>
                </span>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    {onEditItem && (
                      <button
                        onClick={() => onEditItem(item as any)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-bright/20 text-gold-bright hover:bg-gold-bright/35 transition"
                        title="تعديل الصنف"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/80 text-white hover:bg-red-700 transition"
                      title="حذف الصنف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-muted">
          الأسعار شاملة الضريبة. متاح التوصيل والتوصيل السريع.
        </p>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
