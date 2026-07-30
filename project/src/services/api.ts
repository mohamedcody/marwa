/**
 * عميل الـ API (API Client) لمطعم المروة.
 * يتضمن جميع الدوال المسؤولة عن التواصل مع الباك إند (Spring Boot) لـ:
 * 1. تسجيل دخول المسؤول والحفاظ على التوكن (JWT).
 * 2. رفع وتخزين الصور على الخادم.
 * 3. إضافة/عرض/حذف أصناف المنيو.
 * 4. إضافة/عرض/حذف صور المعرض.
 * 5. إدارة الفيديوهات والتفاعلات الحقيقية.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// === معرف المستخدم الفريد (لتتبع الإعجابات والمشاهدات) ===
const getUserId = (): string => {
  let userId = localStorage.getItem('marwa_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('marwa_user_id', userId);
  }
  return userId;
};

// === Helper: إضافة headers مشتركة لكل request ===
const createHeaders = (includeAuth = false, isJson = true): HeadersInit => {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'X-User-Id': getUserId(),
  };
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (includeAuth) {
    const token = getAdminToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// === Interfaces ===

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

export interface VideoData {
  id: string | number;
  title: string;
  videoUrl: string;
  description?: string;
  likes?: number;
  views?: number;
  shares?: number;
  userLiked?: boolean;
}

// === Auth helpers ===

/** فك تشفير JWT payload (بدون مكتبة خارجية) */
const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

/** جلب رمز المسؤول (Token) المخزن في متصفح المستخدم */
export const getAdminToken = (): string | null => {
  const token = localStorage.getItem('marwa_admin_token');
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
    return null;
  }
  // التحقق من انتهاء صلاحية التوكن
  const payload = decodeJwtPayload(token);
  if (payload && payload.exp) {
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      localStorage.removeItem('marwa_admin_token');
      return null;
    }
  }
  return token;
};

/** حفظ رمز المسؤول (Token) في المتصفح */
export const setAdminToken = (token: string) => localStorage.setItem('marwa_admin_token', token);

/** مسح رمز المسؤول (Token) لتسجيل الخروج */
export const removeAdminToken = () => {
  localStorage.removeItem('marwa_admin_token');
  window.dispatchEvent(new Event('auth_change'));
};

/** التحقق مما إذا كان المستخدم مسؤول (Admin) بقراءة الصلاحية من التوكن */
export const isAdminLoggedIn = (): boolean => {
  const token = getAdminToken();
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  const role = payload.role || '';
  return role === 'ROLE_ADMIN' || role === 'ADMIN';
};

/** استخراج صلاحية المستخدم من التوكن */
export const getUserRole = (): string | null => {
  const token = getAdminToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  return payload?.role || null;
};

// === Auth API ===

export const loginAdmin = async (usernameOrPhone: string, password?: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(false, true),
      body: JSON.stringify({ username: usernameOrPhone, password: password || '' }),
    });

    if (!res.ok) {
      let errMsg = 'رقم الهاتـف أو كلمة المرور غير صحيحة';
      try {
        const errData = await res.json();
        errMsg = errData.error || errData.message || errMsg;
      } catch {
        // fallback to default error
      }
      return { success: false, message: errMsg };
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

// === File Upload API ===

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
        'ngrok-skip-browser-warning': 'true',
        'X-User-Id': getUserId(),
      },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'فشل رفع الملف');
    }
    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
};

export const uploadImageFile = uploadFileAPI;

/** رفع ملف فيديو مباشرة من الجهاز — يرجع الـ URL */
export const uploadVideoFile = async (
  file: File,
  onProgress?: (pct: number) => void
): Promise<string | null> => {
  const token = getAdminToken();
  if (!token) return null;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url || null);
        } catch {
          resolve(null);
        }
      } else {
        console.error('Video upload failed:', xhr.status);
        resolve(null);
      }
    };

    xhr.onerror = () => { console.error('Video upload network error'); resolve(null); };

    xhr.open('POST', `${API_BASE_URL}/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('ngrok-skip-browser-warning', 'true');
    xhr.setRequestHeader('X-User-Id', getUserId());
    xhr.send(formData);
  });
};

// === Photos API ===

export const fetchPhotos = async (category?: string): Promise<PhotoData[]> => {
  try {
    const url = category
      ? `${API_BASE_URL}/photos?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/photos`;
    const res = await fetch(url, { headers: createHeaders(false, false) });
    if (!res.ok) throw new Error('Failed to fetch photos');
    const data = await res.json();
    return data.map((item: any) => ({
      id: String(item.id),
      src: item.src,
      caption: item.caption,
      category: item.category || 'general',
    }));
  } catch (err) {
    console.error('Fetch photos error:', err);
    return [];
  }
};

export const addPhotoAPI = async (caption: string, src: string, category?: string): Promise<PhotoData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/photos`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ caption, src, category }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'فشل إضافة الصورة');
    }
    const item = await res.json();
    return { id: String(item.id), src: item.src, caption: item.caption, category: item.category };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const deletePhotoAPI = async (id: string | number): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true, false),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// === Menu API ===

export const fetchMenuItems = async (): Promise<MenuItemData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/menu`, { headers: createHeaders(false, false) });
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
    console.error('Fetch menu error:', err);
    return [];
  }
};

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
      headers: createHeaders(true),
      body: JSON.stringify({ name, price, categoryId, description, imageUrl }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'فشل إضافة الصنف');
    }
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
      headers: createHeaders(true),
      body: JSON.stringify({ name, price, categoryId, description, imageUrl }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'فشل تعديل الصنف');
    }
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

export const deleteMenuItemAPI = async (id: string | number): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true, false),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// === Restaurant Info API ===

export const fetchRestaurantInfo = async (): Promise<RestaurantInfoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/info`, { headers: createHeaders(false, false) });
    if (!res.ok) throw new Error('Failed to fetch restaurant info');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateRestaurantInfoAPI = async (data: RestaurantInfoData): Promise<RestaurantInfoData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/info`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update restaurant info');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// === Video API ===

export const fetchVideos = async (): Promise<VideoData[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos`, { headers: createHeaders(false, false) });
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
      userLiked: v.userLiked || false,
    }));
  } catch (err) {
    console.error('Fetch videos error:', err);
    return [];
  }
};

export const addVideoAPI = async (title: string, videoUrl: string, description?: string): Promise<VideoData | null> => {
  const token = getAdminToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      headers: createHeaders(true),
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

export const deleteVideoAPI = async (id: string | number): Promise<boolean> => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true, false),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

/** تبديل حالة الإعجاب (Like/Unlike) — يرجع حالة الإعجاب الجديدة */
export const likeVideoAPI = async (id: string | number): Promise<VideoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/like`, {
      method: 'POST',
      headers: createHeaders(false, false),
    });
    if (!res.ok) throw new Error('فشل تسجيل الإعجاب');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

/** تسجيل مشاهدة فيديو (مع throttle في الباك إند) */
export const viewVideoAPI = async (id: string | number): Promise<VideoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/view`, {
      method: 'POST',
      headers: createHeaders(false, false),
    });
    if (!res.ok) throw new Error('فشل تسجيل المشاهدة');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

/** تسجيل مشاركة فيديو */
export const shareVideoAPI = async (id: string | number, platform = 'unknown'): Promise<VideoData | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/share?platform=${encodeURIComponent(platform)}`, {
      method: 'POST',
      headers: createHeaders(false, false),
    });
    if (!res.ok) throw new Error('فشل تسجيل المشاركة');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};
