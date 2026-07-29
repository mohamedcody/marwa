package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.VideoLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * مستودع إعجابات الفيديو (VideoLike Repository).
 * يوفر عمليات التعامل مع جدول إعجابات الفيديو في قاعدة البيانات.
 */
@Repository
public interface VideoLikeRepository extends JpaRepository<VideoLike, Long> {

    /**
     * البحث عن إعجاب بواسطة معرف الفيديو ومعرف المستخدم.
     */
    Optional<VideoLike> findByVideoIdAndUserIdentifier(Long videoId, String userIdentifier);

    /**
     * حذف إعجاب بواسطة معرف الفيديو ومعرف المستخدم.
     */
    void deleteByVideoIdAndUserIdentifier(Long videoId, String userIdentifier);

    /**
     * حساب عدد الإعجابات لفيديو محدد.
     */
    long countByVideoId(Long videoId);

    /**
     * التحقق من وجود إعجاب سابق.
     */
    boolean existsByVideoIdAndUserIdentifier(Long videoId, String userIdentifier);
}
