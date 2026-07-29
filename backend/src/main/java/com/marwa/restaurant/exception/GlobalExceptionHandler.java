package com.marwa.restaurant.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * معالج الأخطاء المركزي (Global Exception Handler).
 * يلتقط جميع الاستثناءات ويعيد رسائل JSON منظمة وآمنة للعميل
 * بدون كشف تفاصيل داخلية أو Stack Traces.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * معالجة رفض الوصول (403 Forbidden).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        log.warn("رفض وصول: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(errorResponse(HttpStatus.FORBIDDEN, "ليس لديك صلاحية للوصول لهذا المورد"));
    }

    /**
     * معالجة تجاوز الحجم الأقصى للملفات المرفوعة.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> handleMaxUploadSize(MaxUploadSizeExceededException ex) {
        log.warn("تجاوز حجم الملف المسموح: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(errorResponse(HttpStatus.PAYLOAD_TOO_LARGE, "حجم الملف يتجاوز الحد الأقصى المسموح"));
    }

    /**
     * معالجة المورد غير الموجود (404).
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNotFound(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(errorResponse(HttpStatus.NOT_FOUND, "المورد المطلوب غير موجود"));
    }

    /**
     * معالجة أخطاء التحقق من البيانات المرسلة (400 Bad Request).
     */
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        java.util.Map<String, String> errors = new java.util.HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        log.warn("أخطاء في التحقق من البيانات المدخلة: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "timestamp", LocalDateTime.now().toString(),
                        "status", HttpStatus.BAD_REQUEST.value(),
                        "error", "Bad Request",
                        "message", "البيانات المدخلة غير صالحة",
                        "validationErrors", errors
                ));
    }

    /**
     * معالجة أخطاء منطق العمليات (400 Bad Request).
     */
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<?> handleBusinessExceptions(Exception ex) {
        log.warn("خطأ في منطق العمليات: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(errorResponse(HttpStatus.BAD_REQUEST, ex.getMessage()));
    }

    /**
     * معالجة أي خطأ غير متوقع (500 Internal Server Error).
     * لا يكشف أي تفاصيل داخلية للعميل.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception ex) {
        log.error("خطأ غير متوقع: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "حدث خطأ داخلي، يرجى المحاولة مرة أخرى"));
    }

    /**
     * تكوين رسالة خطأ منظمة بـ JSON.
     */
    private Map<String, Object> errorResponse(HttpStatus status, String message) {
        return Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message
        );
    }
}
