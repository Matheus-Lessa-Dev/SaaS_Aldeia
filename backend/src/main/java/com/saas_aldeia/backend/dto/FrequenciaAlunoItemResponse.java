package com.saas_aldeia.backend.dto;

import com.saas_aldeia.backend.model.StatusPresenca;

import java.time.LocalDate;

public record FrequenciaAlunoItemResponse(
        Long chamadaId,
        String nomeChamada,
        LocalDate data,
        StatusPresenca status,
        String observacao
) {}
