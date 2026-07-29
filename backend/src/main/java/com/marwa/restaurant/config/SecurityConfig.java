package com.marwa.restaurant.config;

import com.marwa.restaurant.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * تهيئة إعدادات الأمان (Security Configuration).
 * مسؤولة عن إعداد فلاتر الحماية، التحقق من رمز JWT، تحديد الصلاحيات للمسارات المختلفة وتفعيل الـ CORS.
 *
 * سياسة الحماية:
 * - GET requests: مفتوحة للجميع (عرض المنيو، الصور، الفيديوهات)
 * - POST /api/videos/{id}/like|view|share: مفتوحة للجميع (تفاعلات المستخدم)
 * - POST/PUT/DELETE: تتطلب مصادقة JWT + صلاحية ADMIN
 * - /api/auth/**: مفتوحة للجميع
 * - /uploads/**: مفتوحة للجميع (عرض الملفات المرفوعة)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * إعداد تهيئة CORS (مشاركة الموارد بين أصول مختلفة).
     * تسمح للفرونت إند (React/Vite) بالاتصال بالباك إند من أي مكان محلي أو خارجي.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * إعداد سلسلة فلاتر الأمان (Security Filter Chain).
     *
     * المسارات المفتوحة للجميع:
     * - GET /api/menu, /api/photos, /api/videos, /api/info, /uploads — عرض فقط
     * - POST /api/auth/** — تسجيل الدخول
     * - POST /api/videos/{id}/like|view|share — تفاعلات المستخدمين العامة
     *
     * جميع العمليات الأخرى (POST, PUT, DELETE) تتطلب مصادقة JWT.
     * الحماية الإضافية بـ @PreAuthorize على مستوى الـ Method تمنع المستخدمين غير ADMIN.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // المصادقة مفتوحة للجميع
                        .requestMatchers("/api/auth/**").permitAll()

                        // عرض الملفات المرفوعة مفتوح للجميع
                        .requestMatchers("/uploads/**").permitAll()

                        // GET requests مفتوحة للجميع (عرض البيانات فقط)
                        .requestMatchers(HttpMethod.GET, "/api/menu", "/api/menu/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/photos", "/api/photos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/videos", "/api/videos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/info").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/orders", "/api/orders/**").permitAll()

                        // تفاعلات الفيديو (likes, views, shares) مفتوحة للجميع
                        .requestMatchers(HttpMethod.POST, "/api/videos/*/like").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/videos/*/view").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/videos/*/share").permitAll()

                        // جميع العمليات الأخرى تتطلب مصادقة
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
