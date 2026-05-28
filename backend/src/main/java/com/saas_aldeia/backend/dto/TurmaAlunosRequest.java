package com.saas_aldeia.backend.dto;

import java.util.List;

public record TurmaAlunosRequest(
        List<Long> alunosIds
) {}
