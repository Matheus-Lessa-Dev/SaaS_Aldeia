package com.saas_aldeia.backend.dto;

import com.saas_aldeia.backend.model.StatusChamada;
import jakarta.validation.constraints.NotNull;

public record ChamadaStatusRequest(
        @NotNull StatusChamada status
) {}
