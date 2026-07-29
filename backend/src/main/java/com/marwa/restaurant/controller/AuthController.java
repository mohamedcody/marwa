package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.AuthRequest;
import com.marwa.restaurant.dto.AuthResponse;
import com.marwa.restaurant.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * متحكم المصادقة (Authentication Controller).
 * مسؤول عن معالجة طلبات تسجيل الدخول والتحقق من رقم الهاتف.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;

    /**
     * عملية تسجيل دخول المسؤول.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.authenticate(request);
            log.info("تسجيل دخول ناجح للهاتف: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            log.warn("محاولة دخول لحساب معطل: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            log.warn("محاولة دخول مرفوضة للهاتف: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("خطأ غير متوقع أثناء تسجيل الدخول", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "حدث خطأ داخلي في الخادم"));
        }
    }
}
