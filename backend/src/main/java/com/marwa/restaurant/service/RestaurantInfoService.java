package com.marwa.restaurant.service;

import com.marwa.restaurant.dto.RestaurantInfoDto;
import com.marwa.restaurant.entity.RestaurantInfo;
import com.marwa.restaurant.repository.RestaurantInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * خدمة معلومات المطعم (RestaurantInfo Service).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantInfoService {

    private final RestaurantInfoRepository repository;

    /**
     * جلب بيانات المطعم. إذا كانت فارغة، يتم إنشاء البيانات الافتراضية وحفظها.
     */
    @Transactional
    public RestaurantInfoDto getInfo() {
        RestaurantInfo info = repository.findById(1L)
                .orElseGet(() -> {
                    RestaurantInfo defaultInfo = RestaurantInfo.builder()
                            .id(1L)
                            .name("مطعم المروة")
                            .description("طعم أصيل من قلب القاهرة")
                            .address("المرج الشرقية، بجوار نادي المرج")
                            .phoneNumber("01221365286")
                            .email("marwa-restaurant.eg@gmail.com")
                            .workingHours("يومياً 4ص - 4م")
                            .facebookUrl("https://facebook.com/marwa-restaurant")
                            .instagramUrl("https://instagram.com/marwa-restaurant")
                            .build();
                    return repository.save(defaultInfo);
                });
        return convertToDto(info);
    }

    /**
     * تحديث بيانات المطعم (خاص بالأدمن).
     */
    @Transactional
    public RestaurantInfoDto updateInfo(RestaurantInfoDto dto) {
        RestaurantInfo info = repository.findById(1L)
                .orElseGet(() -> {
                    RestaurantInfo defaultInfo = RestaurantInfo.builder().id(1L).build();
                    return repository.save(defaultInfo);
                });

        info.setName(dto.getName());
        info.setDescription(dto.getDescription());
        info.setAddress(dto.getAddress());
        info.setPhoneNumber(dto.getPhoneNumber());
        info.setEmail(dto.getEmail());
        info.setWorkingHours(dto.getWorkingHours());
        info.setFacebookUrl(dto.getFacebookUrl());
        info.setInstagramUrl(dto.getInstagramUrl());

        RestaurantInfo saved = repository.save(info);
        return convertToDto(saved);
    }

    private RestaurantInfoDto convertToDto(RestaurantInfo info) {
        return RestaurantInfoDto.builder()
                .name(info.getName())
                .description(info.getDescription())
                .address(info.getAddress())
                .phoneNumber(info.getPhoneNumber())
                .email(info.getEmail())
                .workingHours(info.getWorkingHours())
                .facebookUrl(info.getFacebookUrl())
                .instagramUrl(info.getInstagramUrl())
                .build();
    }
}
