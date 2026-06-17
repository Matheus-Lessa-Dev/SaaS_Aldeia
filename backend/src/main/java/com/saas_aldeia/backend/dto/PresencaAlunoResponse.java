package com.saas_aldeia.backend.dto;

import com.saas_aldeia.backend.model.StatusPresenca;

public record PresencaAlunoResponse(
        Long alunoId,
        String nomeAluno,
        StatusPresenca status,
        String observacao
) {}
