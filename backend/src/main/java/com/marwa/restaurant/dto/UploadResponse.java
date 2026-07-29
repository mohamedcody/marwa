package com.marwa.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * كائن استجابة رفع الملفات (UploadResponse DTO).
 * يمثل البيانات الراجعة بعد رفع ملف بنجاح (اسم الملف الجديد، رابط الوصول إليه، ورسالة تأكيد النجاح).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {
    private String filename;
    private String url;
    private String message;
}
