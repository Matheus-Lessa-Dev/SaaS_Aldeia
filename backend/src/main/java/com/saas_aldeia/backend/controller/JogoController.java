package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.dto.JogoResponse;
import com.saas_aldeia.backend.service.JogoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/jogos")
@RequiredArgsConstructor
@Tag(name = "Jogo", description = "Endpoints para gerenciamento de jogos")
public class JogoController {

    private final JogoService jogoService;

    @GetMapping
    @Operation(summary = "Listar jogos", description = "Retorna uma lista de todos os jogos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de jogos retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<JogoResponse>> listar() {
        return ResponseEntity.ok(jogoService.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar jogo", description = "Retorna um jogo com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jogo retornado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Jogo não encontrado")
    })
    public ResponseEntity<JogoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(jogoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar jogo", description = "Cria um novo jogo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Jogo criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<JogoResponse> criar(@Valid @RequestBody JogoRequest request) {
        return ResponseEntity.status(201).body(jogoService.criar(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar jogo", description = "Atualiza um jogo com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jogo atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Jogo não encontrado")
    })
    public ResponseEntity<JogoResponse> atualizar(@PathVariable Long id,
            @RequestBody JogoRequest request) {
        return ResponseEntity.ok(jogoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar jogo", description = "Deleta um jogo com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Jogo deletado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Jogo não encontrado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        jogoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
