package com.example.hotcinemas_be.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class OTPService {

    private final RedisService redisService;

    private void saveOTPToRedis(String email, String otp) {
        String redisKey = "otp:" + email;
        redisService.set(redisKey, otp, 60, TimeUnit.SECONDS);
    }

    private void removeOTPFromRedis(String email) {
        String redisKey = "otp:" + email;
        redisService.delete(redisKey);
    }

    public String generateOTP(String email) {
        SecureRandom secureRandom = new SecureRandom();
        int otp = 100000 + secureRandom.nextInt(900000);
        String otpString = String.format("%06d", otp);
        saveOTPToRedis(email, otpString);
        log.info("Generated OTP for {}: {}", email, otpString);
        return otpString;
    }

    public boolean validateOTP(String email, String otp) {
        String redisKey = "otp:" + email;
        String storedOtp = (String)redisService.get(redisKey);
        if (storedOtp != null && storedOtp.equals(otp)) {
            removeOTPFromRedis(email);
            return true;
        }
        return false;
    }
}
