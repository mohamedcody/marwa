package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * مستودع معرض الصور (Photo Repository).
 * يوفر عمليات الوصول والتعامل مع جدول الصور في قاعدة البيانات باستخدام JPA.
 */
@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    /**
     * جلب جميع الصور من قاعدة البيانات مرتبة تنازلياً حسب المعرف (من الأحدث إلى الأقدم).
     */
    List<Photo> findAllByOrderByIdDesc();

    /**
     * جلب الصور الخاصة بتصنيف معين مرتبة تنازلياً حسب المعرف.
     */
    List<Photo> findByCategoryOrderByIdDesc(String category);
}
