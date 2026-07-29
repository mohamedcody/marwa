package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان مشاهدة الفيديو (VideoView Entity).
 * يمثل جدول 'video_views' في قاعدة البيانات لتسجيل مشاهدات المستخدمين للفيديوهات.
 */
@Entity
@Table(name = "video_views", indexes = {
        @Index(name = "idx_video_views_video", columnList = "video_id"),
        @Index(name = "idx_video_views_user", columnList = "video_id, user_identifier")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(name = "user_identifier", nullable = false, length = 255)
    private String userIdentifier;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
