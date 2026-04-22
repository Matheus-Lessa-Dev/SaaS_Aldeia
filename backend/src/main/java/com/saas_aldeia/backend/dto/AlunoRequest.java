package com.saas_aldeia.backend.dto;

import java.time.LocalDate;

public record AlunoRequest(
        String nome,
        LocalDate dataNascimento,
        String email,
        String senha,
        String rua,
        String complemento,
        String nomeResponsavel,
        String telefoneResponsavel,
        String emailResponsavel,
        Long turmaId
) {}
