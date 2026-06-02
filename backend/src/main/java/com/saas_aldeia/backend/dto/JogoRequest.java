package com.saas_aldeia.backend.dto;

public record JogoRequest(
        String nome,
        String imgUrl,
        Integer tempo,
        String linkUrl,
        Boolean habilitado
) {}
