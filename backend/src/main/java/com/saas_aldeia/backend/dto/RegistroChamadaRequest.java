package com.saas_aldeia.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.List;

public record RegistroChamadaRequest(
        LocalDate data,
        @NotEmpty List<@Valid PresencaAlunoRequest> presencas
) {}
