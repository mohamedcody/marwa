package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.UploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * متحكم رفع الملفات (File Upload Controller).
 * مسؤول عن استقبال ملفات الصور وحفظها محلياً على الخادم وإنشاء رابط مباشر للوصول إليها.
 *
 * الحماية المطبقة:
 * - التحقق من نوع MIME للملف (صور فقط)
 * - التحقق من امتداد الملف
 * - منع Path Traversal في اسم الملف
 * - تحديد حجم الملف الأقصى
 * - إنشاء اسم فريد UUID لكل ملف
 */
@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    /** الحجم الأقصى المسموح لكل ملف: 100 ميجابايت */
    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024;

    /** أنواع MIME المسموح رفعها فقط */
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
            "video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/3gpp"
    );

    /** الامتدادات المسموح رفعها فقط */
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
            ".mp4", ".webm", ".ogg", ".mov", ".avi", ".3gp"
    );

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    /**
     * رفع ملف صورة جديد.
     * يتطلب صلاحيات المسؤول (ADMIN).
     * يتحقق من نوع الملف وحجمه وامتداده قبل الحفظ.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {

        // التحقق من أن الملف غير فارغ
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "يرجى اختيار ملف لرفعه"));
        }

        // التحقق من حجم الملف
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "حجم الملف يتجاوز الحد الأقصى المسموح (100 ميجابايت)"));
        }

        // التحقق من نوع MIME
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            log.warn("محاولة رفع ملف بنوع غير مسموح: {}", contentType);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "نوع الملف غير مسموح. الأنواع المسموحة: الصور (JPEG, PNG, WebP) والفيديوهات (MP4, WebM, MOV)"));
        }

        // التحقق من امتداد الملف ومنع Path Traversal
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null) {
            // منع Path Traversal: استخراج اسم الملف فقط بدون أي مسار
            originalFilename = Paths.get(originalFilename).getFileName().toString();
            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex > 0) {
                extension = originalFilename.substring(dotIndex).toLowerCase();
            }
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            log.warn("محاولة رفع ملف بامتداد غير مسموح: {}", extension);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "امتداد الملف غير مسموح. الامتدادات المسموحة: jpg, png, webp, mp4, webm, mov"));
        }

        try {
            // إنشاء مجلد الرفع إذا لم يكن موجوداً
            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // إنشاء اسم فريد UUID لمنع التكرار وإخفاء اسم الملف الأصلي
            String newFilename = UUID.randomUUID().toString() + extension;
            Path targetPath = Paths.get(uploadDir).resolve(newFilename).normalize();

            // التحقق النهائي أن المسار داخل مجلد الرفع (حماية إضافية ضد Path Traversal)
            if (!targetPath.startsWith(Paths.get(uploadDir).normalize())) {
                log.error("محاولة Path Traversal: {}", targetPath);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "مسار غير مسموح"));
            }

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(newFilename)
                    .toUriString();

            log.info("تم رفع الملف بنجاح: {} ({})", newFilename, contentType);
            return ResponseEntity.ok(new UploadResponse(newFilename, fileUrl, "تم رفع الملف بنجاح"));

        } catch (IOException e) {
            log.error("خطأ أثناء رفع الملف: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "حدث خطأ أثناء رفع الملف"));
        }
    }
}
