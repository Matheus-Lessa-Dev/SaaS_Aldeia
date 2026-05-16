package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrocaSenhaRequest(
        @NotBlank String senhaAtual,
        @NotBlank @Size(min = 6) String novaSenha
) {}