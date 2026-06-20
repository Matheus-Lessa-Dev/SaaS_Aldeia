package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.*;
import com.saas_aldeia.backend.model.*;
import com.saas_aldeia.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AdminRepository adminRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final DateTimeFormatter SENHA_FORMATADA = DateTimeFormatter.ofPattern("ddMMuuuu");

    public AuthResponse registerAdmin(RegisterAdminRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        Admin admin = new Admin();
        admin.setEmail(request.email());
        admin.setSenha(passwordEncoder.encode(request.senha()));
        admin.setTipo(TipoUsuario.ADMIN);
        admin.setNome(request.nome());
        admin.setPrimeiroAcesso(false);
        adminRepository.save(admin);
        return toResponse(admin);
    }

    public AuthResponse registerAluno(RegisterAlunoRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        String senhaGerada = request.dataNascimento().format(SENHA_FORMATADA);

        Aluno aluno = new Aluno();
        aluno.setEmail(request.email());
        aluno.setSenha(passwordEncoder.encode(senhaGerada)); 
        aluno.setTipo(TipoUsuario.ALUNO);
        aluno.setNome(request.nome());
        aluno.setDataNascimento(request.dataNascimento());
        aluno.setRua(request.rua());
        aluno.setComplemento(request.complemento());
        aluno.setNomeResponsavel(request.nomeResponsavel());
        aluno.setTelefoneResponsavel(request.telefoneResponsavel());
        aluno.setEmailResponsavel(request.emailResponsavel());
        alunoRepository.save(aluno);
        return toResponse(aluno);
    }

    public AuthResponse registerProfessor(RegisterProfessorRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        String senhaGerada = request.dataNascimento().format(SENHA_FORMATADA);

        Professor professor = new Professor();
        professor.setEmail(request.email());
        professor.setSenha(passwordEncoder.encode(senhaGerada)); 
        professor.setTipo(TipoUsuario.PROFESSOR);
        professor.setNome(request.nome());
        professor.setDataNascimento(request.dataNascimento());
        professor.setRua(request.rua());
        professor.setComplemento(request.complemento());
        professor.setTelefone(request.telefone());
        professorRepository.save(professor);
        return toResponse(professor);
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
        return toResponse(usuario);
    }

    private AuthResponse toResponse(Usuario usuario) {
        String token = jwtService.generateToken(usuario);
        return new AuthResponse(token, usuario.getTipo().name(), usuario.getEmail(), resolverNome(usuario));
    }

    private String resolverNome(Usuario usuario) {
        if (usuario instanceof Admin) {
            return "Admin";
        }
        if (usuario instanceof Professor professor) {
            return professor.getNome();
        }
        if (usuario instanceof Aluno aluno) {
            return aluno.getNome();
        }
        return usuario.getEmail();
    }
}
