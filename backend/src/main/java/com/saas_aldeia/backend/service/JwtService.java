package com.saas_aldeia.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;
    private final long refreshExpirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs,
            @Value("${jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    /** Gera o Access Token (curta duração) */
    public String generateToken(UserDetails user) {
        return buildToken(user, expirationMs, "access");
    }

    /** Gera o Refresh Token (longa duração) */
    public String generateRefreshToken(UserDetails user) {
        return buildToken(user, refreshExpirationMs, "refresh");
    }

    private String buildToken(UserDetails user, long expiration, String tokenType) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("roles", user.getAuthorities().stream()
                        .map(a -> a.getAuthority()).toList())
                .claim("type", tokenType)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        try {
            String username = extractUsername(token);
            return username.equals(user.getUsername()) && isAccessToken(token);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isValidRefreshToken(String token, UserDetails user) {
        try {
            String username = extractUsername(token);
            return username.equals(user.getUsername()) && isRefreshToken(token);
        } catch (Exception e) {
            return false;
        }
    }

    private String extractClaim(String token, String claimName) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get(claimName, String.class);
    }

    private boolean isAccessToken(String token) {
        return "access".equals(extractClaim(token, "type"));
    }

    private boolean isRefreshToken(String token) {
        return "refresh".equals(extractClaim(token, "type"));
    }
}
