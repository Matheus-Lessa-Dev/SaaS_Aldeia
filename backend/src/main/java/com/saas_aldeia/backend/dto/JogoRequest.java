package com.saas_aldeia.backend.dto;

public record JogoRequest(
        String nome,
        String imgUrl,
        String tempo,
        String linkUrl
) {}
