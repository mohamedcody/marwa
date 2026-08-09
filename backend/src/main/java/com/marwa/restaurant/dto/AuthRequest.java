package com.marwa.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * كائن طلب المصادقة (AuthRequest DTO).
 * يمثل البيانات المرسلة من الفرونت إند عند محاولة تسجيل دخول المسؤول (اسم
 * المستخدم وكلمة المرور).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    
    private String username;
    private String password;

}
