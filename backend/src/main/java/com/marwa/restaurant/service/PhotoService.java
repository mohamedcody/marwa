package com.marwa.restaurant.service;

import com.marwa.restaurant.dto.PhotoDto;
import com.marwa.restaurant.entity.Photo;
import com.marwa.restaurant.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * خدمة معرض الصور (Photo Service).
 * تدير العمليات الخاصة بالمعرض وتحول الكيانات إلى كائنات DTO.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhotoService {

    private final PhotoRepository photoRepository;

    /**
     * جلب جميع الصور مرتبة تنازلياً كـ DTOs.
     */
    public List<PhotoDto> getAllPhotos() {
        return photoRepository.findAllByOrderByIdDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * إضافة صورة جديدة للمعرض.
     */
    @Transactional
    public PhotoDto addPhoto(PhotoDto dto) {
        Photo photo = Photo.builder()
                .src(dto.getSrc())
                .caption(dto.getCaption())
                .category(dto.getCategory() != null ? dto.getCategory().trim() : "general")
                .build();
        Photo saved = photoRepository.save(photo);
        return convertToDto(saved);
    }

    /**
     * حذف صورة بالمعرف.
     */
    @Transactional
    public void deletePhoto(Long id) {
        if (!photoRepository.existsById(id)) {
            throw new IllegalArgumentException("الصورة غير موجودة بالمعرف: " + id);
        }
        photoRepository.deleteById(id);
    }

    /**
     * جلب الصور الخاصة بتصنيف معين مرتبة تنازلياً.
     */
    public List<PhotoDto> getPhotosByCategory(String category) {
        return photoRepository.findByCategoryOrderByIdDesc(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * تحويل الكيان إلى DTO.
     */
    private PhotoDto convertToDto(Photo photo) {
        return PhotoDto.builder()
                .id(photo.getId())
                .src(photo.getSrc())
                .caption(photo.getCaption())
                .createdAt(photo.getCreatedAt())
                .category(photo.getCategory())
                .build();
    }
}
