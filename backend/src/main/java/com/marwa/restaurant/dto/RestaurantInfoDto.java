package com.marwa.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * كائن نقل البيانات لمعلومات المطعم (RestaurantInfo DTO).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantInfoDto {

    @NotBlank(message = "اسم المطعم مطلوب")
    private String name;

    private String description;
    private String address;
    private String phoneNumber;
    private String email;
    private String workingHours;
    private String facebookUrl;
    private String instagramUrl;
}
