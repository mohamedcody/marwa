import { navItems, type PageId } from './navItems';

/**
 * الخصائص (Props) الخاصة بمكون شريط التنقل السفلي
 */
type BottomNavProps = {
  current: PageId; // الصفحة النشطة حالياً
  onNavigate: (page: PageId) => void; // دالة التنقل بين الصفحات
};

/**
 * مكون شريط التنقل السفلي للهواتف والشاشات (Bottom Navigation Component).
 * يعرض أيقونات التنقل الرئيسية في أسفل الشاشة مع مؤشر ملون ينشط مع الصفحة الحالية.
 */
export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface bg-[#12211d]/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around">
        {/* التكرار على جميع عناصر القائمة لإنشاء أزرار التنقل */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavigate(item.id)}
                className="group relative flex w-full flex-col items-center gap-0.5 py-2.5 transition-colors"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {/* الخط الذهبي السفلي لتأكيد اختيار الصفحة */}
                <span
                  className={`absolute top-0 h-0.5 rounded-full bg-[var(--color-gold-bright)] transition-all duration-300 ${
                    active ? 'w-8 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
                {/* أيقونة الصفحة */}
                <Icon
                  size={22}
                  className={`transition-colors duration-300 ${
                    active
                      ? 'text-[var(--color-gold-bright)]'
                      : 'text-[var(--color-muted)] group-hover:text-[var(--color-ivory)]'
                  }`}
                />
                {/* اسم الصفحة */}
                <span
                  className={`text-[10px] font-semibold transition-colors duration-300 ${
                    active
                      ? 'text-[var(--color-gold-bright)]'
                      : 'text-[var(--color-muted)] group-hover:text-[var(--color-ivory)]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

