package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AdminRequest;
import com.saas_aldeia.backend.dto.AdminResponse;
import com.saas_aldeia.backend.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Endpoints para gerenciamento de administradores")
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    @Operation(summary = "Listar administradores", description = "Retorna uma lista de todos os administradores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de administradores retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<AdminResponse>> listar() {
        return ResponseEntity.ok(adminService.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar administrador por ID", description = "Retorna um administrador com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Administrador encontrado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Administrador não encontrado")
    })
    public ResponseEntity<AdminResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar administrador", description = "Atualiza um administrador com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Administrador atualizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Administrador não encontrado")
    })
    public ResponseEntity<AdminResponse> atualizar(@PathVariable Long id,
            @Valid @RequestBody AdminRequest request) {
        return ResponseEntity.ok(adminService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar administrador", description = "Deleta um administrador com base no ID fornecido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Administrador deletado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "404", description = "Administrador não encontrado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        adminService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
