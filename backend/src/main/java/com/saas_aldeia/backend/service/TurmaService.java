package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.dto.TurmaResponse;
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
    public List<TurmaResponse> listarPorProfessor(Long professorId) {
        return turmaRepository.findByProfessoresId(professorId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TurmaResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional
    public TurmaResponse criar(TurmaRequest request) {
        if (turmaRepository.existsByNome(request.nome())) {
            throw new IllegalArgumentException("Já existe uma turma com esse nome");
        }

        Turma turma = new Turma();
        turma.setNome(request.nome());
        turma.setPeriodo(request.periodo());
        turma.setJogos(resolverJogos(request.jogosIds()));
        turma.setAlunos(new ArrayList<>());

        Turma turmaSalva = turmaRepository.save(turma);
        vincularProfessores(turmaSalva, request.professoresIds());

        return toResponse(buscar(turmaSalva.getId()));
    }

    @Transactional
    public TurmaResponse atualizar(Long id, TurmaRequest request) {
        Turma turma = buscar(id);

        if (request.nome() != null) {
            if (!request.nome().equals(turma.getNome()) && turmaRepository.existsByNome(request.nome())) {
                throw new IllegalArgumentException("Já existe uma turma com esse nome");
            }
            turma.setNome(request.nome());
        }
        if (request.periodo() != null) {
            turma.setPeriodo(request.periodo());
        }
        if (request.professoresIds() != null) {
            vincularProfessores(turma, request.professoresIds());
        }
        if (request.jogosIds() != null) {
            turma.setJogos(resolverJogos(request.jogosIds()));
        }

        return toResponse(buscar(turma.getId()));
    }

    @Transactional
    public void vincularAlunos(Long turmaId, List<Long> alunosIds) {
        Turma turma = buscar(turmaId);
        List<Long> ids = alunosIds == null ? new ArrayList<>() : alunosIds;

        List<Aluno> alunosAtuais = alunoRepository.findByTurmaId(turmaId);
        alunosAtuais.forEach(aluno -> {
            if (!ids.contains(aluno.getId())) {
                aluno.setTurma(null);
                alunoRepository.save(aluno);
            }
        });

        ids.forEach(alunoId -> {
            Aluno aluno = alunoRepository.findById(alunoId)
                    .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + alunoId));
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

        professorRepository.desvincularTurmaLegada(id);

        if (turma.getProfessores() != null) {
            turma.getProfessores().clear();
            turmaRepository.save(turma);
        }

        turmaRepository.deleteById(id);
    }

    private Turma buscar(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada"));
    }

    private List<Professor> resolverProfessores(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return ids.stream()
                .distinct()
                .map(pid -> professorRepository.findById(pid)
                        .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado: " + pid)))
                .toList();
    }

    private void vincularProfessores(Turma turma, List<Long> professoresIds) {
        if (turma.getProfessores() == null) {
            turma.setProfessores(new ArrayList<>());
        }

        turma.getProfessores().clear();
        turma.getProfessores().addAll(resolverProfessores(professoresIds));
        turmaRepository.save(turma);
    }

    private List<Jogo> resolverJogos(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return ids.stream()
                .map(jid -> jogoRepository.findById(jid)
                        .orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado: " + jid)))
                .toList();
    }

    private TurmaResponse toResponse(Turma t) {
        List<Long> professoresIds = t.getProfessores() == null
                ? new ArrayList<>()
                : t.getProfessores().stream().map(Professor::getId).toList();
        List<String> nomesProfessores = t.getProfessores() == null
                ? new ArrayList<>()
                : t.getProfessores().stream().map(Professor::getNome).toList();
        List<String> nomesJogos = t.getJogos() == null
                ? new ArrayList<>()
                : t.getJogos().stream().map(Jogo::getNome).toList();
        int totalAlunos = t.getAlunos() == null ? 0 : t.getAlunos().size();
        return new TurmaResponse(t.getId(), t.getNome(), t.getPeriodo(), professoresIds, nomesProfessores, nomesJogos, totalAlunos);
    }
}
