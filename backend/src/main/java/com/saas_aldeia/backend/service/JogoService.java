package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.dto.JogoResponse;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.JogoRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class JogoService {

    private final JogoRepository jogoRepository;
    private final TurmaRepository turmaRepository;
    private final AlunoRepository alunoRepository;

    @Transactional(readOnly = true)
    public List<JogoResponse> listar() {
        return jogoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public JogoResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional(readOnly = true)
    public List<JogoResponse> listarPorTurmaDoAluno(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));

        if (aluno.getTurma() == null || aluno.getTurma().getJogos() == null) {
            return new ArrayList<>();
        }

        return aluno.getTurma().getJogos().stream()
                .filter(Jogo::isHabilitado)
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JogoResponse criar(JogoRequest request) {
        Jogo jogo = new Jogo();
        jogo.setNome(trimToNull(request.nome()));
        jogo.setImgUrl(trimToNull(request.imgUrl()));
        jogo.setTempo(toTempoStorage(request.tempo()));
        jogo.setLinkUrl(trimToNull(request.linkUrl()));
        jogo.setHabilitado(request.habilitado() == null || request.habilitado());
        jogo.setTurmas(new ArrayList<>());
        Jogo jogoSalvo = jogoRepository.save(jogo);
        vincularTurmas(jogoSalvo, request.turmasIds());
        return toResponse(jogoSalvo);
    }

    @Transactional
    public JogoResponse atualizar(Long id, JogoRequest request) {
        Jogo jogo = buscar(id);

        if (request.nome() != null)    jogo.setNome(trimToNull(request.nome()));
        if (request.imgUrl() != null)  jogo.setImgUrl(trimToNull(request.imgUrl()));
        if (request.tempo() != null)   jogo.setTempo(toTempoStorage(request.tempo()));
        if (request.linkUrl() != null) jogo.setLinkUrl(trimToNull(request.linkUrl()));
        if (request.habilitado() != null) jogo.setHabilitado(request.habilitado());
        if (request.turmasIds() != null) vincularTurmas(jogo, request.turmasIds());

        return toResponse(jogoRepository.save(jogo));
    }

    @Transactional
    public void deletar(Long id) {
        Jogo jogo = buscar(id);

        if (jogo.getTurmas() != null) {
            jogo.getTurmas().forEach(turma -> {
                if (turma.getJogos() != null) {
                    turma.getJogos().removeIf(turmaJogo -> Objects.equals(turmaJogo.getId(), jogo.getId()));
                }
            });
            jogo.getTurmas().clear();
        }

        jogoRepository.delete(jogo);
    }

    private Jogo buscar(Long id) {
        return jogoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogo não encontrado"));
    }

    private JogoResponse toResponse(Jogo j) {
        List<Turma> turmas = j.getTurmas() == null ? new ArrayList<>() : j.getTurmas();
        List<Long> turmasIds = turmas.stream().map(Turma::getId).filter(Objects::nonNull).toList();
        List<String> nomesTurmas = turmas.stream().map(Turma::getNome).filter(Objects::nonNull).toList();

        return new JogoResponse(
                j.getId(),
                j.getNome(),
                j.getImgUrl(),
                toTempoResponse(j.getTempo()),
                j.getLinkUrl(),
                j.isHabilitado(),
                turmasIds,
                nomesTurmas
        );
    }

    private void vincularTurmas(Jogo jogo, List<Long> turmasIds) {
        if (jogo.getTurmas() == null) {
            jogo.setTurmas(new ArrayList<>());
        }

        jogo.getTurmas().forEach(turma -> {
            if (turma.getJogos() != null) {
                turma.getJogos().removeIf(turmaJogo -> Objects.equals(turmaJogo.getId(), jogo.getId()));
            }
        });
        jogo.getTurmas().clear();

        if (turmasIds == null || turmasIds.isEmpty()) return;

        turmasIds.stream().distinct().forEach(turmaId -> {
            Turma turma = turmaRepository.findById(turmaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada: " + turmaId));

            if (turma.getJogos() == null) {
                turma.setJogos(new ArrayList<>());
            }

            boolean jaVinculado = turma.getJogos().stream()
                    .anyMatch(turmaJogo -> Objects.equals(turmaJogo.getId(), jogo.getId()));
            if (!jaVinculado) {
                turma.getJogos().add(jogo);
            }
            jogo.getTurmas().add(turma);
        });
    }

    private String toTempoStorage(Integer tempo) {
        return tempo == null ? null : String.valueOf(tempo);
    }

    private String trimToNull(String value) {
        if (value == null) return null;

        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private Integer toTempoResponse(String tempo) {
        if (tempo == null || tempo.isBlank()) return null;

        String digits = tempo.trim().replaceAll("[^0-9]", "");
        if (digits.isBlank()) return null;

        return Integer.valueOf(digits);
    }
}
