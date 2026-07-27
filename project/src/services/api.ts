/**
 * عميل الـ API (API Client) لمطعم المروة.
 * يتضمن جميع الدوال المسؤولة عن التواصل مع الباك إند (Spring Boot) لـ:
 * 1. تسجيل دخول المسؤول والحفاظ على التوكن (JWT).
 * 2. رفع وتخزين الصور على الخادم.
 * 3. إضافة/عرض/حذف أصناف المنيو.
 * 4. إضافة/عرض/حذف صور المعرض.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface PhotoData {
  id: string | number;
  src: string;
  caption: string;
  category?: string;
}


export interface MenuItemData {
  id: string | number;
  name: string;
  price: number;
  categoryId?: string;
  description?: string;
  imageUrl?: string;
}

export interface RestaurantInfoData {
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  workingHours?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

// Auth helpers
// جلب رمز المسؤول (Token) المخزن في متصفح المستخدم للتحقق من الصلاحيات
export const getAdminToken = (): string | null => {
  const token = localStorage.getItem('marwa_admin_token');
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    return null;
  }
  return token;
};

// حفظ رمز المسؤول (Token) في المتصفح لاستخدامه في الطلبات اللاحقة
export const setAdminToken = (token: string) => localStorage.setItem('marwa_admin_token', token);

// مسح رمز المسؤول (Token) لتسجيل الخروج وتحويل الموقع إلى العرض التعريفي فقط
export const removeAdminToken = () => {
  localStorage.removeItem('marwa_admin_token');
  window.dispatchEvent(new Event('auth_change'));
};

// التحقق مما إذا كان المستخدم أدمن مصرح له بالتعديل (يرجع true فقط إذا وُجد توكن صالح)
export const isAdminLoggedIn = (): boolean => getAdminToken() !== null;

// Auth API
// إرسال طلب تسجيل دخول المسؤول برقم الهاتـف أو اسم المستخدم وكلمة المرور
export const loginAdmin = async (usernameOrPhone: string, password?: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrPhone, password: password || '' }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, message: errText || 'رقم الهاتـف أو كلمة المرور غير صحيحة' };
    }
    const data = await res.json();
    if (data.token) {
      setAdminToken(data.token);
      window.dispatchEvent(new Event('auth_change'));
      return { success: true };
    }
    return { success: false, message: 'فشل استلام رمز الصلاحية' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'تعذر الاتصال بالخادم، تأكد من تشغيل الخادم' };
  }
};



// File Upload API
// رفع ملف (صورة أو فيديو) إلى خادم الباك إند ويرجع رابط الملف الجديد
export const uploadFileAPI = async (file: File): Promise<string | null> => {
  const token = getAdminToken();
  if (!token) return null;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error('فشل رفع الملف');
    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// للتوافق مع الكود القديم
export const uploadImageFile = uploadFileAPI;

// Photos API
// جلب قائمة الصور الخاصة بالمعرض من الباك إند
export const fetchPhotos = async (): Promise<PhotoData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/photos`);
    if (!res.ok) throw new Error('Failed to fetch photos');
    const data = await res.json();
    return data.map((item: any) => ({
      id: String(item.id),
      src: item.src,
      caption: item.caption,
      category: item.category || 'general',
    }));
  } catch (err) {
    return [];
  }
};

// إضافة صورة جديدة للمعرض في الباك إند (يطلب التوكن الخاص بالمسؤول)
export const addPhotoAPI = async (caption: string, src: string, category?: string): Promise<PhotoData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ caption, src, category }),
    });

    if (!res.ok) throw new Error('فشل إضافة الصورة');
    const item = await res.json();
    return { id: String(item.id), src: item.src, caption: item.caption, category: item.category };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// حذف صورة معينة من المعرض في الباك إند باستخدام المعرف (ID)
export const deletePhotoAPI = async (id: string | number): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Menu API
// جلب جميع أصناف قائمة الطعام من الباك إند
export const fetchMenuItems = async (): Promise<MenuItemData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (!res.ok) throw new Error('Failed to fetch menu');
    const data = await res.json();
    return data.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description,
      imageUrl: item.imageUrl,
    }));
  } catch (err) {
    return [];
  }
};

// إضافة صنف جديد إلى قائمة الطعام في الباك إند (يطلب التوكن الخاص بالمسؤول)
export const addMenuItemAPI = async (
  name: string,
  price: number,
  categoryId: string,
  description?: string,
  imageUrl?: string
): Promise<MenuItemData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price, categoryId, description, imageUrl }),
    });

    if (!res.ok) throw new Error('فشل إضافة الصنف');
    const item = await res.json();
    return {
      id: String(item.id),
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description,
      imageUrl: item.imageUrl,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// تعديل صنف موجود في قائمة الطعام (يطلب التوكن الخاص بالمسؤول)
export const updateMenuItemAPI = async (
  id: string | number,
  name: string,
  price: number,
  categoryId: string,
  description?: string,
  imageUrl?: string
): Promise<MenuItemData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price, categoryId, description, imageUrl }),
    });

    if (!res.ok) throw new Error('فشل تعديل الصنف');
    const item = await res.json();
    return {
      id: String(item.id),
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description,
      imageUrl: item.imageUrl,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// حذف صنف معين من قائمة الطعام في الباك إند باستخدام المعرف (ID)
export const deleteMenuItemAPI = async (id: string | number): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Restaurant Info API
// جلب معلومات الملف التعريفي للمطعم من الباك إند
export const fetchRestaurantInfo = async (): Promise<RestaurantInfoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/info`);
    if (!res.ok) throw new Error('Failed to fetch restaurant info');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// تعديل معلومات المطعم (يطلب التوكن الخاص بالمسؤول)
export const updateRestaurantInfoAPI = async (data: RestaurantInfoData): Promise<RestaurantInfoData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update restaurant info');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Video API
export interface VideoData {
  id: string | number;
  title: string;
  videoUrl: string;
  description?: string;
  likes?: number;
  views?: number;
  shares?: number;
}

// جلب جميع الفيديوهات من الباك إند
export const fetchVideos = async (): Promise<VideoData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos`);
    if (!res.ok) throw new Error('فشل جلب الفيديوهات');
    const data = await res.json();
    return data.map((v: any) => ({
      id: String(v.id),
      title: v.title,
      videoUrl: v.videoUrl,
      description: v.description,
      likes: v.likes || 0,
      views: v.views || 0,
      shares: v.shares || 0,
    }));
  } catch (err) {
    return [];
  }
};

// إضافة فيديو جديد في الباك إند (يطلب توكن الأدمن)
export const addVideoAPI = async (title: string, videoUrl: string, description?: string): Promise<VideoData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, videoUrl, description }),
    });

    if (!res.ok) throw new Error('فشل إضافة الفيديو');
    const item = await res.json();
    return {
      id: String(item.id),
      title: item.title,
      videoUrl: item.videoUrl,
      description: item.description,
      likes: item.likes || 0,
      views: item.views || 0,
      shares: item.shares || 0,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

// حذف فيديو باستخدام المعرف (ID)
export const deleteVideoAPI = async (id: string | number): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// زيادة عدد الإعجابات بفيديو في الباك إند
export const likeVideoAPI = async (id: string | number, amount = 1): Promise<VideoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/like?amount=${amount}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('فشل تسجيل الإعجاب');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// زيادة عدد المشاهدات لفيديو في الباك إند
export const viewVideoAPI = async (id: string | number): Promise<VideoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/view`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('فشل تسجيل المشاهدة');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// زيادة عدد المشاركات لفيديو في الباك إند
export const shareVideoAPI = async (id: string | number): Promise<VideoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/share`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('فشل تسجيل المشاركة');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

