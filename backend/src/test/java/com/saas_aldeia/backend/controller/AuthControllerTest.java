package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RefreshTokenRequest;
import com.saas_aldeia.backend.dto.RegisterAdminRequest;
import com.saas_aldeia.backend.dto.RegisterAlunoRequest;
import com.saas_aldeia.backend.dto.RegisterProfessorRequest;
import com.saas_aldeia.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock AuthService authService;

    @Test
    void registerAdmin_returnsCreated() {
        AuthController controller = new AuthController(authService);
        var request = new RegisterAdminRequest("admin@test.com", "senha123", "Admin");
        var authResponse = new AuthResponse("token", "refresh", "ADMIN", "admin@test.com", "Admin");
        when(authService.registerAdmin(request)).thenReturn(authResponse);

        var response = controller.registerAdmin(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(authResponse);
    }

    @Test
    void registerAluno_returnsCreated() {
        AuthController controller = new AuthController(authService);
        var request = new RegisterAlunoRequest(
                "aluno@test.com", "João", LocalDate.of(2010, 3, 15), "Rua", "Casa", "Resp", "44", "resp@test.com"
        );
        var authResponse = new AuthResponse("token", "refresh", "ALUNO", "aluno@test.com", "João");
        when(authService.registerAluno(request)).thenReturn(authResponse);

        var response = controller.registerAluno(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(authResponse);
    }

    @Test
    void registerProfessor_returnsCreated() {
        AuthController controller = new AuthController(authService);
        var request = new RegisterProfessorRequest(
                "prof@test.com", "Maria", LocalDate.of(1990, 5, 20), "Rua", "Apto", "44"
        );
        var authResponse = new AuthResponse("token", "refresh", "PROFESSOR", "prof@test.com", "Maria");
        when(authService.registerProfessor(request)).thenReturn(authResponse);

        var response = controller.registerProfessor(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(authResponse);
    }

    @Test
    void login_returnsOk() {
        AuthController controller = new AuthController(authService);
        var request = new LoginRequest("admin@test.com", "senha123");
        var authResponse = new AuthResponse("token", "refresh", "ADMIN", "admin@test.com", "Admin");
        when(authService.login(request)).thenReturn(authResponse);

        var response = controller.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(authResponse);
    }

    @Test
    void refresh_returnsOk() {
        AuthController controller = new AuthController(authService);
        var authResponse = new AuthResponse("token", "refresh", "ADMIN", "admin@test.com", "Admin");
        when(authService.refresh("refresh")).thenReturn(authResponse);

        var response = controller.refresh(new RefreshTokenRequest("refresh"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(authResponse);
    }
}
