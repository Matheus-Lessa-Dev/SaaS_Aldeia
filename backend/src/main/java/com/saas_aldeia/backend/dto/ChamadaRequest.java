package com.saas_aldeia.backend.dto;

import com.saas_aldeia.backend.model.TipoPeriodoChamada;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ChamadaRequest(
        @NotBlank String nome,
        @NotNull Long turmaId,
        @NotNull TipoPeriodoChamada tipoPeriodo,
        @NotNull @Positive Integer numeroPeriodo
) {}
