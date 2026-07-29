package com.marwa.restaurant.repository;

import com.marwa.restaurant.entity.RestaurantInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * مستودع معلومات المطعم (RestaurantInfo Repository).
 */
@Repository
public interface RestaurantInfoRepository extends JpaRepository<RestaurantInfo, Long> {
}
