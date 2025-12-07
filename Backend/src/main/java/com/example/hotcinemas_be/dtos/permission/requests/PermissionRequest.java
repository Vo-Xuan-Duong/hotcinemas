package com.example.hotcinemas_be.dtos.permission.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PermissionRequest {
    private String code;
    private String name;
    private String description;
    private Boolean isActive;
}


























