package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AlunoRequest;
import com.saas_aldeia.backend.dto.AlunoResponse;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
}