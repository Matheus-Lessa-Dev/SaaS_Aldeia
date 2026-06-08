package com.saas_aldeia.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleIllegalArgument_returnsConflictWithMessage() {
        var response = handler.handleIllegalArgument(new IllegalArgumentException("Email já cadastrado"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).containsEntry("erro", "Email já cadastrado");
    }

    @Test
    void handleBadCredentials_returnsUnauthorizedWithMessage() {
        var response = handler.handleBadCredentials(new BadCredentialsException("Credenciais inválidas"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).containsEntry("erro", "Credenciais inválidas");
    }
}
