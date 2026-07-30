import { useState, useEffect } from 'react';
import { KeyRound, LogOut, Upload, Plus, X, Check, Image as ImageIcon, Video, Edit2, Info } from 'lucide-react';
import {
  loginAdmin,
  isAdminLoggedIn,
  removeAdminToken,
  uploadImageFile,
  uploadFileAPI,
  addPhotoAPI,
  addMenuItemAPI,
  updateMenuItemAPI,
  addVideoAPI,
  MenuItemData,
  fetchRestaurantInfo,
  updateRestaurantInfoAPI,
} from '../services/api';

/**
 * الخصائص (Props) الخاصة بمكون لوحة تحكم الأدمن (Admin Modal)
 */
interface AdminModalProps {
  isOpen: boolean; // هل النافذة المنبثقة مفتوحة أم مغلقة
  onClose: () => void; // دالة إغلاق النافذة
  onRefreshData?: () => void; // دالة تحديث بيانات المعرض أو المنيو بعد الإضافة
  editMenuItem?: MenuItemData | null; // الصنف المختار للتعديل (في حالة وضع التعديل)
  defaultTab?: 'menu' | 'photos' | 'videos' | 'info'; // التبويب الافتراضي عند فتح اللوحة
}

/**
 * مكون النافذة المنبثقة لـ لوحة تحكم الأدمن (AdminModal Component).
 */
export default function AdminModal({ isOpen, onClose, onRefreshData, editMenuItem, defaultTab }: AdminModalProps) {
  // حالات تسجل الدخول وحفظ التوكن
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // حالات نموذج رفع الصور المعرض
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoStatus, setPhotoStatus] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoCategory, setPhotoCategory] = useState('general');
  const [isCoverImage, setIsCoverImage] = useState(false);

  // حالات نموذج إضافة/تعديل صنف للمنيو
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuCategory, setMenuCategory] = useState('orders');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuImageUrlInput, setMenuImageUrlInput] = useState('');
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [menuPreviewUrl, setMenuPreviewUrl] = useState<string | null>(null);
  const [menuStatus, setMenuStatus] = useState('');

  // حالات نموذج نشر فيديو جديد
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoStatus, setVideoStatus] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // حالة التبويب النشط في لوحة التحكم
  const [activeTab, setActiveTab] = useState<'menu' | 'photos' | 'videos' | 'info'>('menu');

  // تعيين التبويب النشط بناء على التبويب الافتراضي الممرر عند فتح المودال
  useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // حالات نموذج معلومات المطعم
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDesc, setRestaurantDesc] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantPhone, setRestaurantPhone] = useState('');
  const [restaurantEmail, setRestaurantEmail] = useState('');
  const [restaurantWorkingHours, setRestaurantWorkingHours] = useState('');
  const [restaurantFacebook, setRestaurantFacebook] = useState('');
  const [restaurantInstagram, setRestaurantInstagram] = useState('');
  const [restaurantInfoStatus, setRestaurantInfoStatus] = useState('');

  // مراقبة وضع التعديل وتعبئة النموذج
  useEffect(() => {
    if (editMenuItem) {
      setMenuName(editMenuItem.name);
      setMenuPrice(editMenuItem.price.toString());
      setMenuCategory(editMenuItem.categoryId || 'orders');
      setMenuDescription(editMenuItem.description || '');
      setMenuImageUrlInput(editMenuItem.imageUrl || '');
      setMenuPreviewUrl(editMenuItem.imageUrl || null);
    } else {
      setMenuName('');
      setMenuPrice('');
      setMenuCategory('orders');
      setMenuDescription('');
      setMenuImageUrlInput('');
      setMenuPreviewUrl(null);
    }
  }, [editMenuItem]);

  // جلب معلومات المطعم عند فتح المودال كمسؤول
  useEffect(() => {
    if (loggedIn && isOpen) {
      const loadInfo = async () => {
        const info = await fetchRestaurantInfo();
        if (info) {
          setRestaurantName(info.name);
          setRestaurantDesc(info.description || '');
          setRestaurantAddress(info.address || '');
          setRestaurantPhone(info.phoneNumber || '');
          setRestaurantEmail(info.email || '');
          setRestaurantWorkingHours(info.workingHours || '');
          setRestaurantFacebook(info.facebookUrl || '');
          setRestaurantInstagram(info.instagramUrl || '');
        }
      };
      loadInfo();
    }
  }, [loggedIn, isOpen]);

  // إعادة ضبط حقول تسجيل الدخول عند فتح/إغلاق النافذة لمنع بقاء البيانات أو الملء التلقائي غير المرغوب
  useEffect(() => {
    setUsername('');
    setPassword('');
    setAuthError('');
  }, [isOpen]);

  if (!isOpen) return null;

  /**
   * معالجة تسجيل دخول المسؤول برقم الموبايل المعتمد
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const res = await loginAdmin(username, password);
    setLoading(false);

    if (res.success) {
      setLoggedIn(true);
      if (onRefreshData) onRefreshData();
    } else {
      setAuthError(res.message || 'عذراً، كلمة المرور أو الهاتف غير صحيح');
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    setLoggedIn(false);
    if (onRefreshData) onRefreshData();
  };

  // معالجة اختيار ملف صورة للمعرض وإتاحة معاينتها
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPhotoFile(file);
    if (file) {
      setPhotoPreviewUrl(URL.createObjectURL(file));
    } else {
      setPhotoPreviewUrl(null);
    }
  };

  // معالجة اختيار ملف صورة للمنيو وإتاحة معاينتها
  const handleMenuFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setMenuFile(file);
    if (file) {
      setMenuPreviewUrl(URL.createObjectURL(file));
    } else {
      setMenuPreviewUrl(null);
    }
  };

  // معالجة اختيار ملف فيديو وإتاحة معاينته
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setVideoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      if (!videoTitle.trim()) {
        const nameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setVideoTitle(nameWithoutExtension);
      }
    } else {
      setVideoPreviewUrl(null);
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoCaption.trim()) {
      setPhotoStatus('يرجى كتابة وصف للصورة');
      return;
    }

    setLoading(true);
    setPhotoStatus('جاري الحفظ...');

    let finalSrc = photoUrlInput;

    if (photoFile) {
      const uploadedUrl = await uploadImageFile(photoFile);
      if (uploadedUrl) {
        finalSrc = uploadedUrl;
      } else {
        setPhotoStatus('فشل رفع ملف الصورة على الباك اند');
        setLoading(false);
        return;
      }
    }

    if (!finalSrc) {
      setPhotoStatus('يرجى اختيار صورة من جهازك أو وضع رابط صورة');
      setLoading(false);
      return;
    }

    const finalCategory = isCoverImage ? `${photoCategory}_cover` : photoCategory;
    const result = await addPhotoAPI(photoCaption, finalSrc, finalCategory);
    setLoading(false);

    if (result) {
      setPhotoStatus('✅ تم إضافة الصورة بنجاح!');
      setPhotoCaption('');
      setPhotoFile(null);
      setPhotoUrlInput('');
      setPhotoPreviewUrl(null);
      setPhotoCategory('general');
      setIsCoverImage(false);
      if (onRefreshData) onRefreshData();
    } else {
      setPhotoStatus('⚠️ فشل حفظ الصورة (تأكد من تشغيل الباك اند)');
    }
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim() || !menuPrice) {
      setMenuStatus('يرجى ملء الاسم والسعر');
      return;
    }

    setLoading(true);
    setMenuStatus(editMenuItem ? 'جاري التحديث...' : 'جاري الإضافة...');

    let finalSrc = menuImageUrlInput;

    if (menuFile) {
      const uploadedUrl = await uploadImageFile(menuFile);
      if (uploadedUrl) {
        finalSrc = uploadedUrl;
      } else {
        setMenuStatus('فشل رفع ملف الصورة على الباك اند');
        setLoading(false);
        return;
      }
    }

    const priceNum = parseFloat(menuPrice);
    let result;
    if (editMenuItem) {
      result = await updateMenuItemAPI(editMenuItem.id, menuName, priceNum, menuCategory, menuDescription, finalSrc);
    } else {
      result = await addMenuItemAPI(menuName, priceNum, menuCategory, menuDescription, finalSrc);
    }
    setLoading(false);

    if (result) {
      setMenuStatus(editMenuItem ? '✅ تم تحديث الصنف بنجاح!' : '✅ تم إضافة الصنف للمنيو بنجاح!');
      if (!editMenuItem) {
        setMenuName('');
        setMenuPrice('');
        setMenuDescription('');
        setMenuImageUrlInput('');
        setMenuFile(null);
        setMenuPreviewUrl(null);
      }
      if (onRefreshData) onRefreshData();
    } else {
      setMenuStatus('⚠️ فشل حفظ الصنف (تأكد من تشغيل الباك اند)');
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      setVideoStatus('يرجى كتابة عنوان للفيديو');
      return;
    }

    setLoading(true);
    setVideoStatus('جاري النشر...');

    let finalUrl = videoUrl;

    if (videoFile) {
      const uploadedUrl = await uploadFileAPI(videoFile);
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      } else {
        setVideoStatus('⚠️ فشل رفع ملف الفيديو على الباك اند');
        setLoading(false);
        return;
      }
    }

    if (!finalUrl.trim()) {
      setVideoStatus('يرجى اختيار فيديو من جهازك أو وضع رابط فيديو');
      setLoading(false);
      return;
    }

    const result = await addVideoAPI(videoTitle, finalUrl, videoDesc);
    setLoading(false);

    if (result) {
      setVideoStatus('✅ تم نشر الفيديو بنجاح!');
      setVideoTitle('');
      setVideoUrl('');
      setVideoDesc('');
      setVideoFile(null);
      setVideoPreviewUrl(null);
      if (onRefreshData) onRefreshData();
    } else {
      setVideoStatus('⚠️ فشل نشر الفيديو (تأكد من تشغيل الباك اند)');
    }
  };

  const handleUpdateRestaurantInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRestaurantInfoStatus('جاري حفظ التعديلات...');

    const result = await updateRestaurantInfoAPI({
      name: restaurantName,
      description: restaurantDesc,
      address: restaurantAddress,
      phoneNumber: restaurantPhone,
      email: restaurantEmail,
      workingHours: restaurantWorkingHours,
      facebookUrl: restaurantFacebook,
      instagramUrl: restaurantInstagram,
    });
    setLoading(false);

    if (result) {
      setRestaurantInfoStatus('✅ تم حفظ معلومات المطعم بنجاح!');
      if (onRefreshData) onRefreshData();
    } else {
      setRestaurantInfoStatus('⚠️ فشل التحديث (تأكد من تشغيل الباك اند)');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#C9A227]/25 bg-gradient-to-b from-[#1a2e24] to-[#12211d] p-6 text-ivory shadow-2xl shadow-black/60" style={{boxShadow:'0 0 40px rgba(201,162,39,0.08), 0 25px 50px rgba(0,0,0,0.6)'}}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C9A227]/15 pb-4 mb-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/25">
              <KeyRound className="text-[#C9A227]" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3E9D2] leading-none">
                {editMenuItem ? 'تعديل صنف' : 'لوحة تحكم المروة'}
              </h3>
              <p className="text-[10px] text-[#A9A08C] mt-0.5">Admin Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C2E24] text-[#A9A08C] hover:bg-[#2C4136] hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        {!loggedIn ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="mt-6 space-y-4" dir="rtl" autoComplete="off">
            <p className="text-sm text-gray-300">
              الرجاء إدخال رقم الهاتف وكلمة المرور للوصول إلى صلاحيات الإدارة ولوحة التحكم.
            </p>
            {authError && (
              <div className="rounded-lg bg-red-900/30 p-3 text-xs text-red-200 border border-red-700/40">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs text-gold-bright mb-1.5 font-bold">رقم الهاتف</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل رقم الهاتف المسجل (مثال: 01000000000)"
                className="w-full rounded-xl border border-surface bg-[#0a1412] px-4 py-2.5 text-sm text-white focus:border-gold-bright focus:outline-none"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-bold">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور الخاصة بك"
                className="w-full rounded-xl border border-surface bg-[#0a1412] px-4 py-2.5 text-sm text-white focus:border-gold-bright focus:outline-none"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C566] py-3 text-sm font-bold text-[#12211d] shadow-lg shadow-[#C9A227]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'جاري تسجيل الدخول...' : '🔐 تسجيل الدخول'}
            </button>
          </form>
        ) : (
          /* Logged In Admin Actions */
          <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1" dir="rtl">
            {/* Top Logged Status */}
            <div className="flex items-center justify-between rounded-2xl bg-emerald-900/20 border border-emerald-700/25 px-4 py-2.5 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                متصل كمسؤول
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg bg-red-900/30 border border-red-700/30 px-3 py-1 text-red-400 hover:bg-red-900/50 hover:text-red-300 font-bold transition-all"
              >
                <LogOut size={12} /> خروج
              </button>
            </div>

            {/* Tabs Header */}
            {!editMenuItem && (
              <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-[#0d1815] border border-[#1C2E24] p-1.5">
                {([['menu','🍔','المنيو'],['photos','🖼️','الصور'],['videos','🎥','فيديو'],['info','ℹ️','البيانات']] as const).map(([tab, icon, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`relative flex flex-col items-center gap-1 rounded-xl py-2.5 px-1 text-[10px] font-bold transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-b from-[#C9A227] to-[#B8901F] text-[#12211d] shadow-lg shadow-[#C9A227]/30'
                        : 'text-[#A9A08C] hover:text-[#F3E9D2] hover:bg-[#1C2E24]'
                    }`}
                  >
                    <span className="text-base leading-none">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Section 1: Add/Edit Menu Item */}
            {(editMenuItem || activeTab === 'menu') && (
              <div className="rounded-xl border border-surface p-4 bg-[#0d1815]">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gold-bright mb-3">
                  {editMenuItem ? <Edit2 size={16} /> : <Plus size={16} />}
                  {editMenuItem ? 'تعديل الصنف الحالي للمنيو' : 'إضافة صنف جديد للمنيو'}
                </h4>

                <form onSubmit={handleSaveMenuItem} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">اسم الصنف</label>
                      <input
                        type="text"
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        placeholder="مثال: ساندوتش فول"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-bright"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">السعر (ج.م)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={menuPrice}
                        onChange={(e) => setMenuPrice(e.target.value)}
                        placeholder="15"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-bright"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">القسم</label>
                      <select
                        value={menuCategory}
                        onChange={(e) => setMenuCategory(e.target.value)}
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="orders">طلبات</option>
                        <option value="sandwiches">سندوتشات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">وصف الصنف (اختياري)</label>
                      <input
                        type="text"
                        value={menuDescription}
                        onChange={(e) => setMenuDescription(e.target.value)}
                        placeholder="مثال: بالزيت والليمون الحار"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">صورة صنف الطعام</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMenuFileChange}
                      className="w-full text-[10px] text-gray-300 file:mr-2 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-gold-bright hover:file:bg-surface/80"
                    />
                  </div>

                  {menuPreviewUrl && (
                    <div className="flex items-center gap-3 rounded-lg border border-surface/50 p-2 bg-[#0a1412]">
                      <img
                        src={menuPreviewUrl}
                        alt="معاينة الصورة"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="text-[10px] text-gray-400">معاينة الصورة قبل الحفظ</span>
                    </div>
                  )}

                  <div className="text-center text-[10px] text-gray-500">أو ضع رابط صورة خارجي مباشرة</div>

                  <div>
                    <input
                      type="url"
                      value={menuImageUrlInput}
                      onChange={(e) => setMenuImageUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {menuStatus && <div className="text-xs text-gold-bright">{menuStatus}</div>}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C566] py-3 text-sm font-bold text-[#12211d] shadow-lg shadow-[#C9A227]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? 'جاري الحفظ...' : (editMenuItem ? 'حفظ التعديلات' : '🍔 إضافة الصنف')}
                    </button>
                    {editMenuItem && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-surface px-6 py-3 text-sm font-bold text-white hover:bg-surface/80 active:scale-[0.98] transition-all"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Section 2: Edit Restaurant Information */}
            {!editMenuItem && activeTab === 'info' && (
              <div className="rounded-xl border border-surface p-4 bg-[#0d1815]">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gold-bright mb-3">
                  <Info size={16} /> تعديل بيانات ومعلومات المطعم
                </h4>

                <form onSubmit={handleUpdateRestaurantInfo} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">اسم المطعم</label>
                      <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="مطعم المروة"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">الهاتف</label>
                      <input
                        type="text"
                        value={restaurantPhone}
                        onChange={(e) => setRestaurantPhone(e.target.value)}
                        placeholder="01221365286"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">العنوان</label>
                      <input
                        type="text"
                        value={restaurantAddress}
                        onChange={(e) => setRestaurantAddress(e.target.value)}
                        placeholder="المرج الشرقية"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">مواعيد العمل</label>
                      <input
                        type="text"
                        value={restaurantWorkingHours}
                        onChange={(e) => setRestaurantWorkingHours(e.target.value)}
                        placeholder="يومياً 4ص - 4م"
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 mb-1">الوصف العام / الشعار</label>
                    <textarea
                      value={restaurantDesc}
                      onChange={(e) => setRestaurantDesc(e.target.value)}
                      placeholder="طعم أصيل من قلب القاهرة..."
                      className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none h-16 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">رابط فيسبوك</label>
                      <input
                        type="url"
                        value={restaurantFacebook}
                        onChange={(e) => setRestaurantFacebook(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">رابط إنستجرام</label>
                      <input
                        type="url"
                        value={restaurantInstagram}
                        onChange={(e) => setRestaurantInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {restaurantInfoStatus && <div className="text-xs text-gold-bright">{restaurantInfoStatus}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C566] py-3 text-sm font-bold text-[#12211d] shadow-lg shadow-[#C9A227]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'جاري الحفظ...' : 'ℹ️ حفظ معلومات المطعم'}
                  </button>
                </form>
              </div>
            )}

            {/* Section 3: Upload Photo to Gallery */}
            {!editMenuItem && activeTab === 'photos' && (
              <div className="rounded-xl border border-surface p-4 bg-[#0d1815]">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gold-bright mb-3">
                  <Upload size={16} /> رفع صورة جديدة للمطعم والمعرض
                </h4>

                <form onSubmit={handlePhotoUpload} className="space-y-3">
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">اسم/وصف الصورة</label>
                     <input
                       type="text"
                       value={photoCaption}
                       onChange={(e) => setPhotoCaption(e.target.value)}
                       placeholder="مثال: صالة الطعام الرئيسية"
                       className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                     />
                   </div>

                   <div>
                     <label className="block text-xs text-gold-bright mb-1 font-bold">مكان عرض الصورة (التصنيف)</label>
                     <select
                       value={photoCategory}
                       onChange={(e) => {
                         setPhotoCategory(e.target.value);
                         if (e.target.value === 'general') setIsCoverImage(false);
                       }}
                       className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-bright"
                     >
                       <option value="general">المعرض العام للأكلات</option>
                       <option value="alaa">فرع علاء</option>
                       <option value="said">فرع سعيد</option>
                       <option value="ahmed">فرع مدير المطعم (أحمد)</option>
                     </select>
                   </div>

                   {photoCategory !== 'general' && (
                     <div>
                       <label className="block text-xs text-gold-bright mb-1 font-bold">نوع الصورة</label>
                       <select
                         value={isCoverImage ? 'cover' : 'normal'}
                         onChange={(e) => setIsCoverImage(e.target.value === 'cover')}
                         className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-bright"
                       >
                         <option value="normal">صورة عادية (في الجاليري)</option>
                         <option value="cover">صورة غلاف للفرع (الرئيسية)</option>
                       </select>
                     </div>
                   )}

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">اختر صورة من جهازك</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="w-full text-xs text-gray-300 file:mr-2 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-gold-bright hover:file:bg-surface/80"
                    />
                  </div>

                  {photoPreviewUrl && (
                    <div className="flex items-center gap-3 rounded-lg border border-surface/50 p-2 bg-[#0a1412]">
                      <img
                        src={photoPreviewUrl}
                        alt="معاينة المعرض"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="text-[10px] text-gray-400">معاينة الصورة قبل الحفظ</span>
                    </div>
                  )}

                  <div className="text-center text-[10px] text-gray-500">أو ضع رابط صورة خارجي</div>

                  <div>
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {photoStatus && <div className="text-xs text-gold-bright">{photoStatus}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C566] py-3 text-sm font-bold text-[#12211d] shadow-lg shadow-[#C9A227]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'جاري الرفع...' : '🖼️ حفظ ونشر الصورة'}
                  </button>
                </form>
              </div>
            )}

            {/* Section 4: Publish Video */}
            {!editMenuItem && activeTab === 'videos' && (
              <div className="rounded-xl border border-surface p-4 bg-[#0d1815]">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gold-bright mb-3">
                  <Video size={16} /> نشر فيديو جديد (يوتيوب / تيك توك / فيسبوك)
                </h4>

                <form onSubmit={handleAddVideo} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">عنوان الفيديو</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="مثال: أحلى فطور شعبي في القاهرة"
                      className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">اختر فيديو من جهازك</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="w-full text-xs text-gray-300 file:mr-2 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-gold-bright hover:file:bg-surface/80"
                    />
                  </div>

                  {videoPreviewUrl && (
                    <div className="rounded-lg border border-surface/50 p-2 bg-[#0a1412] space-y-2">
                      <video
                        src={videoPreviewUrl}
                        controls
                        className="w-full max-h-40 rounded-lg object-cover"
                      />
                      <p className="text-[10px] text-gray-400 text-center">معاينة الفيديو قبل الرفع</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">وصف قصير (اختياري)</label>
                    <input
                      type="text"
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      placeholder="وصف الفيديو..."
                      className="w-full rounded-lg border border-surface bg-[#12211d] px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {videoStatus && <div className="text-xs text-gold-bright">{videoStatus}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-[#C9A227] to-[#E4C566] py-3 text-sm font-bold text-[#12211d] shadow-lg shadow-[#C9A227]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'جاري النشر...' : '🎥 نشر الفيديو'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
