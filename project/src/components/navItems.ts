import { Home, BookOpen, Image, Video, Users, Phone } from 'lucide-react';

export type PageId = 'home' | 'menu' | 'photos' | 'videos' | 'team' | 'contact';

export const navItems: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'menu', label: 'المنيو', icon: BookOpen },
  { id: 'photos', label: 'صور', icon: Image },
  { id: 'videos', label: 'فيديوهات', icon: Video },
  { id: 'team', label: 'الفريق', icon: Users },
  { id: 'contact', label: 'تواصل', icon: Phone },
];
