package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.VideoDto;
import com.marwa.restaurant.service.VideoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * متحكم الفيديوهات (Video Controller).
 * مسؤول عن معالجة طلبات عرض ونشر وحذف فيديوهات المطعم.
 *
 * نظام التفاعلات الحقيقي:
 * - Like: Toggle (like/unlike) — يمنع التكرار من نفس المستخدم
 * - View: مع throttle 30 ثانية — يمنع تضخم المشاهدات
 * - Share: يسجل كل مشاركة مع المنصة
 */
@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    /**
     * جلب قائمة جميع الفيديوهات مرتبة تنازلياً.
     * متاح للجميع بدون تسجيل دخول.
     */
    @GetMapping
    public ResponseEntity<List<VideoDto>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    /**
     * نشر فيديو جديد (يتطلب صلاحيات مسؤول ADMIN).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VideoDto> addVideo(@Valid @RequestBody VideoDto videoDto) {
        VideoDto saved = videoService.addVideo(videoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * حذف فيديو بواسطة المعرف ID (يتطلب صلاحيات مسؤول ADMIN).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok().body(Map.of("message", "تم حذف الفيديو بنجاح"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * تبديل حالة الإعجاب (Like/Unlike) — نظام حقيقي يمنع التكرار.
     * يستخدم معرف المستخدم من Header أو يُنشئ واحداً جديداً.
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<VideoDto> toggleLike(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            HttpServletRequest request) {
        try {
            String userIdentifier = resolveUserIdentifier(userId, request);
            VideoDto updated = videoService.toggleLike(id, userIdentifier);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * تسجيل مشاهدة فيديو مع حماية throttle (30 ثانية).
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<VideoDto> viewVideo(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            HttpServletRequest request) {
        try {
            String userIdentifier = resolveUserIdentifier(userId, request);
            String ipAddress = getClientIp(request);
            VideoDto updated = videoService.registerView(id, userIdentifier, ipAddress);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * تسجيل مشاركة فيديو.
     */
    @PostMapping("/{id}/share")
    public ResponseEntity<VideoDto> shareVideo(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam(value = "platform", defaultValue = "unknown") String platform,
            HttpServletRequest request) {
        try {
            String userIdentifier = resolveUserIdentifier(userId, request);
            VideoDto updated = videoService.registerShare(id, userIdentifier, platform);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * استخراج معرف المستخدم من Header أو استخدام IP كبديل.
     */
    private String resolveUserIdentifier(String userId, HttpServletRequest request) {
        if (userId != null && !userId.trim().isEmpty()) {
            return userId.trim();
        }
        // استخدام IP + User-Agent كمعرف بديل
        String ip = getClientIp(request);
        String ua = request.getHeader("User-Agent");
        return "anon_" + Math.abs((ip + (ua != null ? ua : "")).hashCode());
    }

    /**
     * استخراج عنوان IP الحقيقي للمستخدم (يدعم reverse proxy).
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
}
