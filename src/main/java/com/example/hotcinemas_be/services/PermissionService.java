package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.permission.requests.PermissionRequest;
import com.example.hotcinemas_be.dtos.permission.responses.PermissionResponse;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.PermissionMapper;
import com.example.hotcinemas_be.models.Permission;
import com.example.hotcinemas_be.repositorys.PermissionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    public PermissionService(PermissionRepository permissionRepository,
            PermissionMapper permissionMapper) {
        this.permissionRepository = permissionRepository;
        this.permissionMapper = permissionMapper;
    }

    public PermissionResponse createPermission(PermissionRequest permissionRequest) {
        Permission permission = Permission.builder()
                .code(permissionRequest.getCode())
                .name(permissionRequest.getName())
                .description(permissionRequest.getDescription())
                .isActive(false)
                .build();
        Permission savedPermission = permissionRepository.save(permission);
        return permissionMapper.mapToResponse(savedPermission);
    }

    public PermissionResponse getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ErrorException(ErrorCode.ERROR_PERMISSION_NOT_FOUND));
        return permissionMapper.mapToResponse(permission);
    }

    public PermissionResponse updatePermission(Long id, PermissionRequest permissionRequest) {
        Permission existingPermission = permissionRepository.findById(id)
                .orElseThrow(() -> new ErrorException(ErrorCode.ERROR_PERMISSION_NOT_FOUND));
        existingPermission.setCode(permissionRequest.getCode());
        existingPermission.setName(permissionRequest.getName());
        existingPermission.setDescription(permissionRequest.getDescription());
        existingPermission.setIsActive(permissionRequest.getIsActive());
        Permission updatedPermission = permissionRepository.save(existingPermission);
        return permissionMapper.mapToResponse(updatedPermission);
    }

    public Permission getById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ErrorException(ErrorCode.ERROR_PERMISSION_NOT_FOUND));
    }

    public void deletePermission(Long id) {
        Permission existingPermission = permissionRepository.findById(id)
                .orElseThrow(() -> new ErrorException(ErrorCode.ERROR_PERMISSION_NOT_FOUND));
        permissionRepository.delete(existingPermission);
    }

    public Page<PermissionResponse> getPermissions(Pageable pageable) {
        Page<Permission> permissions = permissionRepository.findAll(pageable);
        return permissions.map(permissionMapper::mapToResponse);
    }

    public List<PermissionResponse> getAllPermissions() {
        List<Permission> permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::mapToResponse).toList();
    }

    public void activatePermission(Long id) {
        Permission existingPermission = permissionRepository.findById(id)
                .orElseThrow(() -> new ErrorException(ErrorCode.ERROR_PERMISSION_NOT_FOUND));
        existingPermission.setIsActive(true);
        permissionRepository.save(existingPermission);
    }

    public void deactivatePermission(Long id) {
        Permission existingPermission = permissionRepository.findById(id)
                .orElseThrow(() -> new ErrorException(ErrorCode.ERROR_PERMISSION_NOT_FOUND));
        existingPermission.setIsActive(false);
        permissionRepository.save(existingPermission);
    }
}
