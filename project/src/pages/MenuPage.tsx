import { useState } from 'react';
import { menuCategories } from '../data/menu';

export default function MenuPage() {
  const [activeCat, setActiveCat] = useState(menuCategories[0].id);

  const current = menuCategories.find((c) => c.id === activeCat) ?? menuCategories[0];

  return (
    <div className="pb-4">
      {/* Hero image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src="/images/Pasted_image.png"
          alt="قائمة الطعام"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[#12211d]" />
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <h2 className="font-display text-2xl text-[var(--color-gold)]">قائمة الطعام</h2>
        </div>
      </div>

      <div className="px-4">
      <div className="pt-4" />

      {/* Category tabs */}
      <div className="sticky top-16 z-30 -mx-4 mb-4 bg-[#12211d]/90 px-4 py-3 backdrop-blur-md">
        <div className="flex gap-2">
          {menuCategories.map((cat) => {
            const active = cat.id === activeCat;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  active
                    ? 'bg-[var(--color-gold)] text-[#12211d]'
                    : 'border border-surface text-muted'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <ul className="flex flex-col gap-3">
        {current.items.map((item, idx) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-surface bg-surface/50 p-4 transition-colors hover:border-[var(--color-gold)]/40"
            style={{ animation: `fadeInUp 0.4s ease ${idx * 0.05}s both` }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-maroon)]/30 text-sm font-bold text-[var(--color-gold-bright)]">
                {idx + 1}
              </span>
              <span className="text-base text-ivory">{item.name}</span>
            </div>
            <span className="font-display text-lg text-gold-bright">
              {item.price} <span className="text-xs text-muted">ج.م</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-xs text-muted">
        الأسعار شاملة الضريبة. متاح التوصيل والتوصيل السريع.
      </p>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </div>
  );
}
