# 🍽️ منصة مطعم المروة - دليل التشغيل والإنتاج | Marwa Restaurant Full-Stack Platform

منصة متكاملة لإدارة وعرض محتوى مطعم المروة (قائمة الطعام، المعارض، الفيديوهات التفاعلية، معلومات التواصل) مبنية بأحدث التقنيات وأفضل ممارسات الأمان والـ DevOps.

---

## 🛠️ البنية التقنية (Architecture & Tech Stack)

### 💻 الواجهة الأمامية (Frontend)
- **Vite + React (TypeScript)**: لبناء واجهة مستخدم فائقة السرعة والتفاعل.
- **Tailwind CSS**: للتصميم المتناسق والاستجابة لجميع الشاشات.
- **Lucide Icons**: مكتبة أيقونات عصرية وخفيفة الوزن.

### ⚙️ الخادم الخلفي (Backend API)
- **Spring Boot 3.2.4 (Java 21)**: خادم ويب قوي، آمن ومنظم.
- **Spring Security + JWT**: لحماية لوحة الإدارة والتحقق من الهوية بشكل آمن.
- **Jakarta Validation**: للتحقق الصارم من صحة البيانات المدخلة قبل حفظها.

### 🗄️ قاعدة البيانات (Database)
- **PostgreSQL**: لتخزين البيانات الحية بشكل دائم وموثوق.
- **Hibernate / Spring Data JPA**: لإدارة الكيانات والعلاقات البرمجية بكفاءة عالية.

---

## 🚀 التشغيل والتطوير المحلي (Local Development)

### 1️⃣ الخادم الخلفي (Backend)
1. قم بإنشاء ملف `.env` في مجلد الـ `backend` واملأ المتغيرات التالية:
   ```env
   SERVER_PORT=8080
   DB_URL=jdbc:postgresql://localhost:5432/marwa_db
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_at_least_256_bits_long
   JWT_EXPIRATION=86400000
   MAX_FILE_SIZE=100MB
   MAX_REQUEST_SIZE=100MB
   ```
2. لتشغيل قاعدة بيانات PostgreSQL محلياً عبر Docker:
   ```bash
   cd backend
   docker-compose up -d
   ```
3. لتشغيل الخادم الخلفي:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2️⃣ الواجهة الأمامية (Frontend)
1. انتقل لمجلد المشروع:
   ```bash
   cd project
   ```
2. تثبيت الحزم المطلوبة:
   ```bash
   npm install
   ```
3. تشغيل خادم التطوير المحلي:
   ```bash
   npm run dev
   ```

---

## 📦 النشر في بيئة الإنتاج (Production Deployment)

### 🐳 أولاً: نشر الخادم الخلفي (Docker Multi-Stage Build)
تم إعداد `Dockerfile` متعدد المراحل لتقليص حجم الصورة النهائية وعزل بيئة البناء:

1. **بناء الحاوية**:
   ```bash
   cd backend
   docker build -t marwa-backend:latest .
   ```
2. **التشغيل في بيئة الإنتاج**:
   تأكد من تمرير متغيرات البيئة الحقيقية عند التشغيل:
   ```bash
   docker run -d \
     -p 8080:8080 \
     -e DB_URL=jdbc:postgresql://your-prod-db:5432/db_name \
     -e DB_USERNAME=prod_user \
     -e DB_PASSWORD=prod_password \
     -e JWT_SECRET=strong_production_jwt_secret \
     -e SERVER_PORT=8080 \
     --name marwa-backend-app \
     marwa-backend:latest
   ```

### 🌐 ثانياً: نشر الواجهة الأمامية (Vercel / Netlify / Nginx)
بما أن الواجهة عبارة عن تطبيق Single Page Application (SPA)، يتم بناؤها كملفات استاتيكية:

1. **بناء المشروع لبيئة الإنتاج**:
   تأكد من تحديد رابط الـ API الخاص ببيئة الإنتاج:
   ```bash
   cd project
   VITE_API_URL=https://api.yourdomain.com/api npm run build
   ```
2. **النشر المباشر**:
   - لـ **Vercel / Netlify**: قم بربط المستودع وسيقومون بالبناء التلقائي بوضع أمر البناء `npm run build` ومجلد المخرجات `dist`.
   - لـ **Nginx**: انسخ محتويات مجلد `project/dist` إلى مسار خادم Nginx الرئيسي (غالباً `/var/www/html`).

---

## 🔒 الميزات الأمنية المطبقة (Security & Hardening Features)

1. **حماية التوكن (JWT Authentication)**: جميع العمليات الحساسة (إضافة/حذف أصناف المنيو والصور والفيديوهات) تتطلب توكن JWT صالح وممرر في ترويسة الطلب (`Authorization: Bearer <token>`).
2. **منع ثغرات مسارات الملفات (Path Traversal Protection)**: يتم فحص أسماء الملفات المرفوعة وتوليد معرفات عشوائية فريدة (UUID) وتخزينها بأمان على الخادم لمنع أي وصول غير مصرح لملفات النظام الأساسية.
3. **التحقق المركزي من البيانات (Central Validation)**: يتم فحص المدخلات في طبقة المتحكمات (Controllers) باستخدام `@Valid` ومعالج الأخطاء المركزي `GlobalExceptionHandler` لإرجاع استجابات واضحة.
4. **أمان المتغيرات (Zero Hardcoded Secrets)**: لا توجد أي كلمات مرور أو مفاتيح تشفير ثابتة داخل الكود. يتم تحميل كل شيء عبر ملف `.env` أو متغيرات نظام التشغيل.
