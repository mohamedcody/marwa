import { navItems, type PageId } from './navItems';
import { motion } from 'framer-motion';

/**
 * الخصائص (Props) الخاصة بمكون شريط التنقل السفلي
 */
type BottomNavProps = {
  current: PageId; // الصفحة النشطة حالياً
  onNavigate: (page: PageId) => void; // دالة التنقل بين الصفحات
};

/**
 * مكون شريط التنقل السفلي للهواتف والشاشات (Bottom Navigation Component).
 * تم ترقيته لدعم حركات (Physics-based) باستخدام Framer Motion و تأثيرات زجاجية ممتازة.
 */
export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#12211d]/70 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-1">
        {/* التكرار على جميع عناصر القائمة لإنشاء أزرار التنقل */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => onNavigate(item.id)}
                className="group relative flex w-full flex-col items-center gap-1 py-2 outline-none"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {/* خلفية نشطة بتأثير Glow (تظهر عند التفعيل) */}
                {active && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 rounded-2xl bg-[#C9A227]/10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* الخط الذهبي العلوي لتأكيد اختيار الصفحة بحركة ناعمة */}
                {active && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute top-0 h-[3px] w-10 rounded-full bg-[#C9A227] shadow-[0_0_10px_rgba(201,162,39,0.8)]"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* أيقونة الصفحة مع تأثيرات الحركة (Scale & Bounce) */}
                <motion.div
                  animate={{
                    scale: active ? 1.15 : 1,
                    y: active ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`relative z-10 transition-colors duration-300 ${active
                      ? 'text-[#C9A227] drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]'
                      : 'text-[#8A9A92] group-hover:text-[#F3E9D2]'
                    }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                </motion.div>

                {/* اسم الصفحة */}
                <span
                  className={`relative z-10 text-[10px] font-bold transition-all duration-300 ${active
                      ? 'text-[#C9A227]'
                      : 'text-[#8A9A92] group-hover:text-[#F3E9D2]'
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

