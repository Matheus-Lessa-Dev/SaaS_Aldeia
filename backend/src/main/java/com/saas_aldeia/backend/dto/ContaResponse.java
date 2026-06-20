package com.saas_aldeia.backend.dto;

public record ContaResponse(
        Long id,
        String nome,
        String email,
        String role
) {}
