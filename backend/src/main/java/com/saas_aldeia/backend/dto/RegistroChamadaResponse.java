package com.saas_aldeia.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record RegistroChamadaResponse(
        Long id,
        Long chamadaId,
        LocalDate data,
        List<PresencaAlunoResponse> presencas
) {}
