package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.VideoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

/**
 * مستودع مشاهدات الفيديو (VideoView Repository).
 * يوفر عمليات التعامل مع جدول مشاهدات الفيديو في قاعدة البيانات.
 */
@Repository
public interface VideoViewRepository extends JpaRepository<VideoView, Long> {

    /**
     * حساب عدد المشاهدات لفيديو محدد.
     */
    long countByVideoId(Long videoId);

    /**
     * التحقق من وجود مشاهدة سابقة من نفس المستخدم خلال فترة زمنية محددة.
     * يمنع احتساب مشاهدات متكررة خلال فترة قصيرة (throttle).
     */
    boolean existsByVideoIdAndUserIdentifierAndCreatedAtAfter(Long videoId, String userIdentifier, LocalDateTime after);
}
