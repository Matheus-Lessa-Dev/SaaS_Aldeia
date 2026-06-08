package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.TipoUsuario;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET = "aldeia-saas-chave-super-secreta-2026-projeto-faculdade";

    @Test
    void generateToken_createsValidAccessTokenForUser() {
        JwtService jwtService = new JwtService(SECRET, 60_000, 120_000);
        Admin admin = admin("admin@test.com");

        String token = jwtService.generateToken(admin);

        assertThat(jwtService.extractUsername(token)).isEqualTo("admin@test.com");
        assertThat(jwtService.isValid(token, admin)).isTrue();
        assertThat(jwtService.isValidRefreshToken(token, admin)).isFalse();
    }

    @Test
    void generateRefreshToken_createsValidRefreshTokenForUser() {
        JwtService jwtService = new JwtService(SECRET, 60_000, 120_000);
        Admin admin = admin("admin@test.com");

        String token = jwtService.generateRefreshToken(admin);

        assertThat(jwtService.extractUsername(token)).isEqualTo("admin@test.com");
        assertThat(jwtService.isValidRefreshToken(token, admin)).isTrue();
        assertThat(jwtService.isValid(token, admin)).isFalse();
    }

    @Test
    void isValid_returnsFalseForDifferentUser() {
        JwtService jwtService = new JwtService(SECRET, 60_000, 120_000);
        String token = jwtService.generateToken(admin("admin@test.com"));

        assertThat(jwtService.isValid(token, admin("outro@test.com"))).isFalse();
    }

    private static Admin admin(String email) {
        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setSenha("hash");
        admin.setTipo(TipoUsuario.ADMIN);
        admin.setNome("Admin");
        return admin;
    }
}
