package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.TrocaSenhaRequest;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.service.PerfilService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/perfil")
@RequiredArgsConstructor
@Tag(name = "Perfil", description = "Endpoints para gerenciamento do perfil do usuário")
public class PerfilController {

    private final PerfilService perfilService;

    @PutMapping("/senha")
    @Operation(summary = "Trocar senha", description = "Permite ao usuário trocar sua senha")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Senha trocada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Void> trocarSenha(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody TrocaSenhaRequest request) {
        perfilService.trocarSenha(usuarioLogado, request);
        return ResponseEntity.noContent().build();
    }
}