package com.saas_aldeia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterAlunoRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String senha,
        @NotBlank String nome,
        LocalDate dataNascimento,
        String rua,
        String complemento,
        String nomeResponsavel,
        String telefoneResponsavel,
        String emailResponsavel
) {}