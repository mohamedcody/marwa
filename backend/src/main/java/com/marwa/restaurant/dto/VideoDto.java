package com.marwa.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كائن نقل البيانات للفيديوهات (Video DTO).
 * يتضمن حقل userLiked لإعلام الفرونت إند بحالة إعجاب المستخدم الحالي.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoDto {

    private Long id;

    @NotBlank(message = "عنوان الفيديو مطلوب")
    @Size(max = 300, message = "عنوان الفيديو لا يتجاوز 300 حرف")
    private String title;

    @NotBlank(message = "رابط الفيديو مطلوب")
    @Size(max = 2000, message = "رابط الفيديو لا يتجاوز 2000 حرف")
    private String videoUrl;

    @Size(max = 1000, message = "وصف الفيديو لا يتجاوز 1000 حرف")
    private String description;

    private Integer likes;
    private Integer views;
    private Integer shares;

    /** هل المستخدم الحالي معجب بالفيديو؟ */
    private Boolean userLiked;

    private LocalDateTime createdAt;
}
