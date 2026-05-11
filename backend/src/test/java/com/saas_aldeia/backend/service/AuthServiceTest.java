package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RegisterAlunoRequest;
import com.saas_aldeia.backend.dto.RegisterProfessorRequest;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock AlunoRepository alunoRepository;
    @Mock ProfessorRepository professorRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @InjectMocks AuthService authService;

    @Test
    void registerAluno_success() {
        when(usuarioRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        Aluno aluno = new Aluno();
        aluno.setEmail("aluno@test.com");
        aluno.setSenha("hashed");
        aluno.setTipo(TipoUsuario.ALUNO);
        aluno.setNome("João");
        when(alunoRepository.save(any())).thenReturn(aluno);
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.registerAluno(new RegisterAlunoRequest(
                "aluno@test.com", "senha123", "João", null, null, null, null, null, null));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ALUNO");
    }

    @Test
    void registerAluno_emailDuplicado_throwsException() {
        when(usuarioRepository.existsByEmail("aluno@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.registerAluno(new RegisterAlunoRequest(
                "aluno@test.com", "senha123", "João", null, null, null, null, null, null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    void registerProfessor_success() {
        when(usuarioRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        Professor prof = new Professor();
        prof.setEmail("prof@test.com");
        prof.setSenha("hashed");
        prof.setTipo(TipoUsuario.PROFESSOR);
        prof.setNome("Maria");
        when(professorRepository.save(any())).thenReturn(prof);
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.registerProfessor(new RegisterProfessorRequest(
                "prof@test.com", "senha123", "Maria", null, null, null, null));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("PROFESSOR");
    }

    @Test
    void login_success() {
        Aluno aluno = new Aluno();
        aluno.setEmail("aluno@test.com");
        aluno.setSenha("hashed");
        aluno.setTipo(TipoUsuario.ALUNO);
        when(usuarioRepository.findByEmail("aluno@test.com")).thenReturn(Optional.of(aluno));
        when(passwordEncoder.matches("senha123", "hashed")).thenReturn(true);
        when(jwtService.generateToken(aluno)).thenReturn("token");

        var response = authService.login(new LoginRequest("aluno@test.com", "senha123"));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ALUNO");
    }

    @Test
    void login_senhaErrada_throwsException() {
        Aluno aluno = new Aluno();
        aluno.setSenha("hashed");
        aluno.setTipo(TipoUsuario.ALUNO);
        when(usuarioRepository.findByEmail(any())).thenReturn(Optional.of(aluno));
        when(passwordEncoder.matches(any(), any())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("aluno@test.com", "errada")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_emailInexistente_throwsException() {
        when(usuarioRepository.findByEmail(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("x@x.com", "senha")))
                .isInstanceOf(BadCredentialsException.class);
    }
}