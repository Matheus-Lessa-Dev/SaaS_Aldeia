package com.saas_aldeia.backend.dto;

public record JogoResponse(
        Long id,
        String nome,
        String imgUrl,
        Integer tempo,
        String linkUrl,
        Boolean habilitado
) {}
