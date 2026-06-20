package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.ContaResponse;
import com.saas_aldeia.backend.dto.ContaUpdateRequest;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.service.ContaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/conta")
@RequiredArgsConstructor
public class ContaController {

    private final ContaService contaService;

    @GetMapping
    public ResponseEntity<ContaResponse> buscar(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(contaService.buscar(usuarioLogado));
    }

    @PutMapping
    public ResponseEntity<AuthResponse> atualizar(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody ContaUpdateRequest request) {
        return ResponseEntity.ok(contaService.atualizar(usuarioLogado, request));
    }
}
