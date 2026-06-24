package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.ChamadaRequest;
import com.saas_aldeia.backend.dto.ChamadaResponse;
import com.saas_aldeia.backend.dto.ChamadaStatusRequest;
import com.saas_aldeia.backend.dto.FrequenciaAlunoResponse;
import com.saas_aldeia.backend.dto.RegistroChamadaRequest;
import com.saas_aldeia.backend.dto.RegistroChamadaResponse;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.service.ChamadaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/chamadas")
@RequiredArgsConstructor
@Tag(name = "Chamada", description = "Endpoints para gerenciamento de chamadas e frequências")
public class ChamadaController {

    private final ChamadaService chamadaService;

    @GetMapping
    @Operation(summary = "Listar chamadas", description = "Lista todas as chamadas disponíveis para o usuário logado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chamadas listadas com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<ChamadaResponse>> listar(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.listar(usuarioLogado));
    }

    @GetMapping("/minha-frequencia")
    @Operation(summary = "Buscar frequência do aluno", description = "Busca a frequência do aluno logado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Frequência encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<FrequenciaAlunoResponse> buscarMinhaFrequencia(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        if (usuarioLogado == null || usuarioLogado.getTipo() != TipoUsuario.ALUNO) {
            throw new AccessDeniedException("Apenas alunos podem acessar a propria frequencia");
        }

        return ResponseEntity.ok(chamadaService.buscarFrequenciaAluno(usuarioLogado));
    }

    @GetMapping("/alunos/{alunoId}/frequencia")
    @Operation(summary = "Buscar frequência do aluno", description = "Busca a frequência do aluno por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Frequência encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<FrequenciaAlunoResponse> buscarFrequenciaDoAluno(
            @PathVariable Long alunoId,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.buscarFrequenciaAlunoPorId(alunoId, usuarioLogado));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar chamada", description = "Busca uma chamada por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chamada encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<ChamadaResponse> buscar(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.buscarPorId(id, usuarioLogado));
    }

    @PostMapping
    @Operation(summary = "Criar chamada", description = "Cria uma nova chamada")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Chamada criada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<ChamadaResponse> criar(@Valid @RequestBody ChamadaRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.status(201).body(chamadaService.criar(request, usuarioLogado));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Atualizar status da chamada", description = "Atualiza o status de uma chamada por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<ChamadaResponse> atualizarStatus(@PathVariable Long id,
            @Valid @RequestBody ChamadaStatusRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.atualizarStatus(id, request.status(), usuarioLogado));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar chamada", description = "Deleta uma chamada por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Chamada deletada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        chamadaService.deletar(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/registros")
    @Operation(summary = "Buscar registro da chamada", description = "Busca o registro de uma chamada por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registro encontrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<RegistroChamadaResponse> buscarRegistro(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.buscarRegistro(id, data, usuarioLogado));
    }

    @PutMapping("/{id}/registros")
    @Operation(summary = "Salvar registro da chamada", description = "Salva o registro de uma chamada por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registro salvo com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<RegistroChamadaResponse> salvarRegistro(
            @PathVariable Long id,
            @Valid @RequestBody RegistroChamadaRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.salvarRegistro(id, request, usuarioLogado));
    }
}
