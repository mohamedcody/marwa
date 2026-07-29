package com.marwa.restaurant.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * تهيئة إعدادات الويب (Web Configuration).
 * مسؤولة عن ربط مجلد الرفع (uploads) بمسار ويب خارجي للتمكن من عرض الصور المرفوعة مباشرة عبر المتصفح.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    /**
     * تكوين معالجة الموارد الثابتة (Static Resources).
     * يقوم بتحويل مسار المجلد المحلي "uploads" إلى رابط URL متاح للعامة "/uploads/**".
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        String path = folder.getAbsolutePath();
        if (!path.endsWith(File.separator)) {
            path += File.separator;
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + path);
    }
}
