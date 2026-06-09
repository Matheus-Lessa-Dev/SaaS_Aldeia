package com.saas_aldeia.backend.service;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.saas_aldeia.backend.dto.TrocaSenhaRequest;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public PerfilService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void trocarSenha(Usuario usuarioLogado, TrocaSenhaRequest request) {
        if (!passwordEncoder.matches(request.senhaAtual(), usuarioLogado.getSenha())) {
            throw new BadCredentialsException("Senha atual incorreta");
        }

        usuarioLogado.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioLogado.setPrimeiroAcesso(false); // libera o acesso normal depois
        usuarioRepository.save(usuarioLogado);
    }
}
