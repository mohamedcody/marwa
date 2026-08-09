import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { type PageId } from './navItems';

/**
 * الخصائص (Props) الخاصة بمكون الهيدر
 */
type HeaderProps = {
  current: PageId; // الصفحة النشطة حالياً
  onNavigate: (page: PageId) => void; // دالة التنقل بين الصفحات
  onOpenAdmin?: () => void; // دالة فتح نافذة لوحة تحكم المسؤول
};

// عناوين الصفحات المعروضة في شريط الهيدر
const titles: Record<PageId, string> = {
  home: 'مطعم المروة',
  menu: 'المنيو',
  photos: 'صور المطعم',
  videos: 'فيديوهات',
  team: 'الفروع',
  contact: 'تواصل معنا',
};

/**
 * مكون الهيدر العلوي (Header Component).
 * تم ترقيته ليدعم:
 * - تأثير Glassmorphism متقدم (شفافية + blur)
 * - ظل متدرج عند التمرير (scroll-based shadow)
 * - أنيميشن ناعمة عند تغيير عنوان الصفحة
 */
export default function Header({ current, onNavigate, onOpenAdmin }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-[#C9A227]/10 bg-[#12211d]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'border-b border-white/5 bg-[#12211d]/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* زر الشعار والرجوع للصفحة الرئيسية */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group"
          aria-label="الصفحة الرئيسية"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#C9A227] font-display text-lg text-[#E4C566] transition-all duration-300 group-hover:bg-[#C9A227]/15 group-hover:shadow-[0_0_15px_rgba(201,162,39,0.3)]">
            م
          </span>
          {/* أنيميشن عنوان الصفحة — يتغير بحركة ناعمة */}
          <motion.span
            key={current}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-display text-xl text-[#F3E9D2]"
          >
            {titles[current]}
          </motion.span>
        </button>

        {/* زر فتح لوحة التحكم والوصف */}
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#A9A08C] sm:inline">طعم أصيل من قلب القاهرة</span>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 rounded-xl border border-[#2c4136] bg-[#0a1412]/80 px-3 py-1.5 text-xs text-[#E4C566] transition-all duration-300 hover:border-[#C9A227]/50 hover:bg-[#C9A227]/10 hover:shadow-[0_0_12px_rgba(201,162,39,0.15)] active:scale-95"
              title="لوحة تحكم الأدمن"
            >
              <ShieldCheck size={16} />
              <span>الأدمن</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
