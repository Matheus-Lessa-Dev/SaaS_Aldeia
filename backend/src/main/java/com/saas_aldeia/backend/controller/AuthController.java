package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.LoginRequest;
import com.saas_aldeia.backend.dto.RegisterAdminRequest;
import com.saas_aldeia.backend.dto.RegisterAlunoRequest;
import com.saas_aldeia.backend.dto.RegisterProfessorRequest;
import com.saas_aldeia.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Endpoints para autenticação e registro de usuários")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/admin")
    @Operation(summary = "Registrar administrador", description = "Registra um novo administrador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Administrador registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<AuthResponse> registerAdmin(@Valid @RequestBody RegisterAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAdmin(request));
    }

    @PostMapping("/register/aluno")
    @Operation(summary = "Registrar aluno", description = "Registra um novo aluno")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Aluno registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<AuthResponse> registerAluno(@Valid @RequestBody RegisterAlunoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAluno(request));
    }

    @PostMapping("/register/professor")
    @Operation(summary = "Registrar professor", description = "Registra um novo professor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Professor registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Requisição inválida"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<AuthResponse> registerProfessor(@Valid @RequestBody RegisterProfessorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerProfessor(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Fazer login", description = "Realiza o login de um usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

}
