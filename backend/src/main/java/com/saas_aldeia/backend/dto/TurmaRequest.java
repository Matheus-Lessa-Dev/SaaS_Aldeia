package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record TurmaRequest(
        @NotBlank String nome,
        String periodo,
        List<Long> professoresIds,
        List<Long> jogosIds
) {}
