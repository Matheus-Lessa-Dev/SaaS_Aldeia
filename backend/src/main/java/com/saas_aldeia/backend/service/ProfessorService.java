package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.ProfessorRequest;
import com.saas_aldeia.backend.dto.ProfessorResponse;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ProfessorResponse> listar() {
        return professorRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProfessorResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional
    public ProfessorResponse atualizar(Long id, ProfessorRequest request) {
        Professor professor = buscar(id);

        if (request.nome() != null)            professor.setNome(request.nome());
        if (request.dataNascimento() != null)  professor.setDataNascimento(request.dataNascimento());
        if (request.rua() != null)             professor.setRua(request.rua());
        if (request.complemento() != null)     professor.setComplemento(request.complemento());
        if (request.telefone() != null)        professor.setTelefone(request.telefone());
        if (request.email() != null)           professor.setEmail(request.email());
        if (request.senha() != null && !request.senha().isBlank())
            professor.setSenha(passwordEncoder.encode(request.senha()));

        return toResponse(professorRepository.save(professor));
    }

    @Transactional
    public void deletar(Long id) {
        if (!professorRepository.existsById(id))
            throw new IllegalArgumentException("Professor não encontrado");
        professorRepository.deleteById(id);
    }

    private Professor buscar(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));
    }

    private ProfessorResponse toResponse(Professor p) {
        return new ProfessorResponse(p.getId(), p.getNome(), p.getEmail(), p.getTelefone());
    }
}