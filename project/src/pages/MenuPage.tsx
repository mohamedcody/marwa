import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { menuCategories } from '../data/menu';

/**
 * صفحة المنيو الثابتة (Static MenuPage).
 * بتعرض أصناف المنيو من ملف data/menu.ts مباشرة — بدون API أو Admin.
 */
export default function MenuPage() {
  const [activeCat, setActiveCat] = useState('orders');
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [listKey, setListKey] = useState(0);

  const categories = menuCategories;

  const handleCategoryChange = (catId: string) => {
    const currentIndex = categories.findIndex((c) => c.id === activeCat);
    const nextIndex = categories.findIndex((c) => c.id === catId);
    setSlideDir(nextIndex > currentIndex ? 'left' : 'right');
    setListKey(k => k + 1);
    setActiveCat(catId);
  };

  const current = categories.find((c) => c.id === activeCat) ?? categories[0];

  return (
    <div className="menu-page-root">

      {/* ══════════ HEADER ══════════ */}
      <header className="menu-header">
        <div className="menu-header-blob1" />
        <div className="menu-header-blob2" />
        <div className="menu-header-content">
          <div className="menu-header-eyebrow">المطعم · القائمة</div>
          <h1 className="menu-header-title">قائمة الطعام</h1>
          <p className="menu-header-sub">اختر من أشهى الأطباق التي يقدمها مطعم المروة</p>
          <div className="menu-header-line">
            <span className="menu-header-diamond">◆</span>
          </div>
        </div>
      </header>

      {/* ══════════ CATEGORY TABS ══════════ */}
      <div className="menu-tabs-wrap">
        <div className="menu-tabs">
          {categories.map((cat) => {
            const active = cat.id === activeCat;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`menu-tab ${active ? 'menu-tab--active' : ''}`}
              >
                {active && <span className="menu-tab-shimmer" />}
                {cat.label}
                {active && <span className="menu-tab-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div className="menu-body">

        {/* Empty State */}
        {current.items.length === 0 && (
          <div className="menu-empty" style={{ animation: 'menuFadeUp 0.5s ease both' }}>
            <div className="menu-empty-icon">
              <UtensilsCrossed size={32} />
            </div>
            <h3>لا توجد أصناف حالياً</h3>
            <p>لم يتم إضافة أصناف لهذا القسم بعد.</p>
          </div>
        )}

        {/* Items */}
        {current.items.length > 0 && (
          <ul
            key={listKey}
            className="menu-list"
            style={{ animation: `${slideDir === 'left' ? 'menuSlideLeft' : 'menuSlideRight'} 0.35s cubic-bezier(0.22,1,0.36,1) both` }}
          >
            {current.items.map((item, idx) => (
              <li
                key={item.id}
                className="menu-card"
                style={{ animation: `menuCardPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.055}s both` }}
              >
                {/* Image / Placeholder */}
                <div className="menu-card-img-wrap">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="menu-card-img" loading="lazy" />
                  ) : (
                    <div className="menu-card-img-placeholder">
                      <UtensilsCrossed size={18} />
                    </div>
                  )}
                  <span className="menu-card-num">{idx + 1}</span>
                </div>

                {/* Info */}
                <div className="menu-card-info">
                  <h4 className="menu-card-name">{item.name}</h4>
                  {item.description && (
                    <p className="menu-card-desc">{item.description}</p>
                  )}
                </div>

                {/* Price */}
                <div className="menu-card-right">
                  <span className="menu-card-price">
                    {item.price}
                    <small>ج.م</small>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="menu-footer-note">الأسعار شاملة الضريبة · متاح التوصيل والتوصيل السريع</p>
      </div>

      {/* ══════════ STYLES ══════════ */}
      <style>{`

        /* ─── Root ─── */
        .menu-page-root {
          padding-bottom: 100px;
          min-height: 100vh;
        }

        /* ─── Header ─── */
        .menu-header {
          position: relative;
          overflow: hidden;
          padding: 32px 20px 28px;
          text-align: center;
          background: linear-gradient(180deg, rgba(18,33,29,0) 0%, rgba(18,33,29,0.6) 100%);
          animation: menuFadeDown 0.6s ease both;
        }
        .menu-header-blob1 {
          position: absolute; top: -30px; right: -20px;
          width: 160px; height: 160px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,162,39,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .menu-header-blob2 {
          position: absolute; bottom: -20px; left: -20px;
          width: 120px; height: 120px; border-radius: 50%;
          background: radial-gradient(circle, rgba(122,39,49,0.22) 0%, transparent 70%);
          pointer-events: none;
        }
        .menu-header-content { position: relative; z-index: 1; }

        .menu-header-eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9A227;
          background: rgba(201,162,39,0.12);
          border: 1px solid rgba(201,162,39,0.25);
          border-radius: 999px;
          padding: 3px 14px;
          margin-bottom: 14px;
          animation: menuFadeDown 0.5s ease 0.1s both;
        }
        .menu-header-title {
          font-family: var(--font-display);
          font-size: 2.1rem;
          font-weight: 400;
          color: #F3E9D2;
          line-height: 1.2;
          margin-bottom: 8px;
          animation: menuFadeDown 0.5s ease 0.15s both;
        }
        .menu-header-sub {
          font-size: 0.82rem;
          color: #A9A08C;
          max-width: 260px;
          margin: 0 auto 18px;
          line-height: 1.7;
          animation: menuFadeDown 0.5s ease 0.2s both;
        }
        .menu-header-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          animation: menuFadeDown 0.5s ease 0.28s both;
        }
        .menu-header-line::before,
        .menu-header-line::after {
          content: '';
          display: block;
          height: 1px;
          width: 60px;
          background: linear-gradient(to right, transparent, rgba(201,162,39,0.5), transparent);
        }
        .menu-header-diamond {
          color: #C9A227;
          font-size: 0.55rem;
          opacity: 0.8;
        }

        /* ─── Category Tabs ─── */
        .menu-tabs-wrap {
          position: sticky;
          top: 64px;
          z-index: 30;
          padding: 10px 16px;
          background: rgba(18,33,29,0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(44,65,54,0.5);
          animation: menuSlideDown 0.5s ease 0.1s both;
        }
        .menu-tabs {
          display: flex;
          gap: 8px;
        }
        .menu-tab {
          position: relative;
          flex: 1;
          overflow: hidden;
          padding: 9px 16px;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 700;
          font-family: var(--font-body);
          border: 1.5px solid rgba(44,65,54,0.8);
          color: #A9A08C;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .menu-tab:hover:not(.menu-tab--active) {
          border-color: rgba(201,162,39,0.4);
          color: #F3E9D2;
        }
        .menu-tab--active {
          background: linear-gradient(135deg, #C9A227 0%, #E4C566 100%);
          border-color: transparent;
          color: #12211D;
          box-shadow: 0 4px 16px rgba(201,162,39,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .menu-tab-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
          animation: menuShimmer 2.5s ease infinite;
          pointer-events: none;
        }
        .menu-tab-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(18,33,29,0.5);
          flex-shrink: 0;
        }

        /* ─── Body ─── */
        .menu-body {
          padding: 16px 14px 0;
        }

        /* ─── List ─── */
        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
          padding: 0; margin: 0;
        }

        /* ─── Card ─── */
        .menu-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 13px;
          border-radius: 20px;
          background: rgba(28,46,36,0.55);
          border: 1px solid rgba(44,65,54,0.7);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          cursor: default;
        }
        .menu-card:hover {
          background: rgba(28,46,36,0.8);
          border-color: rgba(201,162,39,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        }

        /* Image */
        .menu-card-img-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .menu-card-img {
          width: 64px; height: 64px;
          border-radius: 14px;
          object-fit: cover;
          border: 1px solid rgba(44,65,54,0.8);
          transition: transform 0.3s ease;
        }
        .menu-card:hover .menu-card-img { transform: scale(1.06); }
        .menu-card-img-placeholder {
          width: 64px; height: 64px;
          border-radius: 14px;
          background: rgba(18,33,29,0.8);
          border: 1px solid rgba(44,65,54,0.6);
          display: flex; align-items: center; justify-content: center;
          color: rgba(169,160,140,0.35);
        }
        .menu-card-num {
          position: absolute;
          top: -6px; right: -6px;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(201,162,39,0.2);
          border: 1px solid rgba(201,162,39,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          font-weight: 800;
          color: #C9A227;
          line-height: 1;
        }

        /* Info */
        .menu-card-info { flex: 1; min-width: 0; }
        .menu-card-name {
          font-size: 0.93rem;
          font-weight: 700;
          color: #F3E9D2;
          margin-bottom: 4px;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .menu-card-desc {
          font-size: 0.73rem;
          color: #A9A08C;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Price */
        .menu-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }
        .menu-card-price {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: #E4C566;
          white-space: nowrap;
          display: flex; align-items: baseline; gap: 3px;
        }
        .menu-card-price small {
          font-family: var(--font-body);
          font-size: 0.65rem;
          color: #A9A08C;
          font-weight: 400;
        }

        /* ─── Empty ─── */
        .menu-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 20px; text-align: center;
        }
        .menu-empty-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(28,46,36,0.6);
          border: 1px solid rgba(44,65,54,0.5);
          display: flex; align-items: center; justify-content: center;
          color: #A9A08C;
          margin-bottom: 16px;
        }
        .menu-empty h3 { font-size: 1.05rem; color: #F3E9D2; margin-bottom: 6px; }
        .menu-empty p  { font-size: 0.82rem; color: #A9A08C; max-width: 240px; }

        /* ─── Footer Note ─── */
        .menu-footer-note {
          margin-top: 28px;
          text-align: center;
          font-size: 0.72rem;
          color: rgba(169,160,140,0.5);
          padding-bottom: 8px;
        }

        /* ─── Keyframes ─── */
        @keyframes menuFadeDown {
          from { opacity: 0; transform: translateY(-14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menuCardPop {
          from { opacity: 0; transform: scale(0.91) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes menuSlideLeft {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes menuSlideRight {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes menuShimmer {
          from { transform: translateX(-120%); }
          to   { transform: translateX(220%); }
        }
      `}</style>
    </div>
  );
}
