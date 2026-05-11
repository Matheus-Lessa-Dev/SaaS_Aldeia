package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AuthResponse;
import com.saas_aldeia.backend.dto.LoginRequest;
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

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/aluno")
    public ResponseEntity<AuthResponse> registerAluno(@Valid @RequestBody RegisterAlunoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerAluno(request));
    }

    @PostMapping("/register/professor")
    public ResponseEntity<AuthResponse> registerProfessor(@Valid @RequestBody RegisterProfessorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerProfessor(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}