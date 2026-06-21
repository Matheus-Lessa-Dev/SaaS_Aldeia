package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RegisterAdminRequest;
import com.saas_aldeia.backend.dto.RegisterAlunoRequest;
import com.saas_aldeia.backend.dto.RegisterProfessorRequest;
import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.repository.AdminRepository;
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

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UsuarioRepository usuarioRepository;
    @Mock AdminRepository adminRepository;
    @Mock AlunoRepository alunoRepository;
    @Mock ProfessorRepository professorRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @InjectMocks AuthService authService;

    private static final LocalDate DATA_NASCIMENTO_ALUNO    = LocalDate.of(2010, 3, 15);
    private static final LocalDate DATA_NASCIMENTO_PROFESSOR = LocalDate.of(1990, 5, 20);

    @Test
    void registerAdmin_success() {
        when(usuarioRepository.existsByEmail("admin@test.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("hashed");
        when(adminRepository.save(any(Admin.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.registerAdmin(new RegisterAdminRequest(
                "admin@test.com",
                "senha123",
                "Admin"
        ));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(response.email()).isEqualTo("admin@test.com");
        assertThat(response.nome()).isEqualTo("Admin");
    }

    @Test
    void registerAluno_success() {
        when(usuarioRepository.existsByEmail("aluno@test.com")).thenReturn(false);
        when(passwordEncoder.encode("15032010")).thenReturn("hashed");
        when(alunoRepository.save(any(Aluno.class))).thenAnswer(invocation -> {
            Aluno aluno = invocation.getArgument(0);
            assertThat(aluno.isPrimeiroAcesso()).isFalse();
            return aluno;
        });
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.registerAluno(new RegisterAlunoRequest(
                "aluno@test.com",       // email
                "João",                 // nome
                DATA_NASCIMENTO_ALUNO,  // dataNascimento
                "Rua A",                // rua
                "Casa 1",               // complemento
                "Responsável",          // nomeResponsavel
                "(44) 99999-9999",      // telefoneResponsavel
                "resp@email.com"        // emailResponsavel
        ));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ALUNO");
        assertThat(response.email()).isEqualTo("aluno@test.com");
        assertThat(response.nome()).isEqualTo("João");
    }

    @Test
    void registerAluno_emailDuplicado_throwsException() {
        when(usuarioRepository.existsByEmail("aluno@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.registerAluno(new RegisterAlunoRequest(
                "aluno@test.com",
                "João",
                DATA_NASCIMENTO_ALUNO,
                "Rua A",
                "Casa 1",
                "Responsável",
                "(44) 99999-9999",
                "resp@email.com"
        )))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    void registerProfessor_success() {
        when(usuarioRepository.existsByEmail("prof@test.com")).thenReturn(false);
        when(passwordEncoder.encode("20051990")).thenReturn("hashed");
        when(professorRepository.save(any(Professor.class))).thenAnswer(invocation -> {
            Professor professor = invocation.getArgument(0);
            assertThat(professor.isPrimeiroAcesso()).isFalse();
            return professor;
        });
        when(jwtService.generateToken(any())).thenReturn("token");

        var response = authService.registerProfessor(new RegisterProfessorRequest(
                "prof@test.com",            // email
                "Maria",                    // nome
                DATA_NASCIMENTO_PROFESSOR,  // dataNascimento
                "Rua B",                    // rua
                "Apto 2",                   // complemento
                "(44) 98888-0000"           // telefone
        ));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("PROFESSOR");
        assertThat(response.email()).isEqualTo("prof@test.com");
        assertThat(response.nome()).isEqualTo("Maria");
    }

    @Test
    void login_success() {
        Aluno aluno = new Aluno();
        aluno.setEmail("aluno@test.com");
        aluno.setNome("João");
        aluno.setSenha("hashed");
        aluno.setTipo(TipoUsuario.ALUNO);
        when(usuarioRepository.findByEmail("aluno@test.com")).thenReturn(Optional.of(aluno));
        when(passwordEncoder.matches("senha123", "hashed")).thenReturn(true);
        when(jwtService.generateToken(aluno)).thenReturn("token");

        var response = authService.login(new LoginRequest("aluno@test.com", "senha123"));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ALUNO");
        assertThat(response.nome()).isEqualTo("João");
    }

    @Test
    void login_adminReturnsRegisteredName() {
        Admin admin = new Admin();
        admin.setEmail("admin@test.com");
        admin.setNome("Administrador Aldeia");
        admin.setSenha("hashed");
        admin.setTipo(TipoUsuario.ADMIN);
        when(usuarioRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("senha123", "hashed")).thenReturn(true);
        when(jwtService.generateToken(admin)).thenReturn("token");

        var response = authService.login(new LoginRequest("admin@test.com", "senha123"));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(response.nome()).isEqualTo("Administrador Aldeia");
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
