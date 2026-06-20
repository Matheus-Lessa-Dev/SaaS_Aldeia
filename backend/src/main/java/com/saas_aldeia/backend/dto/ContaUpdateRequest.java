package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record ContaUpdateRequest(
        String nome,
        @Email String email,
        String senhaAtual,
        @Size(min = 6) String senha
) {}
