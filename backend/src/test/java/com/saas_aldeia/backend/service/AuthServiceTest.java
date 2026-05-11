package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RegisterRequest;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @InjectMocks AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario(1L, "user@test.com", "hashed", TipoUsuario.ADMIN);
    }

    @Test
    void register_success() {
        when(usuarioRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(usuarioRepository.save(any())).thenReturn(usuario);
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.register(new RegisterRequest("user@test.com", "senha123"));

        assertThat(response.token()).isEqualTo("token");
        verify(usuarioRepository).save(any());
    }

    @Test
    void register_duplicateEmail_throwsException() {
        when(usuarioRepository.existsByEmail("user@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(new RegisterRequest("user@test.com", "senha123")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    void login_success() {
        when(usuarioRepository.findByEmail("user@test.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "hashed")).thenReturn(true);
        when(jwtService.generateToken(usuario)).thenReturn("token");

        var response = authService.login(new LoginRequest("user@test.com", "senha123"));

        assertThat(response.token()).isEqualTo("token");
    }

    @Test
    void login_wrongPassword_throwsException() {
        when(usuarioRepository.findByEmail("user@test.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("user@test.com", "errada")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_unknownEmail_throwsException() {
        when(usuarioRepository.findByEmail(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("x@x.com", "senha")))
                .isInstanceOf(BadCredentialsException.class);
    }
}