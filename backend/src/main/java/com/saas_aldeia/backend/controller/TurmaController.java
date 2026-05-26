package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.dto.TurmaResponse;
import com.saas_aldeia.backend.service.TurmaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaService turmaService;

    @GetMapping
    public ResponseEntity<List<TurmaResponse>> listar() {
        return ResponseEntity.ok(turmaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TurmaResponse> criar(@RequestBody TurmaRequest request) {
        return ResponseEntity.status(201).body(turmaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponse> atualizar(@PathVariable Long id,
                                                   @RequestBody TurmaRequest request) {
        return ResponseEntity.ok(turmaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        turmaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}