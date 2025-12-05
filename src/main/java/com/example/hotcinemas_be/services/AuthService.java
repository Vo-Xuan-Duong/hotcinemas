package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.user.requests.NewPassword;
import com.example.hotcinemas_be.dtos.auth.requests.LoginRequest;
import com.example.hotcinemas_be.dtos.auth.requests.RegisterRequest;
import com.example.hotcinemas_be.dtos.auth.responses.AuthResponse;
import com.example.hotcinemas_be.dtos.user.responses.UserResponse;
import com.example.hotcinemas_be.enums.TokenType;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.jwts.JwtService;
import com.example.hotcinemas_be.models.User;
import com.example.hotcinemas_be.repositorys.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenService refreshTokenService;
    private final OTPService otpService;
    private final EmailService emailService;
    private final BlackListService blackListService;

    public AuthService(UserRepository userRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            UserService userService,
            RefreshTokenService refreshTokenService,
            OTPService otpService,
            EmailService emailService,
            BlackListService blackListService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.otpService = otpService;
        this.emailService = emailService;
        this.blackListService = blackListService;
    }

    public AuthResponse loginHandler(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsernameOrEmail());

        String tokenId = UUID.randomUUID().toString();
        String accessToken = jwtService.generateToken(TokenType.ACCESS, userDetails, tokenId);
        String refreshToken = jwtService.generateToken(TokenType.REFRESH, userDetails, tokenId);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userAuth(userService.getUserByUserName(loginRequest.getUsernameOrEmail()))
                .build();
    }

    public AuthResponse refreshTokenHandler(String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new ErrorException("Refresh token is required", ErrorCode.ERROR_INVALID_TOKEN);
        }

        refreshTokenService.deleteRefreshToken(refreshToken);

        String username = jwtService.extractUsername(refreshToken, TokenType.REFRESH);
        if (username == null) {
            throw new ErrorException("Refresh token is required", ErrorCode.ERROR_INVALID_TOKEN);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            throw new ErrorException("User not found for the provided refresh token", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }

        String tokenId = UUID.randomUUID().toString();
        String newAccessToken = jwtService.generateToken(TokenType.ACCESS, userDetails, tokenId);
        String newRefreshToken = jwtService.generateToken(TokenType.REFRESH, userDetails, tokenId);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userAuth(userService.getUserByUserName(username))
                .build();
    }

    public void registerHandler(RegisterRequest registerRequest) {
        UserResponse user = userService.registerUser(registerRequest);
        if (user == null) {
            throw new ErrorException("Registration failed", ErrorCode.ERROR_REGISTRATION_FAILED);
        }
        String otp = otpService.generateOTP(user.getEmail());
        log.info("OTP register verify: {}", otp);
        emailService.sendOTPConfirmationEmail(user.getEmail(), otp);
    }

    public Boolean verifyOTP(String email, String otpCode) {
        if (!otpService.validateOTP(email, otpCode)) {
            throw new ErrorException("Invalid OTP", ErrorCode.ERROR_INVALID_REQUEST);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorException("User not found", ErrorCode.ERROR_MODEL_NOT_FOUND));

        user.setIsActive(true);
        userRepository.save(user);
        return true;
    }

    public void logoutHandler(String accessToken) {
        if (accessToken == null || accessToken.isEmpty()) {
            throw new ErrorException("Access token is required", ErrorCode.ERROR_INVALID_TOKEN);
        }

        accessToken = accessToken.replace("Bearer ", "");
        String tokenId = jwtService.extractId(accessToken, TokenType.ACCESS);
        if (tokenId == null) {
            throw new ErrorException("Invalid access token", ErrorCode.ERROR_INVALID_TOKEN);
        }

        blackListService.saveTokenToBlacklist(accessToken, tokenId);
    }

    public Boolean forgetPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorException("User not found", ErrorCode.ERROR_MODEL_NOT_FOUND));
        if (!user.getIsActive()) {
            throw new ErrorException("User is not active", ErrorCode.ERROR_UNAUTHORIZED);
        }
        String otp = otpService.generateOTP(email);
        log.info("OTP register verify: {}", otp);
        emailService.sendOTPConfirmationEmail(email, otp);
        return true;
    }

    public Boolean verifyOTPChangePasswordToken(String email, String otpCode) {
        if (!otpService.validateOTP(otpCode, email)) {
            throw new ErrorException("Invalid OTP", ErrorCode.ERROR_INVALID_REQUEST);
        }
        return true;
    }

    public Boolean changePassword(NewPassword newPassword) {
        userService.changePassword(newPassword.getNewPassword());
        return true;
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if (username == null || username.isEmpty()) {
            throw new ErrorException("Người dùng chưa đăng nhập vui lòng đăng nhập ", ErrorCode.ERROR_UNCATEGORIZED);
        }

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ErrorException("User not found", ErrorCode.ERROR_MODEL_NOT_FOUND));
    }

    public void resendOTP(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorException("User not found", ErrorCode.ERROR_MODEL_NOT_FOUND));
        String otp = otpService.generateOTP(user.getEmail());
        log.info("OTP register verify: {}", otp);
        emailService.sendOTPConfirmationEmail(user.getEmail(), otp);
    }
}
