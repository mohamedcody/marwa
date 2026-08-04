package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.UploadResponse;
import com.marwa.restaurant.service.CloudStorageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * متحكم رفع الملفات (File Upload Controller).
 * مسؤول عن استقبال ملفات الصور والفيديوهات ورفعها إلى Cloudinary (تخزين سحابي)
 * بدلاً من الحفظ المحلي، لضمان استمرارية الملفات عند إعادة تشغيل الحاوية.
 *
 * الحماية المطبقة:
 * - التحقق من نوع MIME للملف (صور وفيديوهات فقط)
 * - التحقق من امتداد الملف
 * - تحديد حجم الملف الأقصى (100 ميجابايت)
 * - يتطلب صلاحيات المسؤول (ADMIN) للرفع
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    private final CloudStorageService cloudStorageService;

    /**
     * رفع ملف (صورة أو فيديو) إلى Cloudinary.
     * يتطلب صلاحيات المسؤول (ADMIN).
     * يتحقق من نوع الملف وحجمه وامتداده قبل الرفع.
     *
     * @param file الملف المرفوع
     * @return كائن يحتوي على رابط الملف على السحابة
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = cloudStorageService.uploadFile(file);

            // استخراج اسم الملف من الرابط
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            log.info("تم رفع الملف بنجاح إلى Cloudinary: {}", filename);
            return ResponseEntity.ok(new UploadResponse(filename, fileUrl, "تم رفع الملف بنجاح"));

        } catch (IllegalArgumentException e) {
            log.warn("فشل التحقق من الملف: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (IOException e) {
            log.error("خطأ أثناء رفع الملف إلى Cloudinary: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "حدث خطأ أثناء رفع الملف إلى السحابة"));
        }
    }
}
