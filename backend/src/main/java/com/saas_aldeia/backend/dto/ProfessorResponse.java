package com.saas_aldeia.backend.dto;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
        String telefone
) {}
