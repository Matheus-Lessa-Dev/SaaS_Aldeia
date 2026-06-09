package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RegisterProfessorRequest(
                @NotBlank @Email String email,
                @NotBlank String nome,
                @NotNull LocalDate dataNascimento,
                String rua,
                String complemento,
                String telefone) {
}