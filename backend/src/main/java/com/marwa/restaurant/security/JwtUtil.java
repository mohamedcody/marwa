package com.marwa.restaurant.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * أداة إدارة رموز JWT (JwtUtil).
 * مسؤولة عن إنشاء التوكن والتحقق من صحته وقراءته واستخراج البيانات منه.
 * التوكن يحتوي على: اسم المستخدم (subject) + الصلاحية (role claim).
 */
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    /**
     * توليد مفتاح التوقيع الخاص بالتشفير (Signing Key) بناءً على السر المحدد في الإعدادات.
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * إنشاء رمز توكن (Token) جديد للمستخدم بعد تسجيل دخوله بنجاح.
     * يُضمّن الصلاحية الفعلية من قاعدة البيانات بدلاً من تثبيتها.
     *
     * @param username اسم المستخدم أو رقم الهاتف
     * @param role     الصلاحية الفعلية من قاعدة البيانات (مثال: ROLE_ADMIN أو ROLE_USER)
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * استخراج اسم المستخدم من داخل الرمز (Token).
     */
    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * استخراج صلاحية المستخدم من داخل الرمز (Token).
     */
    public String getRoleFromToken(String token) {
        Object role = parseClaims(token).get("role");
        return role != null ? role.toString() : "ROLE_USER";
    }

    /**
     * التحقق من صحة وصلاحية الرمز (Token) والتأكد من عدم انتهاء صلاحيته أو التلاعب به.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * تحليل واستخراج البيانات (Claims) من التوكن — دالة مساعدة مشتركة.
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
