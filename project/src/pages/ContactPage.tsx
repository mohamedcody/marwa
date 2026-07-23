import { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone, X } from 'lucide-react';

// عدّل اللينكات دي بلينكاتك الحقيقية
const socialLinks = {
  whatsapp: 'https://wa.me/201004851243', // رقم فرع المرج الغربية — غيّره لو عايز رقم تاني
  facebook: 'https://facebook.com/your-page',
  tiktok: 'https://tiktok.com/@your-page',
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.48 1.28 4.94L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0012.04 2zm0 18.16a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 01-1.26-4.38c0-4.53 3.68-8.22 8.24-8.22a8.2 8.2 0 015.83 2.41 8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.22-8.24 8.22zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M22 12a10 10 0 10-11.5 9.95v-7.04H7.9V12h2.6V9.8c0-2.56 1.52-3.98 3.85-3.98 1.11 0 2.28.2 2.28.2v2.5h-1.29c-1.27 0-1.66.79-1.66 1.6V12h2.83l-.45 2.91h-2.38v7.04A10 10 0 0022 12z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.59 2.59 0 11-1.83-2.48V9.66a5.42 5.42 0 105.42 5.42V8.79a7.63 7.63 0 004.39 1.39V7.09a4.28 4.28 0 01-3.83-1.27z" />
    </svg>
  );
}

function FloatingSocialButton() {
  const [open, setOpen] = useState(false);

  const items = [
    { key: 'whatsapp', href: socialLinks.whatsapp, bg: '#25D366', icon: <WhatsAppIcon /> },
    { key: 'facebook', href: socialLinks.facebook, bg: '#1877F2', icon: <FacebookIcon /> },
    { key: 'tiktok', href: socialLinks.tiktok, bg: '#000000', icon: <TikTokIcon /> },
  ];

  return (
    <div className="fixed bottom-24 left-4 z-40 flex flex-col-reverse items-center gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'إغلاق' : 'تواصل معنا عبر السوشيال ميديا'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-gold)] text-[#12211d] shadow-xl transition-transform active:scale-90"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {items.map((item, i) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-out"
          style={{
            backgroundColor: item.bg,
            transitionDelay: open ? `${i * 60}ms` : '0ms',
            transform: open ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(16px)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          }}
          aria-label={item.key}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

const branches = [
  { name: 'المرج الشرقية', address: ' بجوار نادي المرج', phone: '01288722713' },
  { name: 'المرج الغربية', address: 'بجوار مدرسه العين خاصه', phone: '01004851243' },
  { name: 'المرج الغربية', address: 'بجوار شارع العدل ', phone: '01507379992' },
];

export default function ContactPage() {
  return (
    <div className="px-4 pb-32">
      <FloatingSocialButton />
      <div className="pt-20" />
      <h2 className="mb-2 text-2xl text-ivory">تواصل <span className="text-gold-bright">معنا</span></h2>
      <p className="mb-6 text-sm text-muted">يسعدنا خدمتك في أي وقت</p>

      {/* Contact info */}
      <div className="flex flex-col gap-3">
        <a
          href="tel:01000000000"
          className="flex items-center gap-3 rounded-2xl border border-surface bg-surface/50 p-4 transition-colors hover:border-[var(--color-gold)]/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-maroon)]/30">
            <Phone size={20} className="text-[var(--color-gold-bright)]" />
          </span>
          <div>
            <p className="text-sm text-muted">اتصل بنا</p>
            <p className="text-base text-ivory" dir="ltr">01221365286</p>
          </div>
        </a>

        <a
          href="mailto:info@marwa-restaurant.eg"
          className="flex items-center gap-3 rounded-2xl border border-surface bg-surface/50 p-4 transition-colors hover:border-[var(--color-gold)]/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-maroon)]/30">
            <Mail size={20} className="text-[var(--color-gold-bright)]" />
          </span>
          <div>
            <p className="text-sm text-muted">راسلنا</p>
            <p className="text-base text-ivory" dir="ltr">marwa-restaurant.eg@gmail.com</p>
          </div>
        </a>

        <div className="flex items-center gap-3 rounded-2xl border border-surface bg-surface/50 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-maroon)]/30">
            <Clock size={20} className="text-[var(--color-gold-bright)]" />
          </span>
          <div>
            <p className="text-sm text-muted">مواعيد العمل</p>
            <p className="text-base text-ivory">يومياً4ص - 4م</p>
          </div>
        </div>
      </div>

      {/* Branches */}
      <h3 className="mb-3 mt-8 text-lg text-ivory">فروعنا</h3>
      <div className="flex flex-col gap-3">
        {branches.map((b) => (
          <div key={b.name} className="rounded-2xl border border-surface bg-surface/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPin size={18} className="text-[var(--color-gold-bright)]" />
              <p className="text-base text-ivory">{b.name}</p>
            </div>
            <p className="text-sm text-muted">{b.address}</p>
            <a
              href={`tel:${b.phone}`}
              className="mt-1 inline-block text-xs text-gold-bright"
              dir="ltr"
            >
              {b.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}