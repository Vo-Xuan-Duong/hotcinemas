package com.example.hotcinemas_be.services;

import com.example.hotcinemas_be.dtos.auth.requests.RefreshTokenRequest;
import com.example.hotcinemas_be.dtos.auth.responses.RefreshTokenResponse;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.mappers.RefreshTokenMapper;
import com.example.hotcinemas_be.models.RefreshToken;
import com.example.hotcinemas_be.repositorys.RefreshTokenRepository;
import com.example.hotcinemas_be.repositorys.UserRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenMapper refreshTokenMapper;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
            RefreshTokenMapper refreshTokenMapper,
            UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenMapper = refreshTokenMapper;
        this.userRepository = userRepository;
    }

    public void createRefreshToken(RefreshTokenRequest refreshTokenRequest) {
        RefreshToken refreshToken = RefreshToken.builder()
                .id(refreshTokenRequest.getTokenId())
                .token(refreshTokenRequest.getToken())
                .user(userRepository.findByUsername(refreshTokenRequest.getUsername())
                        .orElseThrow(() -> new ErrorException("User not found", ErrorCode.ERROR_MODEL_NOT_FOUND)))
                .build();
        refreshTokenMapper.mapToResponse(refreshTokenRepository.save(refreshToken));
    }

    public List<RefreshTokenResponse> getAllRefreshTokens(Pageable pageable) {
        List<RefreshToken> refreshTokens = refreshTokenRepository.findAll(pageable).getContent();
        if (refreshTokens.isEmpty()) {
            throw new ErrorException("No refresh tokens found", ErrorCode.ERROR_MODEL_NOT_FOUND);
        }
        return refreshTokens.stream()
                .map(refreshTokenMapper::mapToResponse)
                .toList();
    }

    public void deleteRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ErrorException("Refresh token not found", ErrorCode.ERROR_MODEL_NOT_FOUND));
        refreshTokenRepository.delete(refreshToken);
    }

    public RefreshTokenResponse getRefreshTokenById(String tokenId) {
        RefreshToken refreshToken = refreshTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ErrorException("Refresh token not found", ErrorCode.ERROR_MODEL_NOT_FOUND));
        return refreshTokenMapper.mapToResponse(refreshToken);
    }

    public RefreshTokenResponse updateRefreshToken(String tokenId, RefreshTokenRequest refreshTokenRequest) {
        RefreshToken existingRefreshToken = refreshTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ErrorException("Refresh token not found", ErrorCode.ERROR_MODEL_NOT_FOUND));

        existingRefreshToken.setToken(refreshTokenRequest.getToken());
        existingRefreshToken.setUser(userRepository.findByUsername(refreshTokenRequest.getUsername())
                .orElseThrow(() -> new ErrorException("User not found", ErrorCode.ERROR_MODEL_NOT_FOUND)));

        return refreshTokenMapper.mapToResponse(refreshTokenRepository.save(existingRefreshToken));
    }

    public boolean existsByTokenId(String tokenId) {
        return refreshTokenRepository.existsById(tokenId);
    }
}
