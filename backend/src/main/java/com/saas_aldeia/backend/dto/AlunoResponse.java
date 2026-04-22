package com.saas_aldeia.backend.dto;

public record AlunoResponse(
        Long id,
        String nome,
        String email,
        String nomeResponsavel,
        String telefoneResponsavel,
        String nomeTurma
) {}
