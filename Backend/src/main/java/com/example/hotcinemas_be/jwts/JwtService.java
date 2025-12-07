package com.example.hotcinemas_be.jwts;

import com.example.hotcinemas_be.dtos.auth.requests.RefreshTokenRequest;
import com.example.hotcinemas_be.enums.TokenType;
import com.example.hotcinemas_be.exceptions.ErrorCode;
import com.example.hotcinemas_be.exceptions.ErrorException;
import com.example.hotcinemas_be.models.User;
import com.example.hotcinemas_be.repositorys.RefreshTokenRepository;
import com.example.hotcinemas_be.repositorys.UserRepository;
import com.example.hotcinemas_be.services.RefreshTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
public class JwtService {

    @Value("${jwt.secret.access}")
    private String SECRET_ACCESS;
    @Value("${jwt.secret.refresh}")
    private String SECRET_REFRESH;
    @Value("${jwt.issuer}")
    private String ISSUER;
    @Value("${jwt.expiration.access}")
    private long EXPIRATION_ACCESS;
    @Value("${jwt.expiration.refresh}")
    private long EXPIRATION_REFRESH;

    private final RefreshTokenService refreshTokenService;

    public JwtService(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    public String generateToken(TokenType tokenType, UserDetails userDetails, String tokenId) {

        String token = Jwts.builder()
//                .claim("roles : ", getRole(userDetails))
                .id(tokenId)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .issuer(ISSUER)
                .expiration(getExpirationDate(tokenType))
                .signWith(getSecretKey(tokenType))
                .compact();

        if (tokenType.equals(TokenType.REFRESH)) {
            RefreshTokenRequest refreshTokenRequest = RefreshTokenRequest.builder()
                    .tokenId(tokenId)
                    .token(token)
                    .username(userDetails.getUsername())
                    .build();
            refreshTokenService.createRefreshToken(refreshTokenRequest);
        }

        return token;
    }

    private Date getExpirationDate(TokenType tokenType) {
        return tokenType.equals(TokenType.ACCESS) ? new Date(System.currentTimeMillis() + EXPIRATION_ACCESS)
                : new Date(System.currentTimeMillis() + EXPIRATION_REFRESH);
    }

    private SecretKey getSecretKey(TokenType tokenType) {
        return tokenType.equals(TokenType.ACCESS)
                ? io.jsonwebtoken.security.Keys.hmacShaKeyFor(SECRET_ACCESS.getBytes())
                : io.jsonwebtoken.security.Keys.hmacShaKeyFor(SECRET_REFRESH.getBytes());
    }

//    private String getRole(UserDetails userDetails) {
//        if (userDetails == null || userDetails.getAuthorities() == null || userDetails.getAuthorities().isEmpty()) {
//            return null;
//        }
//        log.info("userDetails.getAuthorities(): {}", userDetails.getAuthorities());
//        log.info("userDetails.getAuthorities(1): {}", userDetails.getAuthorities().stream().findFirst());
//        return userDetails.getAuthorities().stream()
//                .findFirst()
//                .map(GrantedAuthority::getAuthority)
//                .orElse(null);
//    }

    public Claims extractClaims(String token, TokenType tokenType) {
        return Jwts.parser()
                .verifyWith(getSecretKey(tokenType))
                .requireIssuer(ISSUER)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token, TokenType tokenType) {
        Claims claims = extractClaims(token, tokenType);
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails, TokenType tokenType) {
        String username = extractClaims(token, tokenType).getSubject();
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token, tokenType));
    }

    public String extractUsername(String token, TokenType tokenType) {
        return extractClaims(token, tokenType).getSubject();
    }

    public String extractId(String token, TokenType tokenType) {
        return extractClaims(token, tokenType).getId();
    }

    public String extractEmail(String token, TokenType tokenType) {
        return extractClaims(token, tokenType).get("email", String.class);
    }
}
