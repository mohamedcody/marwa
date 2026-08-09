import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import AdminModal from './components/AdminModal';
import type { PageId } from './components/navItems';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import { MenuItemData } from './services/api';

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
 * يدير التنقل بين صفحات الموقع، حالة لوحة تحكم المسؤول (Admin Modal)، وتحديث العناوين والهيدر/الفوتر.
 * تم ترقيته لدعم Page Transitions باستخدام Framer Motion.
 */
export default function App() {
  // حالة الصفحة الحالية (الافتراضية: الصفحة الرئيسية)
  const [page, setPage] = useState<PageId>('home');
  // حالة فتح/إغلاق نافذة لوحة تحكم المسؤول (Admin Modal)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // تبويب لوحة تحكم المسؤول النشط افتراضياً عند الفتح
  const [adminTab, setAdminTab] = useState<'menu' | 'photos' | 'videos' | 'info'>('menu');
  // مفتاح لتحديث البيانات بعد إجراء تعديلات من قبل المسؤول
  const [refreshKey, setRefreshKey] = useState(0);
  // حالة العنصر المختار للتعديل في قائمة الطعام
  const [editMenuItem, setEditMenuItem] = useState<MenuItemData | null>(null);

  /**
   * دالة فتح لوحة التحكم مع تبويب محدد
   */
  const openAdminWithTab = (tab: 'menu' | 'photos' | 'videos' | 'info') => {
    setAdminTab(tab);
    setIsAdminOpen(true);
  };

  /**
   * دالة التنقل بين الصفحات مع التمرير التلقائي لأعلى الصفحة
   */
  const navigate = (next: PageId) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  /**
   * دالة إعادة تحميل بيانات الصفحات عند إضافة أو حذف عنصر من لوحة التحكم
   */
  const handleRefreshData = () => {
    setRefreshKey((prev) => prev + 1);
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
        return (
          <MenuPage
            onEditItem={(item) => {
              setEditMenuItem(item);
              setIsAdminOpen(true);
            }}
            onAddItem={() => openAdminWithTab('menu')}
          />
        );
      case 'photos':
        return <PhotosPage onAddPhoto={() => openAdminWithTab('photos')} />;
      case 'videos':
        return <VideosPage onAddVideo={() => openAdminWithTab('videos')} />;
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
          onOpenAdmin={() => openAdminWithTab('menu')}
        />
      )}

      {/* منطقة عرض محتوى الصفحة النشطة مع Page Transition Animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={`${page}-${refreshKey}`}
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

      {/* النافذة المنبثقة لـ لوحة تحكم المسؤول (إضافة/حذف صور وأصناف المنيو) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setEditMenuItem(null);
        }}
        editMenuItem={editMenuItem}
        defaultTab={adminTab}
        onRefreshData={handleRefreshData}
      />
    </div>
  );
}

