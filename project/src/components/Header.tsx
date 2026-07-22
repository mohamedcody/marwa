import { type PageId } from './navItems';

type HeaderProps = {
  current: PageId;
  onNavigate: (page: PageId) => void;
};

const titles: Record<PageId, string> = {
  home: 'مطعم المروة',
  menu: 'المنيو',
  photos: 'صور المطعم',
  videos: 'فيديوهات',
  team: 'فريق العمل',
  contact: 'تواصل معنا',
};

export default function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-surface bg-[#12211d]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
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
        <span className="text-xs text-[var(--color-muted)]">طعم أصيل من قلب القاهرة</span>
      </div>
    </header>
  );
}
