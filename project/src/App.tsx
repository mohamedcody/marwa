import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import type { PageId } from './components/navItems';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';

/**
 * أنيميشن الصفحات — fade + slide up ناعم
 */
const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.35,
};

/**
 * المكون الرئيسي للتطبيق (App Component).
 * يدير التنقل بين صفحات الموقع وتحديث العناوين والهيدر/الفوتر.
 * النسخة الثابتة (Static) — بدون Admin ولا Backend.
 */
export default function App() {
  // حالة الصفحة الحالية (الافتراضية: الصفحة الرئيسية)
  const [page, setPage] = useState<PageId>('home');

  /**
   * دالة التنقل بين الصفحات مع التمرير التلقائي لأعلى الصفحة
   */
  const navigate = (next: PageId) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // تحديث عنوان تبويب المتصفح (Title) تلقائياً بحسب الصفحة النشطة
  useEffect(() => {
    const titles: Record<PageId, string> = {
      home: 'مطعم المروة | طعم أصيل من قلب القاهرة',
      menu: 'المنيو | مطعم المروة',
      photos: 'صور المطعم | مطعم المروة',
      videos: 'فيديوهات | مطعم المروة',
      team: 'فروع المطعم | مطعم المروة',
      contact: 'تواصل معنا | مطعم المروة',
    };
    document.title = titles[page];
  }, [page]);

  // تحديد ما إذا كانت الصفحة الحالية تعتمد ملء الشاشة (مثل صفحة الفيديوهات) لإخفاء الهيدر وشريط التنقل السفلي
  const isFullscreenPage = page === 'videos';

  /**
   * عرض محتوى الصفحة النشطة داخل motion wrapper للأنيميشن
   */
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'menu':
        return <MenuPage />;
      case 'photos':
        return <PhotosPage />;
      case 'videos':
        return <VideosPage />;
      case 'team':
        return <TeamPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#12211d]">
      {/* عرض الهيدر العلوي في جميع الصفحات ما عدا الفيديوهات */}
      {!isFullscreenPage && (
        <Header
          current={page}
          onNavigate={navigate}
        />
      )}

      {/* منطقة عرض محتوى الصفحة النشطة مع Page Transition Animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      {/* عرض شريط التنقل السفلي للهواتف في جميع الصفحات ما عدا الفيديوهات */}
      {!isFullscreenPage && <BottomNav current={page} onNavigate={navigate} />}
    </div>
  );
}
