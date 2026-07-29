package com.marwa.restaurant;

import com.marwa.restaurant.entity.MenuItem;
import com.marwa.restaurant.entity.Photo;
import com.marwa.restaurant.entity.User;
import com.marwa.restaurant.repository.MenuItemRepository;
import com.marwa.restaurant.repository.PhotoRepository;
import com.marwa.restaurant.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.File;

/**
 * الفئة الرئيسية لتشغيل تطبيق مطعم مروة (Spring Boot).
 * تقوم بتشغيل الخادم وتهيئة المجلدات والبيانات الأولية عند بدء التشغيل.
 */
@SpringBootApplication
public class MarwaRestaurantApplication {

    /**
     * نقطة الدخول الرئيسية لتشغيل التطبيق.
     */
    public static void main(String[] args) {
        // تحميل ملف .env برمجياً لتسهيل التطوير المحلي
        java.io.File envFile = new java.io.File(".env");
        if (envFile.exists()) {
            try {
                java.nio.file.Files.readAllLines(envFile.toPath()).forEach(line -> {
                    String trimmed = line.trim();
                    if (!trimmed.isEmpty() && !trimmed.startsWith("#") && trimmed.contains("=")) {
                        int index = trimmed.indexOf("=");
                        String key = trimmed.substring(0, index).trim();
                        String value = trimmed.substring(index + 1).trim();
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        if (System.getenv(key) == null && System.getProperty(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                });
            } catch (Exception e) {
                System.err.println("فشل تحميل ملف .env: " + e.getMessage());
            }
        }
        SpringApplication.run(MarwaRestaurantApplication.class, args);
    }

}
