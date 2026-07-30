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
 * يعرض شعار المطعم واسم الصفحة الحالية وزر فتح لوحة تحكم المسؤول (الأدمن).
 */
export default function Header({ current, onNavigate, onOpenAdmin }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-surface bg-[#12211d]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        {/* زر الشعار والرجوع للصفحة الرئيسية */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2"
          aria-label="الصفحة الرئيسية"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-gold)] font-display text-lg text-[var(--color-gold-bright)]">
            م
          </span>
          <span className="font-display text-xl text-[var(--color-ivory)]">
            {titles[current]}
          </span>
        </button>

        {/* زر فتح لوحة التحكم والوصف */}
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[var(--color-muted)] sm:inline">طعم أصيل من قلب القاهرة</span>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 rounded-xl border border-surface bg-[#0a1412] px-3 py-1.5 text-xs text-gold-bright transition hover:border-gold-bright"
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

