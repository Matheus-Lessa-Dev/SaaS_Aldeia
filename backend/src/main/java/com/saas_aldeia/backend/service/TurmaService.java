package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.dto.TurmaResponse;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.Turma;
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
    private final JogoRepository jogoRepository;

    public List<TurmaResponse> listar() {
        return turmaRepository.findAll().stream().map(this::toResponse).toList();
    }

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
        turma.setProfessores(resolverProfessores(request.professoresIds()));
        turma.setJogos(resolverJogos(request.jogosIds()));
        turma.setAlunos(new ArrayList<>());

        return toResponse(turmaRepository.save(turma));
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
            turma.setProfessores(resolverProfessores(request.professoresIds()));
        if (request.jogosIds() != null)
            turma.setJogos(resolverJogos(request.jogosIds()));

        return toResponse(turmaRepository.save(turma));
    }

    @Transactional
    public void deletar(Long id) {
        if (!turmaRepository.existsById(id))
            throw new IllegalArgumentException("Turma não encontrada");
        turmaRepository.deleteById(id);
    }

    private Turma buscar(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Turma não encontrada"));
    }

    private List<Professor> resolverProfessores(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return ids.stream()
                .map(pid -> professorRepository.findById(pid)
                        .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado: " + pid)))
                .toList();
    }

    private List<Jogo> resolverJogos(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        return ids.stream()
                .map(jid -> jogoRepository.findById(jid)
                        .orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado: " + jid)))
                .toList();
    }

    private TurmaResponse toResponse(Turma t) {
        List<String> nomesProfessores = t.getProfessores() == null
                ? new ArrayList<>()
                : t.getProfessores().stream().map(Professor::getNome).toList();
        List<String> nomesJogos = t.getJogos() == null
                ? new ArrayList<>()
                : t.getJogos().stream().map(Jogo::getNome).toList();
        return new TurmaResponse(t.getId(), t.getNome(), t.getPeriodo(), nomesProfessores, nomesJogos);
    }
}