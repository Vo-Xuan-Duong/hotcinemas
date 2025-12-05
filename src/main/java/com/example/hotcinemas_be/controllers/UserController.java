package com.example.hotcinemas_be.controllers;

import java.time.LocalDateTime;

import com.example.hotcinemas_be.dtos.user.requests.*;
import com.example.hotcinemas_be.dtos.auth.requests.RegisterRequest;
import com.example.hotcinemas_be.dtos.user.responses.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

        private final UserService userService;

        @Operation(summary = "Create a new user", description = "Create a new user account")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "User created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "409", description = "User already exists")
        })
        @PostMapping
        public ResponseEntity<ResponseData<UserResponse>> createUser(@Valid @RequestBody UserRequest userRequest) {
                log.info("Creating new user with username: {}", userRequest.getUsername());
                UserResponse userResponse = userService.createUser(userRequest);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.CREATED.value())
                                .message("User created successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        }

        @Operation(summary = "Register a new user", description = "Register a new user account")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "User registered successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data")
        })
        @PostMapping("/register")
        public ResponseEntity<ResponseData<UserResponse>> registerUser(
                        @Valid @RequestBody RegisterRequest registerRequest) {
                log.info("Registering new user with username: {}", registerRequest.getUsername());
                UserResponse userResponse = userService.registerUser(registerRequest);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.CREATED.value())
                                .message("User registered successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.status(HttpStatus.CREATED).body(responseData);
        }

        @Operation(summary = "Get user by ID", description = "Retrieve a user by their ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User found"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @GetMapping("/{id}")
        public ResponseEntity<ResponseData<UserResponse>> getUserById(
                        @Parameter(description = "User ID") @PathVariable Long id) {
                log.info("Getting user by ID: {}", id);
                UserResponse userResponse = userService.getUserById(id);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("User retrieved successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Get all users", description = "Retrieve all users with pagination")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
        })
        @GetMapping
        public ResponseEntity<ResponseData<Page<UserResponse>>> getAllUsers(
                        @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
                        @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sortBy,
                        @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String sortDir) {

                log.info("Getting all users - page: {}, size: {}, sortBy: {}, sortDir: {}", page, size, sortBy,
                                sortDir);

                Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                                sortBy);
                Pageable pageable = PageRequest.of(page, size, sort);
                Page<UserResponse> users = userService.getPageUsers(pageable);

                ResponseData<Page<UserResponse>> responseData = ResponseData.<Page<UserResponse>>builder()
                                .status(HttpStatus.OK.value())
                                .message("Users retrieved successfully")
                                .data(users)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Update user", description = "Update user information")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User updated successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data")
        })
        @PutMapping("/{id}")
        public ResponseEntity<ResponseData<UserResponse>> updateUser(
                        @Parameter(description = "User ID") @PathVariable Long id,
                        @Valid @RequestBody UserRequest userRequest) {
                log.info("Updating user with ID: {}", id);
                UserResponse userResponse = userService.updateUser(id, userRequest);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("User updated successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Delete user", description = "Delete a user by ID")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @DeleteMapping("/{id}")
        public ResponseEntity<ResponseData<Void>> deleteUser(
                        @Parameter(description = "User ID") @PathVariable Long id) {
                log.info("Deleting user with ID: {}", id);
                userService.deleteUser(id);

                ResponseData<Void> responseData = ResponseData.<Void>builder()
                                .status(HttpStatus.OK.value())
                                .message("User deleted successfully")
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Search users", description = "Search users by keyword")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Search completed successfully")
        })
        @GetMapping("/search")
        public ResponseEntity<ResponseData<Page<UserResponse>>> searchUsers(
                        @Parameter(description = "Search keyword") @RequestParam String keyword,
                        @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {

                log.info("Searching users with keyword: {}", keyword);
                Pageable pageable = PageRequest.of(page, size);
                Page<UserResponse> users = userService.searchUsers(keyword, pageable);

                ResponseData<Page<UserResponse>> responseData = ResponseData.<Page<UserResponse>>builder()
                                .status(HttpStatus.OK.value())
                                .message("Search completed successfully")
                                .data(users)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Get user by email", description = "Retrieve a user by email address")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User found"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @GetMapping("/email/{email}")
        public ResponseEntity<ResponseData<UserResponse>> getUserByEmail(
                        @Parameter(description = "User email") @PathVariable String email) {
                log.info("Getting user by email: {}", email);
                UserResponse userResponse = userService.getUserByEmail(email);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("User retrieved successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Get user by username", description = "Retrieve a user by username")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User found"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @GetMapping("/username/{username}")
        public ResponseEntity<ResponseData<UserResponse>> getUserByUsername(
                        @Parameter(description = "Username") @PathVariable String username) {
                log.info("Getting user by username: {}", username);
                UserResponse userResponse = userService.getUserByUserName(username);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("User retrieved successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Update user password", description = "Update user password")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Password updated successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "400", description = "Invalid password data")
        })
        @PutMapping("/{id}/password")
        public ResponseEntity<ResponseData<UserResponse>> updateUserPassword(
                        @Parameter(description = "User ID") @PathVariable Long id,
                        @Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
                log.info("Updating password for user ID: {}", id);
                UserResponse userResponse = userService.updateUserPassword(id, updatePasswordRequest);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("Password updated successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Update user avatar", description = "Update user avatar URL")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Avatar updated successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @PutMapping("/{id}/avatar")
        public ResponseEntity<ResponseData<UserResponse>> updateUserAvatar(
                        @Parameter(description = "User ID") @PathVariable Long id,
                        @Parameter(description = "Avatar URL") @RequestParam String avatarUrl) {
                log.info("Updating avatar for user ID: {}", id);
                UserResponse userResponse = userService.updateUserAvatar(id, avatarUrl);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("Avatar updated successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Change role to user", description = "Change a role to user")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Role changed successfully"),
                        @ApiResponse(responseCode = "404", description = "User or role not found")
        })
        @PostMapping("/{id}/change-roles")
        public ResponseEntity<ResponseData<UserResponse>> addRoleToUser(
                        @Parameter(description = "User ID") @PathVariable Long id,
                        @Parameter(description = "Roles to add") @RequestParam String role) {
                log.info("Changing role {} to user ID: {}", role, id);
                UserResponse userResponse = userService.changeRole(id, role);

                ResponseData<UserResponse> responseData = ResponseData.<UserResponse>builder()
                                .status(HttpStatus.OK.value())
                                .message("Role added successfully")
                                .data(userResponse)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Activate user", description = "Activate a user account")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User activated successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @PutMapping("/{id}/activate")
        public ResponseEntity<ResponseData<Boolean>> activateUser(
                        @Parameter(description = "User ID") @PathVariable Long id) {
                log.info("Activating user ID: {}", id);
                boolean result = userService.activateUser(id);

                ResponseData<Boolean> responseData = ResponseData.<Boolean>builder()
                                .status(HttpStatus.OK.value())
                                .message("User activated successfully")
                                .data(result)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Deactivate user", description = "Deactivate a user account")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "User deactivated successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found")
        })
        @PutMapping("/{id}/deactivate")
        public ResponseEntity<ResponseData<Boolean>> deactivateUser(
                        @Parameter(description = "User ID") @PathVariable Long id) {
                log.info("Deactivating user ID: {}", id);
                boolean result = userService.deactivateUser(id);

                ResponseData<Boolean> responseData = ResponseData.<Boolean>builder()
                                .status(HttpStatus.OK.value())
                                .message("User deactivated successfully")
                                .data(result)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }

        @Operation(summary = "Get users by role", description = "Get all users with a specific role")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
        })
        @GetMapping("/role/{code}")
        public ResponseEntity<ResponseData<Page<UserResponse>>> getUsersByRole(
                        @Parameter(description = "Role code") @PathVariable String code,
                        @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

                log.info("Getting users by role: {}", code);
                Page<UserResponse> users = userService.getUsersByRole(code, pageable);

                ResponseData<Page<UserResponse>> responseData = ResponseData.<Page<UserResponse>>builder()
                                .status(HttpStatus.OK.value())
                                .message("Users retrieved successfully")
                                .data(users)
                                .timestamp(LocalDateTime.now())
                                .build();

                return ResponseEntity.ok(responseData);
        }
}
