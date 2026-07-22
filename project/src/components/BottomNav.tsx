import { navItems, type PageId } from './navItems';

type BottomNavProps = {
  current: PageId;
  onNavigate: (page: PageId) => void;
};

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface bg-[#12211d]/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around">
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
                <span
                  className={`absolute top-0 h-0.5 rounded-full bg-[var(--color-gold-bright)] transition-all duration-300 ${
                    active ? 'w-8 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
                <Icon
                  size={22}
                  className={`transition-colors duration-300 ${
                    active
                      ? 'text-[var(--color-gold-bright)]'
                      : 'text-[var(--color-muted)] group-hover:text-[var(--color-ivory)]'
                  }`}
                />
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
