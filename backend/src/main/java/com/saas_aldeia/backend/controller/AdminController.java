package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AdminRequest;
import com.saas_aldeia.backend.dto.AdminResponse;
import com.saas_aldeia.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminResponse>> listar() {
        return ResponseEntity.ok(adminService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminResponse> atualizar(@PathVariable Long id,
                                                   @Valid @RequestBody AdminRequest request) {
        return ResponseEntity.ok(adminService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        adminService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
