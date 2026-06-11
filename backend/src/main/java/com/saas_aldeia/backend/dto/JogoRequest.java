package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record JogoRequest(
        @NotBlank(message = "Informe o nome do jogo")
        @Size(max = 45, message = "O nome deve ter no maximo 45 caracteres")
        String nome,

        @Size(max = 1000, message = "A URL da imagem deve ter no maximo 1000 caracteres")
        String imgUrl,

        @NotNull(message = "Informe o tempo estimado")
        @Positive(message = "O tempo deve ser maior que zero")
        Integer tempo,

        @NotBlank(message = "Informe o link do jogo")
        @Size(max = 1000, message = "A URL do jogo deve ter no maximo 1000 caracteres")
        String linkUrl,

        Boolean habilitado,

        List<Long> turmasIds
) {}
