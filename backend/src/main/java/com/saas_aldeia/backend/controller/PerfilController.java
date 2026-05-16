package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.TrocaSenhaRequest;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PutMapping("/senha")
    public ResponseEntity<Void> trocarSenha(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody TrocaSenhaRequest request
    ) {
        if (!passwordEncoder.matches(request.senhaAtual(), usuarioLogado.getSenha())) {
            throw new BadCredentialsException("Senha atual incorreta");
        }

        usuarioLogado.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioLogado.setPrimeiroAcesso(false); // libera o acesso normal depois
        usuarioRepository.save(usuarioLogado);

        return ResponseEntity.noContent().build();
    }
}