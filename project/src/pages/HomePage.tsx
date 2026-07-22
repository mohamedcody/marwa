import { Clock, Leaf, MapPin, Star, UtensilsCrossed } from 'lucide-react';
import type { PageId } from '../components/navItems';

type HomePageProps = {
  onNavigate: (page: PageId) => void;
};

const features = [
  {
    icon: Leaf,
    title: 'مكونات طازجة',
    text: 'بنجيب المكونات كل يوم من السوق عشان نضمنلك طعم وطزاجة.',
  },
  {
    icon: UtensilsCrossed,
    title: 'وصفات أصيلة',
    text: 'وصفات بلدي موروثة من أجيال، بنحافظ على الطعم المصري الأصلي.',
  },
  {
    icon: Clock,
    title: 'سريع ومظبوط',
    text: 'خدمة سريعة من غير ما يغيب الطعم. طلبك جاهز في دقائق.',
  },
  {
    icon: Star,
    title: 'جودة مضمونة',
    text: 'نظافة وجودة هما أساس شغلنا. رضاكم هدفنا الأول.',
  },
];

const branches = [
  { name: 'فرع وسط البلد', address: 'شارع طلعت حرب، وسط البلد', hours: 'يومياً 6ص - 12ص' },
  { name: 'فرع المعادي', address: 'شارع 9، المعادي', hours: 'يومياً 6ص - 12ص' },
  { name: 'فرع مدينة نصر', address: 'شارع مكرم عبيد، مدينة نصر', hours: 'يومياً 6ص - 12ص' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/Pasted_image.png"
            alt="مطعم المروة"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12211d]/70 via-[#12211d]/60 to-[#12211d]" />
        </div>

        <div className="relative z-10 px-6 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-[var(--color-gold-bright)]">
            طعم أصيل من قلب القاهرة
          </p>
          <h1 className="mb-4 text-5xl text-ivory drop-shadow-lg sm:text-6xl">
            مطعم <span className="text-gold-bright">المروة</span>
          </h1>
          <p className="mx-auto mb-8 max-w-md text-base text-[var(--color-ivory)]/90">
            أكلة بلدية مصرية أصيلة. فول وطعمية وسندوتشات على الطريقة القديمة، بمكونات
            طازة كل يوم.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('menu')}
              className="rounded-full bg-[var(--color-gold)] px-7 py-3 font-bold text-[#12211d] shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              شوف المنيو
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="rounded-full border border-[var(--color-gold)] px-7 py-3 font-bold text-[var(--color-gold-bright)] transition-colors hover:bg-[var(--color-gold)]/10"
            >
              تواصل معنا
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[var(--color-gold-bright)]">
          <span className="text-xs">اكتشف المزيد</span>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-14">
        <h2 className="mb-8 text-center text-3xl text-ivory">
          ليه <span className="text-gold-bright">المروة</span>؟
        </h2>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-surface bg-surface/50 p-5 text-center transition-transform hover:scale-[1.02]"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-maroon)]/30">
                  <Icon size={24} className="text-[var(--color-gold-bright)]" />
                </div>
                <h3 className="mb-1 text-lg text-ivory">{f.title}</h3>
                <p className="text-xs text-muted">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 py-12">
        <blockquote className="mx-auto max-w-lg rounded-2xl border-r-4 border-[var(--color-gold)] bg-surface/40 p-6 text-center">
          <p className="text-lg italic text-ivory">
            «الطعم الأصيل مش بيتعمل في يوم واحد، ده موروث بيتنقل من جيل لجيل.»
          </p>
          <footer className="mt-3 text-sm text-gold-bright">— صاحب المطعم</footer>
        </blockquote>
      </section>

      {/* Branches */}
      <section className="px-4 py-12">
        <h2 className="mb-8 text-center text-3xl text-ivory">
          فروعنا
        </h2>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {branches.map((b) => (
            <div
              key={b.name}
              className="flex items-start gap-3 rounded-2xl border border-surface bg-surface/50 p-4"
            >
              <MapPin size={22} className="mt-0.5 shrink-0 text-[var(--color-gold-bright)]" />
              <div>
                <h3 className="text-lg text-ivory">{b.name}</h3>
                <p className="text-sm text-muted">{b.address}</p>
                <p className="mt-1 text-xs text-gold-bright">{b.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-surface px-6 py-8 text-center">
        <p className="font-display text-2xl text-gold-bright">مطعم المروة</p>
        <p className="mt-2 text-sm text-muted">طعم أصيل من قلب القاهرة</p>
        <p className="mt-4 text-xs text-muted">© 2025 جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
