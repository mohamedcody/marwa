import { useEffect, useState } from 'react';
import { Clock, Mail, MapPin, Phone, MessageSquare, Facebook, Instagram } from 'lucide-react';
import { fetchRestaurantInfo, RestaurantInfoData } from '../services/api';

const defaultSocialLinks = {
  facebook: 'https://facebook.com/your-page',
  tiktok: 'https://tiktok.com/@your-page',
  instagram: 'https://instagram.com/your-page',
};

const branches = [
  { name: 'المرج الشرقية', address: 'بجوار نادي المرج', phone: '01288722713' },
  { name: 'المرج الغربية', address: 'بجوار مدرسة العين الخاصة', phone: '01004851243' },
  { name: 'المرج الغربية', address: 'بجوار شارع العدل', phone: '01507379992' },
];

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.59 2.59 0 11-1.83-2.48V9.66a5.42 5.42 0 105.42 5.42V8.79a7.63 7.63 0 004.39 1.39V7.09a4.28 4.28 0 01-3.83-1.27z" />
    </svg>
  );
}

export default function ContactPage() {
  const [info, setInfo] = useState<RestaurantInfoData | null>(null);

  useEffect(() => {
    const loadInfo = async () => {
      const data = await fetchRestaurantInfo();
      if (data) {
        setInfo(data);
      }
    };
    loadInfo();
  }, []);

  // توليد رابط الواتساب ديناميكياً باستخدام رقم هاتف المطعم من قاعدة البيانات
  const rawPhone = info?.phoneNumber || '01221365286';
  // إزالة أي مسافات أو علامات زائدة من رقم الهاتف لتوليد الرابط بشكل صحيح
  const cleanPhone = rawPhone.replace(/\s+/g, '').replace('+', '');
  const whatsappUrl = cleanPhone.startsWith('2') 
    ? `https://wa.me/${cleanPhone}` 
    : `https://wa.me/2${cleanPhone}`;

  const facebookUrl = info?.facebookUrl || defaultSocialLinks.facebook;
  const instagramUrl = info?.instagramUrl || defaultSocialLinks.instagram;
  const tiktokUrl = defaultSocialLinks.tiktok; // نستخدم التيك توك الافتراضي أو المضاف مستقبلاً

  return (
    <div className="px-4 pb-32 max-w-xl mx-auto" dir="rtl">
      <div className="pt-20" />
      <h2 className="mb-2 text-2xl font-bold text-ivory">تواصل <span className="text-gold-bright">معنا</span></h2>
      <p className="mb-6 text-xs text-gray-400">يسعدنا خدمتك والرد على استفساراتك في أي وقت</p>

      {/* 📞 Contact info Cards */}
      <div className="flex flex-col gap-3">
        <a
          href={`tel:${rawPhone}`}
          className="flex items-center gap-4 rounded-2xl border border-surface bg-surface/30 p-4 transition-all duration-300 hover:border-gold-bright/40 hover:bg-surface/50 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-maroon)]/20 transition-colors group-hover:bg-[var(--color-maroon)]/40">
            <Phone size={22} className="text-gold-bright" />
          </span>
          <div>
            <p className="text-xs text-gray-400">اتصل بنا مباشرة</p>
            <p className="text-base font-bold text-ivory mt-0.5" dir="ltr">{rawPhone}</p>
          </div>
        </a>

        <a
          href={`mailto:${info?.email || 'marwa-restaurant.eg@gmail.com'}`}
          className="flex items-center gap-4 rounded-2xl border border-surface bg-surface/30 p-4 transition-all duration-300 hover:border-gold-bright/40 hover:bg-surface/50 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-maroon)]/20 transition-colors group-hover:bg-[var(--color-maroon)]/40">
            <Mail size={22} className="text-gold-bright" />
          </span>
          <div>
            <p className="text-xs text-gray-400">راسلنا عبر البريد الإلكتروني</p>
            <p className="text-sm font-bold text-ivory mt-0.5">{info?.email || 'marwa-restaurant.eg@gmail.com'}</p>
          </div>
        </a>

        <div className="flex items-center gap-4 rounded-2xl border border-surface bg-surface/30 p-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-maroon)]/20">
            <Clock size={22} className="text-gold-bright" />
          </span>
          <div>
            <p className="text-xs text-gray-400">مواعيد العمل الرسمية</p>
            <p className="text-sm font-bold text-ivory mt-0.5">{info?.workingHours || 'يومياً 4ص - 4م'}</p>
          </div>
        </div>
      </div>

      {/* 🌐 Social Media Channels Grid */}
      <h3 className="mb-3 mt-8 text-lg font-bold text-ivory">قنواتنا على <span className="text-gold-bright">السوشيال ميديا</span></h3>
      <div className="grid grid-cols-2 gap-3">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 rounded-2xl border border-surface bg-emerald-950/20 p-4 text-center transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-950/30 hover:scale-[1.03]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <MessageSquare size={24} />
          </span>
          <span className="text-xs font-bold text-white">واتساب</span>
          <span className="text-[10px] text-gray-400">تحدث معنا الآن</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 rounded-2xl border border-surface bg-blue-950/20 p-4 text-center transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-950/30 hover:scale-[1.03]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            <Facebook size={24} />
          </span>
          <span className="text-xs font-bold text-white">فيسبوك</span>
          <span className="text-[10px] text-gray-400">تابع عروضنا وجديدنا</span>
        </a>

        {/* Instagram */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 rounded-2xl border border-surface bg-pink-950/20 p-4 text-center transition-all duration-300 hover:border-pink-500/50 hover:bg-pink-950/30 hover:scale-[1.03]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
            <Instagram size={24} />
          </span>
          <span className="text-xs font-bold text-white">إنستغرام</span>
          <span className="text-[10px] text-gray-400">شاهد أشهى الأطباق</span>
        </a>

        {/* TikTok */}
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 rounded-2xl border border-surface bg-gray-950/40 p-4 text-center transition-all duration-300 hover:border-white/20 hover:bg-gray-950/60 hover:scale-[1.03]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
            <TikTokIcon size={22} />
          </span>
          <span className="text-xs font-bold text-white">تيك توك</span>
          <span className="text-[10px] text-gray-400">فيديوهات من كواليسنا</span>
        </a>
      </div>

      {/* 📍 Branches Section */}
      <h3 className="mb-3 mt-8 text-lg font-bold text-ivory">فروعنا</h3>
      <div className="flex flex-col gap-3">
        {branches.map((b) => (
          <div
            key={b.name}
            className="rounded-2xl border border-surface bg-surface/30 p-4 transition-all duration-300 hover:border-gold-bright/30"
          >
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={18} className="text-gold-bright" />
              <p className="text-sm font-bold text-ivory">{b.name}</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">{b.address}</p>
            <a
              href={`tel:${b.phone}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gold-bright/10 hover:bg-gold-bright/20 border border-gold-bright/20 px-3 py-1.5 text-xs font-bold text-gold-bright transition-all"
              dir="ltr"
            >
              <Phone size={14} />
              {b.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}