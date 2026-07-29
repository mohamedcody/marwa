package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.PhotoDto;
import com.marwa.restaurant.service.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * متحكم معرض الصور (Photo Controller).
 * مسؤول عن إدارة الصور المعروضة للمطعم (عرض جميع الصور، إضافة صورة جديدة، وحذف صورة).
 */
@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    /**
     * جلب الصور المتوفرة في المعرض (مع إمكانية الفلترة حسب التصنيف).
     * متاح للجميع ويتم ترتيبها من الأحدث إلى الأقدم.
     */
    @GetMapping
    public ResponseEntity<List<PhotoDto>> getAllPhotos(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(photoService.getPhotosByCategory(category.trim()));
        }
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    /**
     * إضافة صورة جديدة إلى معرض الصور.
     * يتطلب صلاحيات المسؤول (ADMIN).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PhotoDto> addPhoto(@Valid @RequestBody PhotoDto photoDto) {
        PhotoDto saved = photoService.addPhoto(photoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * حذف صورة معينة من معرض الصور بواسطة المعرف (ID).
     * يتطلب صلاحيات المسؤول (ADMIN).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePhoto(@PathVariable Long id) {
        try {
            photoService.deletePhoto(id);
            return ResponseEntity.ok().body("تم حذف الصورة بنجاح");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
