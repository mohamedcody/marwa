import { useEffect, useState } from 'react';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import type { PageId } from './components/navItems';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [page, setPage] = useState<PageId>('home');

  const navigate = (next: PageId) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Update document title per page
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

  const isFullscreenPage = page === 'videos';

  return (
    <div className="min-h-screen bg-[#12211d]">
      {!isFullscreenPage && <Header current={page} onNavigate={navigate} />}

      <main>
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'menu' && <MenuPage />}
        {page === 'photos' && <PhotosPage />}
        {page === 'videos' && <VideosPage />}
        {page === 'team' && <TeamPage />}
        {page === 'contact' && <ContactPage />}
      </main>

      {!isFullscreenPage && <BottomNav current={page} onNavigate={navigate} />}
    </div>
  );
}
