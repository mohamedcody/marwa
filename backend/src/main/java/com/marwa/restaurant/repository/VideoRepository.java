package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * مستودع الفيديوهات (Video Repository).
 * يوفر عمليات الوصول والتعامل مع جدول الفيديوهات في قاعدة البيانات.
 */
@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    /**
     * جلب كافة الفيديوهات مرتبة من الأحدث إلى الأقدم.
     */
    List<Video> findAllByOrderByIdDesc();
}
