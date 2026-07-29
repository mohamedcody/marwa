package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * كيان صنف قائمة الطعام (MenuItem Entity).
 * يمثل جدول 'menu_items' في قاعدة البيانات لتخزين اسم الصنف، سعره، والقسم الذي ينتمي إليه.
 */
@Entity
@Table(name = "menu_items", indexes = {
        @Index(name = "idx_menu_category", columnList = "categoryId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "اسم الصنف مطلوب")
    @Size(max = 200, message = "اسم الصنف لا يتجاوز 200 حرف")
    @Column(nullable = false, length = 200)
    private String name;

    @Positive(message = "السعر يجب أن يكون رقم موجب")
    @Column(nullable = false)
    private Double price;

    @NotBlank(message = "القسم مطلوب")
    @Size(max = 50, message = "معرف القسم لا يتجاوز 50 حرف")
    @Column(nullable = false, length = 50)
    private String categoryId;

    @Column(length = 1000)
    private String description;

    @Column(length = 2000)
    private String imageUrl;
}
