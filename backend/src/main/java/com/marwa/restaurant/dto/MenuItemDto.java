package com.marwa.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * كائن نقل البيانات لصنف قائمة الطعام (MenuItem DTO).
 * يستخدم لنقل البيانات بين الواجهة الأمامية والمتحكمات لحماية الكيانات الأصلية.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemDto {

    private Long id;

    @NotBlank(message = "اسم الصنف مطلوب")
    @Size(max = 200, message = "اسم الصنف لا يتجاوز 200 حرف")
    private String name;

    @Positive(message = "السعر يجب أن يكون رقم موجب")
    private Double price;

    @NotBlank(message = "القسم مطلوب")
    @Size(max = 50, message = "معرف القسم لا يتجاوز 50 حرف")
    private String categoryId;

    private String description;
    private String imageUrl;
}
