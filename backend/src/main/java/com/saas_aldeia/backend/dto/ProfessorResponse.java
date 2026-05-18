package com.saas_aldeia.backend.dto;

import java.time.LocalDate;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
        LocalDate dataNascimento,      
        String rua,                    
        String complemento,            
        String telefone
) {}