package com.saas_aldeia.backend.dto;

import java.time.LocalDate;

public record ProfessorRequest(
        String nome,
        LocalDate dataNascimento,
        String email,
        String senha,
        String rua,
        String complemento,
        String telefone
) {}
