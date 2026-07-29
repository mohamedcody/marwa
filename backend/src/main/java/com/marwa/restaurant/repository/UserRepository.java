package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * مستودع المستخدمين (User Repository).
 * يوفر عمليات التعامل مع جدول المستخدمين المصرح لهم بالتعديل في قاعدة البيانات.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * البحث عن مستخدم مصرح له بواسطة رقم الهاتف.
     */
    Optional<User> findByPhoneNumber(String phoneNumber);

    /**
     * التحقق من وجود رقم الهاتف في قاعدة البيانات.
     */
    boolean existsByPhoneNumber(String phoneNumber);
}
