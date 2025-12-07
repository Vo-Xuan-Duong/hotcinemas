package com.example.hotcinemas_be.mappers;

import com.example.hotcinemas_be.dtos.user.responses.UserResponse;
import com.example.hotcinemas_be.models.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserResponse mapToResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .role(user.getRole().getCode())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
