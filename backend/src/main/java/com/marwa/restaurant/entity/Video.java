package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان الفيديو (Video Entity).
 * يمثل جدول 'videos' في قاعدة البيانات لتخزين الفيديوهات المرفوعة وروابط العرض.
 */
@Entity
@Table(name = "videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "عنوان الفيديو مطلوب")
    @Size(max = 300, message = "عنوان الفيديو لا يتجاوز 300 حرف")
    @Column(nullable = false, length = 300)
    private String title;

    @NotBlank(message = "رابط الفيديو مطلوب")
    @Size(max = 2000, message = "رابط الفيديو لا يتجاوز 2000 حرف")
    @Column(nullable = false, length = 2000)
    private String videoUrl;

    @Size(max = 1000, message = "وصف الفيديو لا يتجاوز 1000 حرف")
    @Column(length = 1000)
    private String description;

    @Builder.Default
    private Integer likes = 0;

    @Builder.Default
    private Integer views = 0;

    @Builder.Default
    private Integer shares = 0;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
