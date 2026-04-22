package com.saas_aldeia.backend.dto;

public record JogoResponse(
        Long id,
        String nome,
        String imgUrl,
        String tempo,
        String linkUrl
) {}
