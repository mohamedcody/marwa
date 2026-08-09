import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, Leaf, MapPin, Star, UtensilsCrossed } from 'lucide-react';
import type { PageId } from '../components/navItems';

/**
 * الخصائص (Props) الخاصة بالصفحة الرئيسية
 */
type HomePageProps = {
  onNavigate: (page: PageId) => void; // دالة التنقل إلى صفحة أخرى (مثل المنيو أو التواصل)
};

// مميزات المطعم المعروضة في قسم "ليه المروة؟"
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

// فروع المطعم ومواعيد العمل
const branches = [
  {
    name: 'المرج الشرقية',
    address: 'بجوار نادي المرج',
    hours: 'يوميًا 4 ص - 4 م',
  },
  {
    name: 'المرج الغربية',
    address: 'بجوار مدرسة العين الخاصة',
    hours: 'يوميًا 4 ص - 4 م',
  },
  {
    name: 'المرج الغربية',
    address: 'بجوار شارع العدل',
    hours: 'يوميًا 4 ص - 4 م',
  },
];

/**
 * مكون الأنيميشن عند الظهور في Viewport (Scroll Reveal)
 */
function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * مكون الصفحة الرئيسية (HomePage Component).
 * تم ترقيته لدعم:
 * - Hero Parallax Effect (الصورة تتحرك بسرعة أبطأ من النص)
 * - Scroll Reveal Animations لكل قسم
 * - تأثيرات Hover محسنة على الكروت
 * - Footer محدث (2026)
 */
export default function HomePage({ onNavigate }: HomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  // الصورة تتحرك ببطء أكثر → تأثير Parallax
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="pb-4">
      {/* Hero مع Parallax */}
      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <img
            src="/images/Pasted_image.png"
            alt="مطعم المروة"
            className="h-full w-full object-cover object-center scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12211d]/70 via-[#12211d]/60 to-[#12211d]" />
        </motion.div>

        <motion.div
          className="relative z-10 px-6 text-center"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-3 text-sm font-semibold tracking-widest text-[#E4C566]"
          >
            طعم أصيل من قلب القاهرة
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mb-4 text-5xl text-[#F3E9D2] drop-shadow-lg sm:text-6xl font-display"
          >
            مطعم <span className="text-[#E4C566]">المروة</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mb-8 max-w-md text-base text-[#F3E9D2]/90"
          >
            أكلة بلدية مصرية أصيلة. فول وطعمية وسندوتشات على الطريقة القديمة، بمكونات
            طازة كل يوم.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => onNavigate('menu')}
              className="rounded-full bg-[#C9A227] px-7 py-3 font-bold text-[#12211d] shadow-lg shadow-[#C9A227]/25 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,162,39,0.4)] active:scale-95"
            >
              شوف المنيو
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="rounded-full border border-[#C9A227] px-7 py-3 font-bold text-[#E4C566] transition-all duration-300 hover:bg-[#C9A227]/10 hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]"
            >
              تواصل معنا
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#E4C566]"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="inline-block text-xs"
          >
            اكتشف المزيد ↓
          </motion.span>
        </motion.div>
      </section>

      {/* Features مع Scroll Reveal */}
      <section className="px-4 py-14">
        <RevealOnScroll>
          <h2 className="mb-8 text-center text-3xl text-[#F3E9D2] font-display">
            ليه <span className="text-[#E4C566]">المروة</span>؟
          </h2>
        </RevealOnScroll>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <RevealOnScroll key={f.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="rounded-2xl border border-[#2c4136] bg-[#1c2e24]/50 p-5 text-center cursor-default"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7a2731]/30">
                    <Icon size={24} className="text-[#E4C566]" />
                  </div>
                  <h3 className="mb-1 text-lg text-[#F3E9D2] font-display">{f.title}</h3>
                  <p className="text-xs text-[#A9A08C]">{f.text}</p>
                </motion.div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* Quote مع Scroll Reveal */}
      <section className="px-6 py-12">
        <RevealOnScroll>
          <blockquote className="mx-auto max-w-lg rounded-2xl border-r-4 border-[#C9A227] bg-[#1c2e24]/40 p-6 text-center">
            <p className="text-lg italic text-[#F3E9D2]">
              «الطعم الأصيل مش بيتعمل في يوم واحد، ده موروث بيتنقل من جيل لجيل.»
            </p>
            <footer className="mt-3 text-sm text-[#E4C566]">— صاحب المطعم</footer>
          </blockquote>
        </RevealOnScroll>
      </section>

      {/* Branches مع Scroll Reveal */}
      <section className="px-4 py-12">
        <RevealOnScroll>
          <h2 className="mb-8 text-center text-3xl text-[#F3E9D2] font-display">
            فروعنا
          </h2>
        </RevealOnScroll>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {branches.map((b, i) => (
            <RevealOnScroll key={b.address} delay={i * 0.1}>
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-start gap-3 rounded-2xl border border-[#2c4136] bg-[#1c2e24]/50 p-4 cursor-default"
              >
                <MapPin size={22} className="mt-0.5 shrink-0 text-[#E4C566]" />
                <div>
                  <h3 className="text-lg text-[#F3E9D2] font-display">{b.name}</h3>
                  <p className="text-sm text-[#A9A08C]">{b.address}</p>
                  <p className="mt-1 text-xs text-[#E4C566]">{b.hours}</p>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-[#2c4136] px-6 py-8 text-center">
        <p className="font-display text-2xl text-[#E4C566]">مطعم المروة</p>
        <p className="mt-2 text-sm text-[#A9A08C]">طعم أصيل من قلب القاهرة</p>
        <p className="mt-4 text-xs text-[#A9A08C]">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
