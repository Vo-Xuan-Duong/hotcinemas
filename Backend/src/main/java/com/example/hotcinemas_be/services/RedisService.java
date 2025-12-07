package com.example.hotcinemas_be.services;


import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object> redisTemplate;

    public Boolean set(String key, Object value, long timeoutInSeconds, java.util.concurrent.TimeUnit timeUnit) {
        return redisTemplate.opsForValue().setIfAbsent(key, value, timeoutInSeconds, timeUnit);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public List<Object> getMultiple(List<String> keys) {
        return redisTemplate.opsForValue().multiGet(keys);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    public boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    public void setHash(String key, String field, Object value) {
        redisTemplate.opsForHash().put(key, field, value);
    }

    public Object getHash(String key, String field) {
        return redisTemplate.opsForHash().get(key, field);
    }

    public java.util.Set<String> keys(String pattern) {
        return redisTemplate.keys(pattern);
    }

    public Long getExpire(String key) {
        return redisTemplate.getExpire(key);
    }
}
