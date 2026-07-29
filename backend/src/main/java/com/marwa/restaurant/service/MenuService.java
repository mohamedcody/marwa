package com.marwa.restaurant.service;

import com.marwa.restaurant.dto.MenuItemDto;
import com.marwa.restaurant.entity.MenuItem;
import com.marwa.restaurant.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * خدمة قائمة الطعام (Menu Service).
 * تدير العمليات الخاصة بالمنيو وتحول الكيانات إلى كائنات DTO.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    /**
     * جلب جميع أصناف المنيو كـ DTOs.
     */
    public List<MenuItemDto> getAllMenuItems() {
        return menuItemRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * إضافة صنف جديد للمنيو.
     */
    @Transactional
    public MenuItemDto addMenuItem(MenuItemDto dto) {
        MenuItem menuItem = MenuItem.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .categoryId(dto.getCategoryId())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .build();
        MenuItem saved = menuItemRepository.save(menuItem);
        return convertToDto(saved);
    }

    /**
     * تعديل صنف حالي في المنيو.
     */
    @Transactional
    public MenuItemDto updateMenuItem(Long id, MenuItemDto dto) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("الصنف غير موجود بالمعرف: " + id));

        item.setName(dto.getName());
        item.setPrice(dto.getPrice());
        item.setDescription(dto.getDescription());
        item.setImageUrl(dto.getImageUrl());
        if (dto.getCategoryId() != null) {
            item.setCategoryId(dto.getCategoryId());
        }
        
        MenuItem saved = menuItemRepository.save(item);
        return convertToDto(saved);
    }

    /**
     * حذف صنف من المنيو.
     */
    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new IllegalArgumentException("الصنف غير موجود بالمعرف: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    /**
     * تحويل الكيان إلى DTO.
     */
    private MenuItemDto convertToDto(MenuItem menuItem) {
        return MenuItemDto.builder()
                .id(menuItem.getId())
                .name(menuItem.getName())
                .price(menuItem.getPrice())
                .categoryId(menuItem.getCategoryId())
                .description(menuItem.getDescription())
                .imageUrl(menuItem.getImageUrl())
                .build();
    }
}
