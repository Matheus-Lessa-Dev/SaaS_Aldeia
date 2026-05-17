package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.ProfessorRequest;
import com.saas_aldeia.backend.dto.ProfessorResponse;
import com.saas_aldeia.backend.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping
    public ResponseEntity<List<ProfessorResponse>> listar() {
        return ResponseEntity.ok(professorService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponse> atualizar(@PathVariable Long id,
                                                       @RequestBody ProfessorRequest request) {
        return ResponseEntity.ok(professorService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        professorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}