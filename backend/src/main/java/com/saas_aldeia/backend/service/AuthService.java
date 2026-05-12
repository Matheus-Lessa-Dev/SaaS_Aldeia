package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RegisterAdminRequest;
import com.saas_aldeia.backend.dto.RegisterAlunoRequest;
import com.saas_aldeia.backend.dto.RegisterProfessorRequest;
import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.AdminRepository;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final AdminRepository adminRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthResponse registerAdmin(RegisterAdminRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        Admin admin = new Admin();
        admin.setEmail(request.email());
        admin.setSenha(passwordEncoder.encode(request.senha()));
        admin.setTipo(TipoUsuario.ADMIN);
        admin.setNome(request.nome());
        adminRepository.save(admin);
        return toResponse(admin);
    }

    public AuthResponse registerAluno(RegisterAlunoRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        Aluno aluno = new Aluno();
        aluno.setEmail(request.email());
        aluno.setSenha(passwordEncoder.encode(request.senha()));
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
        Professor professor = new Professor();
        professor.setEmail(request.email());
        professor.setSenha(passwordEncoder.encode(request.senha()));
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

    /** Recebe um Refresh Token válido e devolve um novo par de tokens */
    public AuthResponse refresh(String refreshToken) {
        String email;
        try {
            email = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new BadCredentialsException("Refresh token inválido");
        }

        Usuario usuario = (Usuario) userDetailsService.loadUserByUsername(email);

        if (!jwtService.isValidRefreshToken(refreshToken, usuario)) {
            throw new BadCredentialsException("Refresh token inválido ou expirado");
        }

        return toResponse(usuario);
    }

    private AuthResponse toResponse(Usuario usuario) {
        String token        = jwtService.generateToken(usuario);
        String refreshToken = jwtService.generateRefreshToken(usuario);
        return new AuthResponse(token, refreshToken, usuario.getTipo().name(), usuario.getEmail());
    }
}
