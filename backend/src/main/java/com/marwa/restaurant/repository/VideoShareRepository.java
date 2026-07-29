package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.VideoShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * مستودع مشاركات الفيديو (VideoShare Repository).
 * يوفر عمليات التعامل مع جدول مشاركات الفيديو في قاعدة البيانات.
 */
@Repository
public interface VideoShareRepository extends JpaRepository<VideoShare, Long> {

    /**
     * حساب عدد المشاركات لفيديو محدد.
     */
    long countByVideoId(Long videoId);
}
