package com.saas_aldeia.backend.dto;

import java.util.List;

public record TurmaRequest(
        String nome,
        String periodo,
        List<Long> professoresIds,
        List<Long> jogosIds
) {}
