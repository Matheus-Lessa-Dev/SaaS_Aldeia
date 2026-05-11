package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RegisterRequest;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        Usuario usuario = new Usuario(
                null,
                request.email(),
                passwordEncoder.encode(request.senha()),
                TipoUsuario.ADMIN
        );
        usuarioRepository.save(usuario);
        return new AuthResponse(jwtService.generateToken(usuario));
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
        return new AuthResponse(jwtService.generateToken(usuario));
    }
}