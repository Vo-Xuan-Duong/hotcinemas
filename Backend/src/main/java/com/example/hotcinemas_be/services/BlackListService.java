package com.example.hotcinemas_be.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlackListService {

    private final RedisService redisService;

    public Boolean isTokenBlacklisted(String token) {
        return redisService.hasKey(token);
    }

    public void saveTokenToBlacklist(String token, String value) {
        redisService.set(token, value, 60, java.util.concurrent.TimeUnit.MINUTES);
    }

}
