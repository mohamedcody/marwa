package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * مستودع أصناف قائمة الطعام (Menu Item Repository).
 * يوفر عمليات الوصول والتعامل مع جدول أصناف قائمة الطعام في قاعدة البيانات باستخدام JPA.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    /**
     * البحث عن أصناف قائمة الطعام بناءً على معرف القسم (Category ID).
     */
    List<MenuItem> findByCategoryId(String categoryId);
}
