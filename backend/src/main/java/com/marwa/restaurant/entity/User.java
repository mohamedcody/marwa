package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان المستخدم المصرح له باللوحة (User Entity).
 * يمثل جدول 'users' في قاعدة البيانات لتخزين بيانات الأشخاص المصرح لهم بالتعديل والإدارة.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "رقم الهاتف مطلوب")
    @Size(min = 10, max = 15, message = "رقم الهاتف يجب أن يكون بين 10 و 15 رقماً")
    @Column(nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @NotBlank(message = "الاسم مطلوب")
    @Size(max = 100, message = "الاسم لا يتجاوز 100 حرف")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "الصلاحية مطلوبة")
    @Column(nullable = false, length = 20)
    private String role; // "ROLE_ADMIN"

    @NotBlank(message = "كلمة المرور مطلوبة")
    @Size(min = 6, message = "كلمة المرور يجب أن لا تقل عن 6 أحرف")
    @Column(nullable = true)
    private String password;

    @Column(name = "is_active")
    private Boolean isActive = true; // للتحكم في إيقاف أو تفعيل حساب المسؤول دون حذفه

    @Column(name = "created_at")
    private LocalDateTime createdAt; // تاريخ إنشاء الحساب

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // تاريخ آخر تعديل على الحساب

    public Boolean getIsActive() {
        return isActive == null || isActive;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
