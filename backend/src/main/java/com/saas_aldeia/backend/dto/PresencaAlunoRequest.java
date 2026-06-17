package com.saas_aldeia.backend.dto;

import com.saas_aldeia.backend.model.StatusPresenca;
import jakarta.validation.constraints.NotNull;

public record PresencaAlunoRequest(
        @NotNull Long alunoId,
        @NotNull StatusPresenca status,
        String observacao
) {}
