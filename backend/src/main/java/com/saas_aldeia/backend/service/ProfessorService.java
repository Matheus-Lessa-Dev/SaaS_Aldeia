package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.ProfessorRequest;
import com.saas_aldeia.backend.dto.ProfessorResponse;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;
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
        if (request.email() != null) {
            String email = request.email().trim();
            if (usuarioRepository.existsByEmailAndIdNot(email, professor.getId())) {
                throw new IllegalArgumentException("Email ja cadastrado");
            }
            professor.setEmail(email);
        }
        if (request.senha() != null && !request.senha().isBlank())
            professor.setSenha(passwordEncoder.encode(request.senha()));
        return toResponse(professorRepository.save(professor));
    }

    @Transactional
    public void deletar(Long id) {
        Professor professor = buscar(id);

        if (professor.getTurmas() != null) {
            professor.getTurmas().forEach(turma -> {
                if (turma.getProfessores() != null) {
                    turma.getProfessores().remove(professor);
                }
            });
            professor.getTurmas().clear();
        }

        professorRepository.delete(professor);
    }

    private Professor buscar(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado"));
    }

    private ProfessorResponse toResponse(Professor p) {
        return new ProfessorResponse(
                p.getId(),
                p.getNome(),
                p.getEmail(),
                p.getDataNascimento(),  
                p.getRua(),             
                p.getComplemento(),     
                p.getTelefone()
        );
    }
}
