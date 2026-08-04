package com.marwa.restaurant.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * تهيئة إعدادات Cloudinary (Cloud File Storage Configuration).
 * تُنشئ كائن Cloudinary كـ Bean مُدار من Spring لاستخدامه في خدمة رفع الملفات.
 *
 * القيم تُقرأ من متغيرات البيئة:
 * - CLOUDINARY_CLOUD_NAME: اسم السحابة في حساب Cloudinary
 * - CLOUDINARY_API_KEY: مفتاح الـ API
 * - CLOUDINARY_API_SECRET: المفتاح السري للـ API
 */
@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
}
