package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.dto.TurmaResponse;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.JogoRepository;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final JogoRepository jogoRepository;

    @Transactional(readOnly = true)
    public List<TurmaResponse> listar() {
        return turmaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TurmaResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional
    public TurmaResponse criar(TurmaRequest request) {
        if (turmaRepository.existsByNome(request.nome()))
            throw new IllegalArgumentException("Já existe uma turma com esse nome");

        Turma turma = new Turma();
        turma.setNome(request.nome());
        turma.setPeriodo(request.periodo());
        turma.setJogos(resolverJogos(request.jogosIds()));
        turma.setAlunos(new ArrayList<>());

        Turma turmaSalva = turmaRepository.save(turma);
        vincularProfessores(turmaSalva, request.professoresIds());

        return toResponse(turmaSalva);
    }

    @Transactional
    public TurmaResponse atualizar(Long id, TurmaRequest request) {
        Turma turma = buscar(id);

        if (request.nome() != null) {
            if (!request.nome().equals(turma.getNome()) && turmaRepository.existsByNome(request.nome()))
                throw new IllegalArgumentException("Já existe uma turma com esse nome");
            turma.setNome(request.nome());
        }
        if (request.periodo() != null)
            turma.setPeriodo(request.periodo());
        if (request.professoresIds() != null)
            vincularProfessores(turma, request.professoresIds());
        if (request.jogosIds() != null)
            turma.setJogos(resolverJogos(request.jogosIds()));

        return toResponse(turmaRepository.save(turma));
    }

    @Transactional
    public void vincularAlunos(Long turmaId, List<Long> alunosIds) {
        Turma turma = buscar(turmaId);

        List<Aluno> alunosAtuais = alunoRepository.findByTurmaId(turmaId);
        alunosAtuais.forEach(aluno -> {
            if (!alunosIds.contains(aluno.getId())) {
                aluno.setTurma(null);
                alunoRepository.save(aluno);
            }
        });

        alunosIds.forEach(alunoId -> {
            Aluno aluno = alunoRepository.findById(alunoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado: " + alunoId));
            aluno.setTurma(turma);
            alunoRepository.save(aluno);
        });
    }

    @Transactional
    public void deletar(Long id) {
        Turma turma = buscar(id);

        List<Aluno> alunos = alunoRepository.findByTurmaId(id);
        alunos.forEach(aluno -> {
            aluno.setTurma(null);
            alunoRepository.save(aluno);
        });

        if (turma.getProfessores() != null) {
            turma.getProfessores().forEach(professor -> {
                professor.setTurma(null);
                professorRepository.save(professor);
            });
        }

        turmaRepository.deleteById(id);
    }

    public List<TurmaResponse> listarSemTurma() {
        return alunoRepository.findAll().stream()
                .filter(a -> a.getTurma() == null)
                .map(a -> new TurmaResponse(null, a.getNome(), null, null, null, 0))
                .toList();
    }

    private Turma buscar(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada"));
    }

    private List<Professor> resolverProfessores(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return ids.stream()
                .map(pid -> professorRepository.findById(pid)
                        .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado: " + pid)))
                .toList();
    }

    private void vincularProfessores(Turma turma, List<Long> professoresIds) {
        List<Long> ids = professoresIds == null ? new ArrayList<>() : professoresIds;

        if (turma.getProfessores() != null) {
            turma.getProfessores().forEach(professor -> {
                if (!ids.contains(professor.getId())) {
                    professor.setTurma(null);
                    professorRepository.save(professor);
                }
            });
        }

        List<Professor> professoresVinculados = resolverProfessores(ids);
        professoresVinculados.forEach(professor -> {
            professor.setTurma(turma);
            professorRepository.save(professor);
        });
        turma.setProfessores(professoresVinculados);
    }

    private List<Jogo> resolverJogos(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return ids.stream()
                .map(jid -> jogoRepository.findById(jid)
                        .orElseThrow(() -> new ResourceNotFoundException("Jogo não encontrado: " + jid)))
                .toList();
    }

    private TurmaResponse toResponse(Turma t) {
        List<String> nomesProfessores = t.getProfessores() == null
                ? new ArrayList<>()
                : t.getProfessores().stream().map(Professor::getNome).toList();
        List<String> nomesJogos = t.getJogos() == null
                ? new ArrayList<>()
                : t.getJogos().stream().map(Jogo::getNome).toList();
        int totalAlunos = t.getAlunos() == null ? 0 : t.getAlunos().size();
        return new TurmaResponse(t.getId(), t.getNome(), t.getPeriodo(), nomesProfessores, nomesJogos, totalAlunos);
    }
}
