package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.dto.JogoResponse;
import com.saas_aldeia.backend.service.JogoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jogos")
@RequiredArgsConstructor
public class JogoController {

    private final JogoService jogoService;

    @GetMapping
    public ResponseEntity<List<JogoResponse>> listar() {
        return ResponseEntity.ok(jogoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JogoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(jogoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<JogoResponse> criar(@Valid @RequestBody JogoRequest request) {
        return ResponseEntity.status(201).body(jogoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JogoResponse> atualizar(@PathVariable Long id,
                                                  @RequestBody JogoRequest request) {
        return ResponseEntity.ok(jogoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        jogoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
