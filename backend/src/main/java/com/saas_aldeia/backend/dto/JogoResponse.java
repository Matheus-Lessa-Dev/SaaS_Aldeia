package com.saas_aldeia.backend.dto;

import java.util.List;

public record JogoResponse(
        Long id,
        String nome,
        String imgUrl,
        Integer tempo,
        String linkUrl,
        Boolean habilitado,
        List<Long> turmasIds,
        List<String> nomesTurmas
) {}
