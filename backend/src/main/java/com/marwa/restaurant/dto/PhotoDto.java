package com.marwa.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كائن نقل البيانات لمعرض الصور (Photo DTO).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhotoDto {

    private Long id;

    @NotBlank(message = "رابط الصورة مطلوب")
    @Size(max = 2000, message = "رابط الصورة لا يتجاوز 2000 حرف")
    private String src;

    @NotBlank(message = "وصف الصورة مطلوب")
    @Size(max = 500, message = "وصف الصورة لا يتجاوز 500 حرف")
    private String caption;

    private LocalDateTime createdAt;

    private String category;
}
