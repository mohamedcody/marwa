import { Clock, Mail, MapPin, Phone } from 'lucide-react';

const branches = [
  { name: 'فرع وسط البلد', address: 'شارع طلعت حرب، وسط البلد', phone: '01000000001' },
  { name: 'فرع المعادي', address: 'شارع 9، المعادي', phone: '01000000002' },
  { name: 'فرع مدينة نصر', address: 'شارع مكرم عبيد، مدينة نصر', phone: '01000000003' },
];

export default function ContactPage() {
  return (
    <div className="px-4 pb-4">
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
            <p className="text-base text-ivory" dir="ltr">0100 000 0000</p>
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
            <p className="text-base text-ivory" dir="ltr">info@marwa-restaurant.eg</p>
          </div>
        </a>

        <div className="flex items-center gap-3 rounded-2xl border border-surface bg-surface/50 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-maroon)]/30">
            <Clock size={20} className="text-[var(--color-gold-bright)]" />
          </span>
          <div>
            <p className="text-sm text-muted">مواعيد العمل</p>
            <p className="text-base text-ivory">يومياً 6ص - 12ص</p>
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
