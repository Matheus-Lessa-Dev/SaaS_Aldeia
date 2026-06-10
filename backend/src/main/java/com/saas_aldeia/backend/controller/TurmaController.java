package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.TurmaAlunosRequest;
import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.dto.TurmaResponse;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.service.TurmaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@RequiredArgsConstructor
@Tag(name = "Turma", description = "Endpoints para gerenciamento de turmas")
public class TurmaController {

    private final TurmaService turmaService;

    @GetMapping
    @Operation(summary = "Listar turmas", description = "Retorna uma lista de todas as turmas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de turmas retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<TurmaResponse>> listar() {
        return ResponseEntity.ok(turmaService.listar());
    }

    @GetMapping("/minhas")
    @Operation(summary = "Listar minhas turmas", description = "Retorna as turmas vinculadas ao professor autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de turmas vinculadas retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso permitido apenas para professores")
    })
    public ResponseEntity<List<TurmaResponse>> listarMinhasTurmas(@AuthenticationPrincipal Usuario usuarioLogado) {
        if (usuarioLogado == null || usuarioLogado.getTipo() != TipoUsuario.PROFESSOR) {
            throw new AccessDeniedException("Apenas professores podem acessar suas turmas vinculadas");
        }

        return ResponseEntity.ok(turmaService.listarPorProfessor(usuarioLogado.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar turma por ID", description = "Retorna uma turma com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Turma encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Turma nao encontrada")
    })
    public ResponseEntity<TurmaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar turma", description = "Cria uma nova turma")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Turma criada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<TurmaResponse> criar(@Valid @RequestBody TurmaRequest request) {
        return ResponseEntity.status(201).body(turmaService.criar(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar turma", description = "Atualiza uma turma com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Turma atualizada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Turma nao encontrada")
    })
    public ResponseEntity<TurmaResponse> atualizar(@PathVariable Long id,
                                                   @RequestBody TurmaRequest request) {
        return ResponseEntity.ok(turmaService.atualizar(id, request));
    }

    @PutMapping("/{id}/alunos")
    @Operation(summary = "Vincular alunos a uma turma", description = "Vincula uma lista de alunos a uma turma com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Alunos vinculados com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Turma nao encontrada")
    })
    public ResponseEntity<Void> vincularTurma(@PathVariable Long id,
                                              @RequestBody TurmaAlunosRequest request) {
        turmaService.vincularAlunos(id, request.alunosIds());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar turma", description = "Deleta uma turma com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Turma deletada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Nao autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Turma nao encontrada")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        turmaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
