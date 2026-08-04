package com.marwa.restaurant.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

/**
 * خدمة التخزين السحابي (Cloud Storage Service).
 * مسؤولة عن رفع وحذف الملفات (صور وفيديوهات) من Cloudinary بدلاً من التخزين المحلي.
 *
 * المميزات:
 * - رفع تلقائي مع تحديد نوع المورد (صورة/فيديو) حسب MIME type
 * - تحسين تلقائي للجودة والحجم (auto quality, auto format)
 * - حذف الملفات من Cloudinary باستخدام public_id
 * - تنظيم الملفات في مجلدات (marwa-restaurant/images, marwa-restaurant/videos)
 */
@Service
@RequiredArgsConstructor
public class CloudStorageService {

    private static final Logger log = LoggerFactory.getLogger(CloudStorageService.class);

    private final Cloudinary cloudinary;

    /** أنواع MIME المسموح رفعها — صور */
    private static final Set<String> IMAGE_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
    );

    /** أنواع MIME المسموح رفعها — فيديوهات */
    private static final Set<String> VIDEO_MIME_TYPES = Set.of(
            "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/3gpp"
    );

    /** الامتدادات المسموح رفعها */
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
            ".mp4", ".webm", ".ogg", ".mov", ".avi", ".3gp"
    );

    /** الحجم الأقصى المسموح: 100 ميجابايت */
    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024;

    /**
     * رفع ملف إلى Cloudinary وإرجاع الرابط العام (Secure URL).
     *
     * @param file الملف المرفوع من المستخدم
     * @return رابط الملف على Cloudinary
     * @throws IOException عند فشل الرفع
     * @throws IllegalArgumentException عند فشل التحقق من صحة الملف
     */
    @SuppressWarnings("unchecked")
    public String uploadFile(MultipartFile file) throws IOException {
        // === التحقق من صحة الملف ===
        validateFile(file);

        // تحديد نوع المورد (image أو video)
        String contentType = file.getContentType();
        String resourceType = "auto"; // Cloudinary auto-detects
        String folder = "marwa-restaurant/";

        if (contentType != null && VIDEO_MIME_TYPES.contains(contentType.toLowerCase())) {
            resourceType = "video";
            folder += "videos";
        } else {
            resourceType = "image";
            folder += "images";
        }

        // رفع الملف إلى Cloudinary
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", resourceType,
                        "folder", folder,
                        "quality", "auto",          // تحسين تلقائي للجودة
                        "fetch_format", "auto"       // تحسين تلقائي للصيغة (WebP/AVIF)
                )
        );

        String secureUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        log.info("تم رفع الملف بنجاح إلى Cloudinary: publicId={}, url={}", publicId, secureUrl);

        return secureUrl;
    }

    /**
     * حذف ملف من Cloudinary باستخدام الرابط العام.
     * يستخرج الـ public_id من الرابط ويحذف المورد.
     *
     * @param fileUrl رابط الملف على Cloudinary
     */
    @SuppressWarnings("unchecked")
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        try {
            String publicId = extractPublicId(fileUrl);
            if (publicId == null) {
                log.warn("تعذر استخراج public_id من الرابط: {}", fileUrl);
                return;
            }

            // تحديد نوع المورد من المسار
            String resourceType = publicId.contains("/videos/") ? "video" : "image";

            Map<String, Object> result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", resourceType)
            );

            log.info("تم حذف الملف من Cloudinary: publicId={}, result={}", publicId, result.get("result"));
        } catch (Exception e) {
            log.error("خطأ أثناء حذف الملف من Cloudinary: {}", e.getMessage());
        }
    }

    /**
     * استخراج الـ public_id من رابط Cloudinary.
     * مثال: https://res.cloudinary.com/xxx/image/upload/v123/marwa-restaurant/images/abc.jpg
     * يُرجع: marwa-restaurant/images/abc
     */
    private String extractPublicId(String url) {
        try {
            // البحث عن "upload/" في الرابط واستخراج ما بعده
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1) return null;

            String afterUpload = url.substring(uploadIndex + "/upload/".length());

            // تخطي الـ version (v1234567890/)
            if (afterUpload.startsWith("v") && afterUpload.contains("/")) {
                afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
            }

            // إزالة الامتداد
            int dotIndex = afterUpload.lastIndexOf(".");
            if (dotIndex > 0) {
                afterUpload = afterUpload.substring(0, dotIndex);
            }

            return afterUpload;
        } catch (Exception e) {
            log.error("خطأ في استخراج public_id: {}", e.getMessage());
            return null;
        }
    }

    /**
     * التحقق من صحة الملف المرفوع (الحجم، النوع، الامتداد).
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("يرجى اختيار ملف لرفعه");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("حجم الملف يتجاوز الحد الأقصى المسموح (100 ميجابايت)");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                (!IMAGE_MIME_TYPES.contains(contentType.toLowerCase()) &&
                 !VIDEO_MIME_TYPES.contains(contentType.toLowerCase()))) {
            throw new IllegalArgumentException(
                    "نوع الملف غير مسموح. الأنواع المسموحة: الصور (JPEG, PNG, WebP) والفيديوهات (MP4, WebM, MOV)");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) {
                String extension = originalFilename.substring(dotIndex).toLowerCase();
                if (!ALLOWED_EXTENSIONS.contains(extension)) {
                    throw new IllegalArgumentException(
                            "امتداد الملف غير مسموح. الامتدادات المسموحة: jpg, png, webp, mp4, webm, mov");
                }
            }
        }
    }
}
