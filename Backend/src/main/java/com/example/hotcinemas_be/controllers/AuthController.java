package com.example.hotcinemas_be.controllers;

import com.example.hotcinemas_be.dtos.common.ResponseData;
import com.example.hotcinemas_be.dtos.auth.requests.LoginRequest;
import com.example.hotcinemas_be.dtos.user.requests.NewPassword;
import com.example.hotcinemas_be.dtos.auth.requests.RegisterRequest;
import com.example.hotcinemas_be.services.AuthService;
import com.example.hotcinemas_be.jwts.JwtService;
import com.example.hotcinemas_be.enums.TokenType;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication and Authorization", description = "APIs for user authentication and authorization")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Login user", description = "Login user with email and password")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully logged in")
                .data(authService.loginHandler(loginRequest))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Refresh token", description = "Refresh JWT token using refresh token")
    @GetMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully refreshed token")
                .data(authService.refreshTokenHandler(refreshToken))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Register user", description = "Register a new user with email and password")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        authService.registerHandler(registerRequest);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully registered")
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Verify OTP", description = "Verify OTP for user registration")
    @GetMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otpCode) {
        boolean isVerified = authService.verifyOTP(email, otpCode);
        ResponseData<?> responseData = ResponseData.builder()
                .status(isVerified ? 200 : 400)
                .message(isVerified ? "OTP verified successfully" : "Invalid OTP")
                .data(null)
                .build();
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/resend-otp")
    @Operation(summary = "Resend OTP", description = "Resend OTP to email for user registration")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {
        authService.resendOTP(email);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("OTP resent successfully")
                .data(null)
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Get current user", description = "Get details of the currently logged-in user")
    @GetMapping("/current-user")
    public ResponseEntity<?> currentUser() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully retrieved current user")
                .data(authService.getCurrentUser())
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Logout user", description = "Logout user by invalidating the access token")
    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        authService.logoutHandler(token);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully logged out")
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Verify JWT token", description = "Verify access/refresh token validity and return basic claims")
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(
            @RequestParam(required = false) String token,
            @RequestParam(defaultValue = "ACCESS") TokenType type,
            HttpServletRequest request) {

        if (token == null || token.isEmpty()) {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                token = header.substring(7);
            }
        }

        if (token == null || token.isEmpty()) {
            ResponseData<?> error = ResponseData.builder()
                    .status(400)
                    .message("Token is required")
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(error);
        }

        try {
            Claims claims = jwtService.extractClaims(token, type);
            boolean expired = claims.getExpiration() != null && claims.getExpiration().before(new java.util.Date());
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("valid", !expired);
            result.put("type", type.name());
            result.put("subject", claims.getSubject());
            result.put("id", claims.getId());
            result.put("issuer", claims.getIssuer());
            result.put("issuedAt", claims.getIssuedAt());
            result.put("expiration", claims.getExpiration());

            ResponseData<?> responseData = ResponseData.builder()
                    .status(200)
                    .message(!expired ? "Token is valid" : "Token is expired")
                    .data(result)
                    .build();
            return ResponseEntity.ok(responseData);
        } catch (Exception ex) {
            ResponseData<?> error = ResponseData.builder()
                    .status(400)
                    .message("Invalid token: " + ex.getMessage())
                    .data(null)
                    .build();
            return ResponseEntity.badRequest().body(error);
        }
    }

    @Operation(summary = "Forget password", description = "Send OTP to email for password reset")
    @GetMapping("/forget-password")
    public ResponseEntity<?> forgetPassword(@RequestParam String email) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("OTP sent to email for password reset")
                .data(authService.forgetPassword(email))
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Change password", description = "Change user password using OTP")
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody NewPassword newPassword) {
        boolean isChanged = authService.changePassword(newPassword);
        ResponseData<?> responseData = ResponseData.builder()
                .status(isChanged ? 200 : 400)
                .message(isChanged ? "Password changed successfully" : "Failed to change password")
                .data(null)
                .build();
        return ResponseEntity.ok(responseData);
    }

    @Operation(summary = "Verify OTP for password change", description = "Verify OTP for changing password")
    @GetMapping("/verify-otp-change-password")
    public ResponseEntity<?> verifyOtpChangePassword(@RequestParam String email, @RequestParam String otpCode) {
        boolean isVerified = authService.verifyOTPChangePasswordToken(email, otpCode);
        ResponseData<?> responseData = ResponseData.builder()
                .status(isVerified ? 200 : 400)
                .message(isVerified ? "OTP verified successfully" : "Invalid OTP")
                .data(null)
                .build();
        return ResponseEntity.ok(responseData);
    }
}
