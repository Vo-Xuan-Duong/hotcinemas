package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.permission.requests.PermissionRequest;
import com.example.hotcinemas_be.dtos.permission.responses.PermissionResponse;
import com.example.hotcinemas_be.services.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Permission Management", description = "APIs for managing permissions")
public class PermissionController {

    private final PermissionService permissionService;

    @Operation(summary = "Create a new permission", description = "This endpoint allows an admin to create a new permission.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Permission created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Permission with this code/name already exists")
    })
    @PostMapping
    public ResponseEntity<ResponseData<PermissionResponse>> createPermission(
            @Valid @RequestBody PermissionRequest permissionRequest) {
        log.info("Creating new permission with code: {}", permissionRequest.getCode());
        PermissionResponse permissionResponse = permissionService.createPermission(permissionRequest);

        ResponseData<PermissionResponse> responseData = ResponseData.<PermissionResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Permission has been successfully created")
                .data(permissionResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @Operation(summary = "Get all permissions", description = "This endpoint retrieves all permissions with pagination.")
    @GetMapping
    public ResponseEntity<ResponseData<Page<PermissionResponse>>> getAllPermissions(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("Retrieving all permissions with pagination");
        Page<PermissionResponse> permissions = permissionService.getPermissions(pageable);

        ResponseData<Page<PermissionResponse>> responseData = ResponseData.<Page<PermissionResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Permissions retrieved successfully")
                .data(permissions)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all permissions (no pagination)", description = "This endpoint retrieves all permissions without pagination.")
    @GetMapping("/all")
    public ResponseEntity<ResponseData<List<PermissionResponse>>> getAllPermissionsList() {
        log.info("Retrieving all permissions without pagination");
        List<PermissionResponse> permissions = permissionService.getAllPermissions();

        ResponseData<List<PermissionResponse>> responseData = ResponseData.<List<PermissionResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Permissions retrieved successfully")
                .data(permissions)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get a permission by ID", description = "This endpoint retrieves a permission by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permission found"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<PermissionResponse>> getPermissionById(
            @Parameter(description = "Permission ID") @PathVariable Long id) {
        log.info("Retrieving permission with ID: {}", id);
        PermissionResponse permission = permissionService.getPermissionById(id);

        ResponseData<PermissionResponse> responseData = ResponseData.<PermissionResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Permission retrieved successfully")
                .data(permission)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Update a permission", description = "This endpoint allows an admin to update an existing permission.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permission updated successfully"),
            @ApiResponse(responseCode = "404", description = "Permission not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ResponseData<PermissionResponse>> updatePermission(
            @Parameter(description = "Permission ID") @PathVariable Long id,
            @Valid @RequestBody PermissionRequest permissionRequest) {
        log.info("Updating permission with ID: {}", id);
        PermissionResponse permissionResponse = permissionService.updatePermission(id, permissionRequest);

        ResponseData<PermissionResponse> responseData = ResponseData.<PermissionResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Permission has been successfully updated")
                .data(permissionResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Partially update a permission", description = "This endpoint allows an admin to partially update an existing permission.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permission partially updated successfully"),
            @ApiResponse(responseCode = "404", description = "Permission not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ResponseData<PermissionResponse>> partialUpdatePermission(
            @Parameter(description = "Permission ID") @PathVariable Long id,
            @RequestBody PermissionRequest permissionRequest) {
        log.info("Partially updating permission with ID: {}", id);
        PermissionResponse permissionResponse = permissionService.updatePermission(id, permissionRequest);

        ResponseData<PermissionResponse> responseData = ResponseData.<PermissionResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Permission has been partially updated")
                .data(permissionResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete a permission", description = "This endpoint allows an admin to delete a permission by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permission deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseData<Void>> deletePermission(
            @Parameter(description = "Permission ID") @PathVariable Long id) {
        log.info("Deleting permission with ID: {}", id);
        permissionService.deletePermission(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Permission has been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Activate a permission", description = "This endpoint activates a permission.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permission activated successfully"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ResponseData<Void>> activatePermission(
            @Parameter(description = "Permission ID") @PathVariable Long id) {
        log.info("Activating permission with ID: {}", id);
        permissionService.activatePermission(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Permission has been successfully activated")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Deactivate a permission", description = "This endpoint deactivates a permission.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permission deactivated successfully"),
            @ApiResponse(responseCode = "404", description = "Permission not found")
    })
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ResponseData<Void>> deactivatePermission(
            @Parameter(description = "Permission ID") @PathVariable Long id) {
        log.info("Deactivating permission with ID: {}", id);
        permissionService.deactivatePermission(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Permission has been successfully deactivated")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }
}
