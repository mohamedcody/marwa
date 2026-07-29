package com.marwa.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * كيان مشاركة الفيديو (VideoShare Entity).
 * يمثل جدول 'video_shares' في قاعدة البيانات لتسجيل مشاركات المستخدمين للفيديوهات.
 */
@Entity
@Table(name = "video_shares", indexes = {
        @Index(name = "idx_video_shares_video", columnList = "video_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(name = "user_identifier", length = 255)
    private String userIdentifier;

    @Column(name = "platform", length = 50)
    private String platform;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
