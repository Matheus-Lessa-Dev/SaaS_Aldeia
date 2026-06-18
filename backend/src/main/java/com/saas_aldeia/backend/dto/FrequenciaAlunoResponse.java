package com.saas_aldeia.backend.dto;

import java.util.List;

public record FrequenciaAlunoResponse(
        long totalRegistros,
        long presentes,
        long faltas,
        long justificadas,
        int percentualPresenca,
        List<FrequenciaAlunoItemResponse> registros
) {}
