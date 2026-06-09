package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ProfessorRequest(
        @NotBlank String nome,
        LocalDate dataNascimento,
        @Email String email,
        String senha,
        String rua,
        String complemento,
        String telefone
) {}
