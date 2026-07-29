import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, Loader2, UtensilsCrossed } from 'lucide-react';
import { menuCategories as defaultCategories } from '../data/menu';
import { fetchMenuItems, deleteMenuItemAPI, isAdminLoggedIn, MenuItemData } from '../services/api';

interface MenuPageProps {
  onEditItem?: (item: MenuItemData) => void;
  onAddItem?: () => void;
}

/**
 * مكون صفحة قائمه الطعام / المنيو (MenuPage Component).
 * يعرض أصناف الطعام المتاحة مقسمة حسب الفئات، مع Loading/Empty states احترافية.
 * أزرار الإدارة (إضافة/تعديل/حذف) تظهر فقط للأدمن.
 */
export default function MenuPage({ onEditItem, onAddItem }: MenuPageProps) {
  const [activeCat, setActiveCat] = useState('orders');
  const [categories, setCategories] = useState(defaultCategories);
  const [isAdmin, setIsAdmin] = useState(isAdminLoggedIn());
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    const checkAuth = () => setIsAdmin(isAdminLoggedIn());
    window.addEventListener('auth_change', checkAuth);
    return () => window.removeEventListener('auth_change', checkAuth);
  }, []);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const apiItems = await fetchMenuItems();
      if (apiItems && apiItems.length > 0) {
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
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleDeleteItem = async (id: string | number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف من المنيو؟')) return;
    setDeletingId(id);
    const ok = await deleteMenuItemAPI(id);
    if (ok) {
      await loadMenu();
    }
    setDeletingId(null);
  };

  const current = categories.find((c) => c.id === activeCat) ?? categories[0];

  // Skeleton Loading Component
  const SkeletonItem = () => (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-surface bg-surface/50 p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-xl bg-surface shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-surface" />
          <div className="h-3 w-48 rounded bg-surface/80" />
        </div>
      </div>
      <div className="h-6 w-16 rounded bg-surface" />
    </li>
  );

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
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-[var(--color-gold)] text-[#12211d] shadow-lg shadow-[var(--color-gold)]/20'
                      : 'border border-surface text-muted hover:border-[var(--color-gold)]/40 hover:text-ivory'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Add Button */}
        {isAdmin && onAddItem && (
          <button
            onClick={onAddItem}
            className="mb-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-gold-bright py-3 text-sm font-bold text-[#12211d] shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-[var(--color-gold)]/20 active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>إضافة صنف جديد للمنيو</span>
          </button>
        )}

        {/* Loading State */}
        {isLoading && (
          <ul className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </ul>
        )}

        {/* Empty State */}
        {!isLoading && current.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface/60">
              <UtensilsCrossed size={36} className="text-muted" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-ivory">لا توجد أصناف حالياً</h3>
            <p className="text-sm text-muted max-w-xs">
              لم يتم إضافة أصناف لهذا القسم بعد.
              {isAdmin && ' اضغط على زر الإضافة أعلاه لإضافة صنف جديد.'}
            </p>
          </div>
        )}

        {/* Items List */}
        {!isLoading && current.items.length > 0 && (
          <ul className="flex flex-col gap-3">
            {current.items.map((item, idx) => (
              <li
                key={item.id}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-surface bg-surface/50 p-4 transition-all duration-300 hover:border-[var(--color-gold)]/40 hover:bg-surface/70 ${
                  deletingId === item.id ? 'opacity-50 scale-95' : ''
                }`}
                style={{ animation: `fadeInUp 0.4s ease ${idx * 0.05}s both` }}
              >
                <div className="flex items-start gap-4">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover border border-surface bg-[#0a1412] shrink-0 transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl border border-surface bg-[#0a1412] shrink-0 flex items-center justify-center">
                      <UtensilsCrossed size={20} className="text-muted/50" />
                    </div>
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
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-bright/20 text-gold-bright hover:bg-gold-bright/35 transition-all duration-200 active:scale-90"
                          title="تعديل الصنف"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deletingId === item.id}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/80 text-white hover:bg-red-700 transition-all duration-200 active:scale-90 disabled:opacity-50"
                        title="حذف الصنف"
                      >
                        {deletingId === item.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

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
