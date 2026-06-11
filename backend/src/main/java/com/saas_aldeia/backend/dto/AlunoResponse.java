package com.saas_aldeia.backend.dto;

import java.time.LocalDate;

public record AlunoResponse(
        Long id,
        String nome,
        String email,
        LocalDate dataNascimento,      
        String rua,                    
        String complemento,            
        String nomeResponsavel,
        String telefoneResponsavel,
        String emailResponsavel,       
        Long turmaId,
        String nomeTurma
) {}
