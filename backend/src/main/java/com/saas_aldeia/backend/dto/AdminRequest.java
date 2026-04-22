package com.saas_aldeia.backend.dto;

public record AdminRequest(
        String nome,
        String email,
        String senha
) {}