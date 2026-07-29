package com.marwa.restaurant.service;

import com.marwa.restaurant.dto.AuthRequest;
import com.marwa.restaurant.dto.AuthResponse;
import com.marwa.restaurant.entity.User;
import com.marwa.restaurant.repository.UserRepository;
import com.marwa.restaurant.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * خدمة المصادقة (Auth Service).
 * تدير عمليات التحقق من بيانات الدخول وإصدار رموز JWT.
 * تستخدم BCrypt للتحقق من كلمات المرور المشفرة.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * التحقق من رقم الهاتف وكلمة المرور وإصدار توكن JWT.
     * يدعم كلمات المرور المشفرة بـ BCrypt وكذلك Plain Text (للتوافق المؤقت مع البيانات القديمة).
     */
    public AuthResponse authenticate(AuthRequest request) {
        String phoneNumber = request.getUsername() != null ? request.getUsername().trim() : "";
        String pass = request.getPassword() != null ? request.getPassword().trim() : "";

        if (phoneNumber.isEmpty()) {
            throw new IllegalArgumentException("يرجى إدخال رقم الهاتف");
        }
        if (pass.isEmpty()) {
            throw new IllegalArgumentException("يرجى إدخال كلمة المرور");
        }

        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (!user.getIsActive()) {
                throw new IllegalStateException("الحساب معطل، يرجى التواصل مع الإدارة");
            }

            // التحقق من كلمة المرور: يدعم BCrypt والنص العادي (للتوافق المؤقت)
            boolean passwordMatches = false;
            String storedPassword = user.getPassword();

            if (storedPassword != null) {
                if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
                    // كلمة المرور مشفرة بـ BCrypt
                    passwordMatches = passwordEncoder.matches(pass, storedPassword);
                } else {
                    // كلمة المرور بالنص العادي (للتوافق المؤقت — سيتم ترقيتها)
                    passwordMatches = pass.equals(storedPassword);
                }
            }

            if (passwordMatches) {
                String role = user.getRole() != null ? user.getRole() : "ROLE_USER";
                String token = jwtUtil.generateToken(phoneNumber, role);
                return new AuthResponse(token, phoneNumber, role);
            }
        }
        throw new SecurityException("عذراً، رقم الهاتف أو كلمة المرور غير صحيحة");
    }
}
