package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان معلومات المطعم (RestaurantInfo Entity).
 * يمثل جدول 'restaurant_info' في قاعدة البيانات لتخزين البيانات التعريفية
 * للمطعم ومواعيد العمل.
 */
@Entity
@Table(name = "restaurant_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantInfo {

    @Id
    private Long id = 1L; // سنستخدم معرف وحيد دائماً (Singleton Pattern)

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(length = 255)
    private String address;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String workingHours;

    @Column(length = 255)
    private String facebookUrl;

    @Column(length = 255)
    private String instagramUrl;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
