package com.saas_aldeia.backend.dto;

import java.util.List;

public record TurmaResponse(
        Long id,
        String nome,
        String periodo,
        List<String> nomesProfessores,
        List<String> nomesJogos
) {}
