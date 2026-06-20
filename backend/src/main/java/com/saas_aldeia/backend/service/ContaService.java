package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.ContaResponse;
import com.saas_aldeia.backend.dto.ContaUpdateRequest;
import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContaService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public ContaResponse buscar(Usuario usuarioLogado) {
        return toResponse(usuarioLogado);
    }

    @Transactional
    public AuthResponse atualizar(Usuario usuarioLogado, ContaUpdateRequest request) {
        if (request.senhaAtual() == null || request.senhaAtual().isBlank()
                || !passwordEncoder.matches(request.senhaAtual(), usuarioLogado.getSenha())) {
            throw new IllegalArgumentException("Senha atual invalida");
        }

        if (request.nome() != null && !request.nome().isBlank()) {
            setNome(usuarioLogado, request.nome().trim());
        }

        if (request.email() != null && !request.email().isBlank()) {
            String email = request.email().trim();
            if (usuarioRepository.existsByEmailAndIdNot(email, usuarioLogado.getId())) {
                throw new IllegalArgumentException("Email ja cadastrado");
            }
            usuarioLogado.setEmail(email);
        }

        if (request.senha() != null && !request.senha().isBlank()) {
            usuarioLogado.setSenha(passwordEncoder.encode(request.senha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuarioLogado);
        return new AuthResponse(
                jwtService.generateToken(usuarioAtualizado),
                usuarioAtualizado.getTipo().name(),
                usuarioAtualizado.getEmail(),
                resolverNome(usuarioAtualizado)
        );
    }

    private ContaResponse toResponse(Usuario usuario) {
        return new ContaResponse(
                usuario.getId(),
                resolverNome(usuario),
                usuario.getEmail(),
                usuario.getTipo().name()
        );
    }

    private void setNome(Usuario usuario, String nome) {
        if (usuario instanceof Admin admin) {
            admin.setNome(nome);
            return;
        }
        if (usuario instanceof Professor professor) {
            professor.setNome(nome);
            return;
        }
        if (usuario instanceof Aluno aluno) {
            aluno.setNome(nome);
        }
    }

    private String resolverNome(Usuario usuario) {
        if (usuario instanceof Admin admin) {
            return admin.getNome();
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
