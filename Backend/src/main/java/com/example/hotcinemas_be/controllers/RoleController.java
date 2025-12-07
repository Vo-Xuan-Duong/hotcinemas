package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.role.requests.RoleRequest;
import com.example.hotcinemas_be.dtos.role.responses.RoleResponse;
import com.example.hotcinemas_be.services.RoleService;
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
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Role Management", description = "APIs for managing roles and permissions")
public class RoleController {

    private final RoleService roleService;

    @Operation(summary = "Create a new role", description = "This endpoint allows an admin to create a new role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Role created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Role with this code/name already exists")
    })
    @PostMapping
    public ResponseEntity<ResponseData<RoleResponse>> createRole(
            @Valid @RequestBody RoleRequest roleRequest) {
        log.info("Creating new role with code: {}", roleRequest.getCode());
        RoleResponse roleResponse = roleService.createRole(roleRequest);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Role has been successfully created")
                .data(roleResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
    }

    @Operation(summary = "Get all roles", description = "This endpoint retrieves all roles with pagination.")
    @GetMapping
    public ResponseEntity<ResponseData<Page<RoleResponse>>> getAllRoles(
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("Retrieving all roles with pagination");
        Page<RoleResponse> roles = roleService.getPageRoles(pageable);

        ResponseData<Page<RoleResponse>> responseData = ResponseData.<Page<RoleResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Roles retrieved successfully")
                .data(roles)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get all roles (no pagination)", description = "This endpoint retrieves all roles without pagination.")
    @GetMapping("/all")
    public ResponseEntity<ResponseData<List<RoleResponse>>> getAllRolesList() {
        log.info("Retrieving all roles without pagination");
        List<RoleResponse> roles = roleService.getAllRoles();

        ResponseData<List<RoleResponse>> responseData = ResponseData.<List<RoleResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Roles retrieved successfully")
                .data(roles)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get a role by ID", description = "This endpoint retrieves a role by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role found"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<RoleResponse>> getRoleById(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("Retrieving role with ID: {}", id);
        RoleResponse role = roleService.getRoleById(id);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Role retrieved successfully")
                .data(role)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get a role by code", description = "This endpoint retrieves a role by its code.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role found"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @GetMapping("/code/{code}")
    public ResponseEntity<ResponseData<RoleResponse>> getRoleByCode(
            @Parameter(description = "Role code") @PathVariable String code) {
        log.info("Retrieving role with code: {}", code);
        RoleResponse role = roleService.getRoleByCode(code);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Role retrieved successfully")
                .data(role)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Update a role", description = "This endpoint allows an admin to update an existing role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role updated successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ResponseData<RoleResponse>> updateRole(
            @Parameter(description = "Role ID") @PathVariable Long id,
            @Valid @RequestBody RoleRequest roleRequest) {
        log.info("Updating role with ID: {}", id);
        RoleResponse roleResponse = roleService.updateRole(id, roleRequest);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Role has been successfully updated")
                .data(roleResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Partially update a role", description = "This endpoint allows an admin to partially update an existing role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role partially updated successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ResponseData<RoleResponse>> partialUpdateRole(
            @Parameter(description = "Role ID") @PathVariable Long id,
            @RequestBody RoleRequest roleRequest) {
        log.info("Partially updating role with ID: {}", id);
        RoleResponse roleResponse = roleService.updateRole(id, roleRequest);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Role has been partially updated")
                .data(roleResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Delete a role", description = "This endpoint allows an admin to delete a role by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseData<Void>> deleteRole(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("Deleting role with ID: {}", id);
        roleService.deleteRole(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Role has been successfully deleted")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Activate a role", description = "This endpoint activates a role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role activated successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ResponseData<Void>> activateRole(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("Activating role with ID: {}", id);
        roleService.activateRole(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Role has been successfully activated")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Deactivate a role", description = "This endpoint deactivates a role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role deactivated successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<ResponseData<Void>> deactivateRole(
            @Parameter(description = "Role ID") @PathVariable Long id) {
        log.info("Deactivating role with ID: {}", id);
        roleService.deactivateRole(id);

        ResponseData<Void> responseData = ResponseData.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Role has been successfully deactivated")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Add permissions to role", description = "This endpoint adds permissions to a role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permissions added to role successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @PostMapping("/{id}/permissions")
    public ResponseEntity<ResponseData<RoleResponse>> addPermissionsToRole(
            @Parameter(description = "Role ID") @PathVariable Long id,
            @RequestBody List<Long> permissionIds) {
        log.info("Adding permissions {} to role {}", permissionIds, id);
        RoleResponse roleResponse = roleService.addPermissionsToRole(id, permissionIds);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Permissions have been successfully added to role")
                .data(roleResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Remove permissions from role", description = "This endpoint removes permissions from a role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Permissions removed from role successfully"),
            @ApiResponse(responseCode = "404", description = "Role not found")
    })
    @DeleteMapping("/{id}/permissions")
    public ResponseEntity<ResponseData<RoleResponse>> removePermissionsFromRole(
            @Parameter(description = "Role ID") @PathVariable Long id,
            @RequestBody List<Long> permissionIds) {
        log.info("Removing permissions {} from role {}", permissionIds, id);
        RoleResponse roleResponse = roleService.removePermissionsFromRole(id, permissionIds);

        ResponseData<RoleResponse> responseData = ResponseData.<RoleResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Permissions have been successfully removed from role")
                .data(roleResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(responseData);
    }
}
