package com.marwa.restaurant.controller;

import com.marwa.restaurant.dto.MenuItemDto;
import com.marwa.restaurant.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * متحكم قائمة الطعام (Menu Controller).
 * مسؤول عن معالجة العمليات الخاصة بأصناف قائمة الطعام (عرض، إضافة، تعديل، وحذف).
 */
@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    /**
     * جلب جميع أصناف قائمة الطعام.
     * متاح للجميع (لا يتطلب تسجيل دخول).
     */
    @GetMapping
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }

    /**
     * إضافة صنف جديد إلى قائمة الطعام.
     * يتطلب صلاحيات المسؤول (ADMIN).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> addMenuItem(@Valid @RequestBody MenuItemDto menuItemDto) {
        MenuItemDto saved = menuService.addMenuItem(menuItemDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * تعديل بيانات صنف موجود في قائمة الطعام باستخدام المعرف (ID).
     * يتطلب صلاحيات المسؤول (ADMIN).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDto> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemDto menuItemDto) {
        try {
            MenuItemDto updated = menuService.updateMenuItem(id, menuItemDto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * حذف صنف من قائمة الطعام باستخدام المعرف (ID).
     * يتطلب صلاحيات المسؤول (ADMIN).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.ok().body("تم حذف الصنف بنجاح");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
