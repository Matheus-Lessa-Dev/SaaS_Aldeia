package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterAdminRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String senha,
        @NotBlank String nome
) {}
