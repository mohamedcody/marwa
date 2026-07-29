package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان الصورة المعروضة (Photo Entity).
 * يمثل جدول 'photos' في قاعدة البيانات لتخزين مسار الصورة (src) والوصف المصاحب لها (caption) مع تاريخ الإضافة.
 */
@Entity
@Table(name = "photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "رابط الصورة مطلوب")
    @Size(max = 2000, message = "رابط الصورة لا يتجاوز 2000 حرف")
    @Column(nullable = false, length = 2000)
    private String src;

    @NotBlank(message = "وصف الصورة مطلوب")
    @Size(max = 500, message = "وصف الصورة لا يتجاوز 500 حرف")
    @Column(nullable = false, length = 500)
    private String caption;

    private LocalDateTime createdAt;

    @Column(name = "category", length = 50, nullable = true)
    private String category; // "general", "lambi", "said", "nazer"

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (category == null) {
            category = "general";
        }
    }
}
