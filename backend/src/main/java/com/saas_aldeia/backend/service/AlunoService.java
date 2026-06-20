package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AlunoRequest;
import com.saas_aldeia.backend.dto.AlunoResponse;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AlunoResponse> listar() {
        return alunoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public AlunoResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    public List<AlunoResponse> listarPorTurmaDoAluno(Long alunoId) {
        Aluno aluno = buscar(alunoId);

        if (aluno.getTurma() == null) {
            return List.of();
        }

        return listarPorTurma(aluno.getTurma().getId());
    }

    public List<AlunoResponse> listarSemTurma() {
        return alunoRepository.findAll().stream()
                .filter(a -> a.getTurma() == null)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AlunoResponse atualizar(Long id, AlunoRequest request) {
        Aluno aluno = buscar(id);

        if (request.nome() != null)               aluno.setNome(request.nome());
        if (request.dataNascimento() != null)      aluno.setDataNascimento(request.dataNascimento());
        if (request.rua() != null)                 aluno.setRua(request.rua());
        if (request.complemento() != null)         aluno.setComplemento(request.complemento());
        if (request.nomeResponsavel() != null)     aluno.setNomeResponsavel(request.nomeResponsavel());
        if (request.telefoneResponsavel() != null) aluno.setTelefoneResponsavel(request.telefoneResponsavel());
        if (request.emailResponsavel() != null)    aluno.setEmailResponsavel(request.emailResponsavel());
        if (request.email() != null) {
            String email = request.email().trim();
            if (usuarioRepository.existsByEmailAndIdNot(email, aluno.getId())) {
                throw new IllegalArgumentException("Email ja cadastrado");
            }
            aluno.setEmail(email);
        }
        if (request.senha() != null && !request.senha().isBlank())
            aluno.setSenha(passwordEncoder.encode(request.senha()));
        if (request.turmaId() != null)
            aluno.setTurma(turmaRepository.findById(request.turmaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada")));

        return toResponse(alunoRepository.save(aluno));
    }

    @Transactional
    public void deletar(Long id) {
        if (!alunoRepository.existsById(id))
            throw new ResourceNotFoundException("Aluno não encontrado");
        alunoRepository.deleteById(id);
    }

    private Aluno buscar(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));
    }

    private AlunoResponse toResponse(Aluno a) {
        return new AlunoResponse(
                a.getId(),
                a.getNome(),
                a.getEmail(),
                a.getDataNascimento(),          
                a.getRua(),                     
                a.getComplemento(),             
                a.getNomeResponsavel(),
                a.getTelefoneResponsavel(),
                a.getEmailResponsavel(),        
                a.getTurma() != null ? a.getTurma().getId() : null,
                a.getTurma() != null ? a.getTurma().getNome() : null
        );
    }

    public List<AlunoResponse> listarPorTurma(Long turmaId) {
        return alunoRepository.findByTurmaId(turmaId).stream().map(this::toResponse).toList();
    }
}
