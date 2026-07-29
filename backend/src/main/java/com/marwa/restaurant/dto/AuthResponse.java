package com.marwa.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * كائن استجابة المصادقة (AuthResponse DTO).
 * يمثل البيانات الراجعة إلى الفرونت إند بعد نجاح تسجيل الدخول (رمز التوكن، اسم المستخدم، وصلاحياته).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String role;
}
