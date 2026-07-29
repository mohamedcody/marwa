package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.RestaurantInfoDto;
import com.marwa.restaurant.service.RestaurantInfoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * متحكم معلومات المطعم (RestaurantInfo Controller).
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestaurantInfoController {

    private final RestaurantInfoService infoService;

    /**
     * جلب بيانات المطعم العامة.
     * متاح للجميع بدون مصادقة.
     */
    @GetMapping("/info")
    public ResponseEntity<RestaurantInfoDto> getInfo() {
        return ResponseEntity.ok(infoService.getInfo());
    }

    /**
     * تحديث بيانات المطعم.
     * يتطلب صلاحيات المسؤول (ADMIN).
     */
    @PutMapping("/admin/info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestaurantInfoDto> updateInfo(@Valid @RequestBody RestaurantInfoDto dto) {
        return ResponseEntity.ok(infoService.updateInfo(dto));
    }
}
