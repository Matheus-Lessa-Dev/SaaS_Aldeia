package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.ContaResponse;
import com.saas_aldeia.backend.dto.ContaUpdateRequest;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.service.ContaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Conta", description = "Endpoints para gerenciamento de conta do usuário")
public class ContaController {

    private final ContaService contaService;

    @GetMapping
    @Operation(summary = "Buscar conta do usuário", description = "Busca os detalhes da conta do usuário logado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conta encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<ContaResponse> buscar(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(contaService.buscar(usuarioLogado));
    }

    @PutMapping
    @Operation(summary = "Atualizar conta do usuário", description = "Atualiza os detalhes da conta do usuário logado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conta atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<AuthResponse> atualizar(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @Valid @RequestBody ContaUpdateRequest request) {
        return ResponseEntity.ok(contaService.atualizar(usuarioLogado, request));
    }
}
