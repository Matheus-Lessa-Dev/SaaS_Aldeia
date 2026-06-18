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
public class ChamadaController {

    private final ChamadaService chamadaService;

    @GetMapping
    public ResponseEntity<List<ChamadaResponse>> listar(@AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.listar(usuarioLogado));
    }

    @GetMapping("/minha-frequencia")
    public ResponseEntity<FrequenciaAlunoResponse> buscarMinhaFrequencia(
            @AuthenticationPrincipal Usuario usuarioLogado) {
        if (usuarioLogado == null || usuarioLogado.getTipo() != TipoUsuario.ALUNO) {
            throw new AccessDeniedException("Apenas alunos podem acessar a propria frequencia");
        }

        return ResponseEntity.ok(chamadaService.buscarFrequenciaAluno(usuarioLogado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChamadaResponse> buscar(@PathVariable Long id,
                                                  @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.buscarPorId(id, usuarioLogado));
    }

    @PostMapping
    public ResponseEntity<ChamadaResponse> criar(@Valid @RequestBody ChamadaRequest request,
                                                 @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.status(201).body(chamadaService.criar(request, usuarioLogado));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ChamadaResponse> atualizarStatus(@PathVariable Long id,
                                                           @Valid @RequestBody ChamadaStatusRequest request,
                                                           @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.atualizarStatus(id, request.status(), usuarioLogado));
    }

    @GetMapping("/{id}/registros")
    public ResponseEntity<RegistroChamadaResponse> buscarRegistro(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.buscarRegistro(id, data, usuarioLogado));
    }

    @PutMapping("/{id}/registros")
    public ResponseEntity<RegistroChamadaResponse> salvarRegistro(
            @PathVariable Long id,
            @Valid @RequestBody RegistroChamadaRequest request,
            @AuthenticationPrincipal Usuario usuarioLogado) {
        return ResponseEntity.ok(chamadaService.salvarRegistro(id, request, usuarioLogado));
    }
}
