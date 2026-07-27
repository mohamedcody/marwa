import { useEffect, useState } from 'react';
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
 * المكون الرئيسي للتطبيق (App Component).
 * يدير التنقل بين صفحات الموقع، حالة لوحة تحكم المسؤول (Admin Modal)، وتحديث العناوين والهيدر/الفوتر.
 */
export default function App() {
  // حالة الصفحة الحالية (الافتراضية: الصفحة الرئيسية)
  const [page, setPage] = useState<PageId>('home');
  // حالة فتح/إغلاق نافذة لوحة تحكم المسؤول (Admin Modal)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  // مفتاح لتحديث البيانات بعد إجراء تعديلات من قبل المسؤول
  const [refreshKey, setRefreshKey] = useState(0);
  // حالة العنصر المختار للتعديل في قائمة الطعام
  const [editMenuItem, setEditMenuItem] = useState<MenuItemData | null>(null);

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
      team: 'فريق العمل | مطعم المروة',
      contact: 'تواصل معنا | مطعم المروة',
    };
    document.title = titles[page];
  }, [page]);

  // تحديد ما إذا كانت الصفحة الحالية تعتمد ملء الشاشة (مثل صفحة الفيديوهات) لإخفاء الهيدر وشريط التنقل السفلي
  const isFullscreenPage = page === 'videos';

  return (
    <div className="min-h-screen bg-[#12211d]">
      {/* عرض الهيدر العلوي في جميع الصفحات ما عدا الفيديوهات */}
      {!isFullscreenPage && (
        <Header
          current={page}
          onNavigate={navigate}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* منطقة عرض محتوى الصفحة النشطة */}
      <main key={refreshKey}>
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'menu' && (
          <MenuPage
            onEditItem={(item) => {
              setEditMenuItem(item);
              setIsAdminOpen(true);
            }}
          />
        )}
        {page === 'photos' && <PhotosPage />}
        {page === 'videos' && <VideosPage />}
        {page === 'team' && <TeamPage />}
        {page === 'contact' && <ContactPage />}
      </main>

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
        onRefreshData={handleRefreshData}
      />
    </div>
  );
}

