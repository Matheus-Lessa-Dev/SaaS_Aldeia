package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AlunoRequest;
import com.saas_aldeia.backend.dto.AlunoResponse;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
@Tag(name = "Aluno", description = "Endpoints para gerenciamento de alunos")
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping
    @Operation(summary = "Listar alunos", description = "Retorna uma lista de todos os alunos, opcionalmente filtrada por turma")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de alunos retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<AlunoResponse>> listar(@RequestParam(required = false) Long turmaId) {
        if (turmaId != null) {
            return ResponseEntity.ok(alunoService.listarPorTurma(turmaId));
        }
        return ResponseEntity.ok(alunoService.listar());
    }

    @GetMapping("/me")
    @Operation(summary = "Buscar dados do aluno autenticado", description = "Retorna os dados do aluno logado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Aluno retornado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso permitido apenas para alunos")
    })
    public ResponseEntity<AlunoResponse> buscarMe(@AuthenticationPrincipal Usuario usuarioLogado) {
        if (usuarioLogado == null || usuarioLogado.getTipo() != TipoUsuario.ALUNO) {
            throw new AccessDeniedException("Apenas alunos podem acessar seus proprios dados");
        }

        return ResponseEntity.ok(alunoService.buscarPorId(usuarioLogado.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar aluno por ID", description = "Retorna um aluno com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Aluno encontrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<AlunoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar aluno", description = "Atualiza um aluno com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Aluno atualizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<AlunoResponse> atualizar(@PathVariable Long id,
            @Valid @RequestBody AlunoRequest request) {
        return ResponseEntity.ok(alunoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar aluno", description = "Deleta um aluno com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Aluno deletado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sem-turma")
    @Operation(summary = "Listar alunos sem turma", description = "Retorna uma lista de todos os alunos que não estão atribuídos a uma turma")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de alunos sem turma retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<AlunoResponse>> listarSemTurma() {
        return ResponseEntity.ok(alunoService.listarSemTurma());
    }
}
