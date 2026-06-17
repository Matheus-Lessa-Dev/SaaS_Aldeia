package com.saas_aldeia.backend.dto;

import com.saas_aldeia.backend.model.StatusChamada;
import com.saas_aldeia.backend.model.TipoPeriodoChamada;

public record ChamadaResponse(
        Long id,
        String nome,
        Long turmaId,
        String nomeTurma,
        TipoPeriodoChamada tipoPeriodo,
        Integer numeroPeriodo,
        StatusChamada status,
        long totalRegistros,
        long presentes,
        long faltas,
        long justificadas
) {}
