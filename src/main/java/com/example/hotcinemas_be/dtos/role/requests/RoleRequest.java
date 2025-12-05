package com.example.hotcinemas_be.dtos.role.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleRequest {
    private String code;
    private String name;
    private String description;
}


























