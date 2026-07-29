package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان إعجاب الفيديو (VideoLike Entity).
 * يمثل جدول 'video_likes' في قاعدة البيانات لتسجيل إعجابات المستخدمين بالفيديوهات.
 * يمنع التكرار عبر قيد فريد (unique constraint) على (video_id, user_identifier).
 */
@Entity
@Table(name = "video_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"video_id", "user_identifier"})
}, indexes = {
        @Index(name = "idx_video_likes_video", columnList = "video_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(name = "user_identifier", nullable = false, length = 255)
    private String userIdentifier;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
