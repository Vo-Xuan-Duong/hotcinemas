package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.auth.requests.RegisterRequest;
import com.example.hotcinemas_be.dtos.user.requests.UpdatePasswordRequest;
import com.example.hotcinemas_be.dtos.user.requests.UserRequest;
import com.example.hotcinemas_be.dtos.user.requests.UserUpdateRequest;
import com.example.hotcinemas_be.dtos.user.responses.UserResponse;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.UserMapper;
import com.example.hotcinemas_be.models.Role;
import com.example.hotcinemas_be.models.User;
import com.example.hotcinemas_be.repositorys.RoleRepository;
import com.example.hotcinemas_be.repositorys.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            RoleRepository roleRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhoneNumber());
        user.setAvatarUrl(userRequest.getAvatarUrl());
        user.setFullName(userRequest.getFullName());
        user.setAddress(userRequest.getAddress());
        user.setIsActive(true);
        user.setRole(roleRepository.findByCode("USER")
                .orElseThrow(() -> new ErrorException("Role not found when add role to create user",
                        ErrorCode.ERROR_MODEL_NOT_FOUND)));
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUser(Long userId, UserRequest userRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new ErrorException("User not found when update user", ErrorCode.ERROR_MODEL_NOT_FOUND));

        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhoneNumber());
        user.setAvatarUrl(userRequest.getAvatarUrl());
        user.setFullName(userRequest.getFullName());
        user.setAddress(userRequest.getAddress());
        user.setIsActive(userRequest.isActive());
        user.setRole(roleRepository.findByCode(userRequest.getRole())
                .orElseThrow(() -> new ErrorException("Role not found when add role to create user",
                        ErrorCode.ERROR_MODEL_NOT_FOUND)));

        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::mapToResponse)
                .orElseThrow(
                        () -> new ErrorException("User not found with id: " + id, ErrorCode.ERROR_MODEL_NOT_FOUND));
    }

    public Page<UserResponse> getPageUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(userMapper::mapToResponse);
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new ErrorException("No users found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return users.stream().map(userMapper::mapToResponse).toList();
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new ErrorException("User not found when delete user", ErrorCode.ERROR_MODEL_NOT_FOUND));
        userRepository.delete(user);
    }

    public UserResponse getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::mapToResponse)
                .orElseThrow(() -> new ErrorException("User not found with email: " + email,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
    }

    public UserResponse getUserByUserName(String userName) {
        return userRepository.findByUsername(userName)
                .map(userMapper::mapToResponse)
                .orElseThrow(() -> new ErrorException("User not found with username: " + userName,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
    }

    public UserResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ErrorException("Email already exists", ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new ErrorException("Username already exists", ErrorCode.ERROR_MODEL_ALREADY_EXISTS);
        }

        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new ErrorException("Password and Confirm Password no match",
                    ErrorCode.CONFIRM_PASSWORD_AND_PASSWORD_NOT_MATCH);
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhoneNumber());
        user.setFullName(registerRequest.getFullName());
        user.setIsActive(false); // User is not active by default
        user.setRole(roleRepository.findByCode("USER")
                .orElseThrow(() -> new ErrorException("Role not found when add role to create user",
                        ErrorCode.ERROR_MODEL_NOT_FOUND)));

        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUserAvatar(Long id, String avatarUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new ErrorException("User not found when update avatar", ErrorCode.ERROR_MODEL_NOT_FOUND));
        user.setAvatarUrl(avatarUrl);
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse updateUserPassword(Long id, UpdatePasswordRequest updatePasswordRequest) {
        if (!updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getConfirmNewPassword())) {
            throw new ErrorException("New Password and Confirm Password do not match",
                    ErrorCode.CONFIRM_PASSWORD_AND_PASSWORD_NOT_MATCH);
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorException("User not found when update password",
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        if (!passwordEncoder.matches(updatePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new ErrorException("Old password does not match", ErrorCode.PASSWORD_NOT_MATCH);
        }
        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse getUserInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(
                        () -> new ErrorException("User not found when get user info", ErrorCode.ERROR_MODEL_NOT_FOUND));

        return userMapper.mapToResponse(user);
    }

    public void changePassword(String newPassword) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("User not found when change password",
                        ErrorCode.ERROR_MODEL_NOT_FOUND));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public UserResponse updateInfoUser(UserUpdateRequest userUpdateRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(
                        () -> new ErrorException("User not found when update info", ErrorCode.ERROR_MODEL_NOT_FOUND));

        user.setEmail(userUpdateRequest.getEmail());
        user.setPhone(userUpdateRequest.getPhoneNumber());
        user.setFullName(userUpdateRequest.getFullName());
        user.setAddress(userUpdateRequest.getAddress());
        user.setAvatarUrl(userUpdateRequest.getAvatarUrl());

        return userMapper.mapToResponse(userRepository.save(user));
    }

    public UserResponse changeRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorException("User not found when add roles to user",
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        user.setRole(roleRepository.findByCode(role)
                .orElseThrow(() -> new ErrorException("Role not found when add role to create user",
                        ErrorCode.ERROR_MODEL_NOT_FOUND)));
        return userMapper.mapToResponse(userRepository.save(user));
    }

    public boolean activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(
                        () -> new ErrorException("User not found when activate user", ErrorCode.ERROR_MODEL_NOT_FOUND));
        if (user.getIsActive()) {
            throw new ErrorException("User is already active", ErrorCode.ERROR_INVALID_REQUEST);
        }
        user.setIsActive(true);
        userRepository.save(user);
        return true;
    }

    public boolean deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorException("User not found when deactivate user",
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        if (!user.getIsActive()) {
            throw new ErrorException("User is already inactive", ErrorCode.ERROR_INVALID_REQUEST);
        }
        user.setIsActive(false);
        userRepository.save(user);
        return true;
    }

    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        return null;
    }

    public Page<UserResponse> getUsersByRole(String code, Pageable pageable) {
        Role role = roleRepository.findByCode(code)
                .orElseThrow(() -> new ErrorException("Role not found with name: " + code,
                        ErrorCode.ERROR_MODEL_NOT_FOUND));
        Page<User> userPage = userRepository.findByRole(role, pageable);
        return userPage.map(userMapper::mapToResponse);
    }
}
