package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.*;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.*;
import com.saas_aldeia.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChamadaService {

    private final ChamadaRepository chamadaRepository;
    private final TurmaRepository turmaRepository;
    private final AlunoRepository alunoRepository;
    private final RegistroChamadaRepository registroRepository;
    private final PresencaAlunoRepository presencaRepository;

    @Transactional(readOnly = true)
    public List<ChamadaResponse> listar(Usuario usuarioLogado) {
        List<Chamada> chamadas = usuarioLogado.getTipo() == TipoUsuario.PROFESSOR
                ? chamadaRepository.findByTurmaProfessoresId(usuarioLogado.getId())
                : chamadaRepository.findAll();

        return chamadas.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public FrequenciaAlunoResponse buscarFrequenciaAluno(Usuario usuarioLogado) {
        if (usuarioLogado.getTipo() != TipoUsuario.ALUNO) {
            throw new AccessDeniedException("Apenas alunos podem acessar a propria frequencia");
        }

        List<PresencaAluno> presencas = presencaRepository.findFrequenciaByAlunoId(usuarioLogado.getId());
        long presentes = presencas.stream().filter(p -> p.getStatus() == StatusPresenca.PRESENTE).count();
        long faltas = presencas.stream().filter(p -> p.getStatus() == StatusPresenca.FALTA).count();
        long justificadas = presencas.stream().filter(p -> p.getStatus() == StatusPresenca.JUSTIFICADA).count();
        long total = presencas.size();
        int percentual = total == 0 ? 0 : Math.round((presentes * 100f) / total);

        List<FrequenciaAlunoItemResponse> registros = presencas.stream()
                .map(p -> new FrequenciaAlunoItemResponse(
                        p.getRegistro().getChamada().getId(),
                        p.getRegistro().getChamada().getNome(),
                        p.getRegistro().getData(),
                        p.getStatus(),
                        p.getObservacao()
                ))
                .toList();

        return new FrequenciaAlunoResponse(total, presentes, faltas, justificadas, percentual, registros);
    }

    @Transactional(readOnly = true)
    public ChamadaResponse buscarPorId(Long id, Usuario usuarioLogado) {
        Chamada chamada = buscarChamada(id);
        validarAcesso(chamada, usuarioLogado);
        return toResponse(chamada);
    }

    @Transactional
    public ChamadaResponse criar(ChamadaRequest request, Usuario usuarioLogado) {
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada"));

        if (usuarioLogado.getTipo() == TipoUsuario.PROFESSOR) {
            boolean professorDaTurma = turma.getProfessores() != null
                    && turma.getProfessores().stream().anyMatch(p -> p.getId().equals(usuarioLogado.getId()));
            if (!professorDaTurma) {
                throw new AccessDeniedException("Professor não vinculado à turma");
            }
        }

        Chamada chamada = new Chamada();
        chamada.setNome(request.nome());
        chamada.setTurma(turma);
        chamada.setTipoPeriodo(request.tipoPeriodo());
        chamada.setNumeroPeriodo(request.numeroPeriodo());
        chamada.setStatus(StatusChamada.ATIVA);
        chamada.setCriadaPor(usuarioLogado);

        return toResponse(chamadaRepository.save(chamada));
    }

    @Transactional
    public ChamadaResponse atualizarStatus(Long id, StatusChamada status, Usuario usuarioLogado) {
        Chamada chamada = buscarChamada(id);
        validarAcesso(chamada, usuarioLogado);
        chamada.setStatus(status);
        return toResponse(chamadaRepository.save(chamada));
    }

    @Transactional(readOnly = true)
    public RegistroChamadaResponse buscarRegistro(Long chamadaId, LocalDate data, Usuario usuarioLogado) {
        Chamada chamada = buscarChamada(chamadaId);
        validarAcesso(chamada, usuarioLogado);

        return registroRepository.findByChamadaIdAndData(chamadaId, data)
                .map(this::toRegistroResponse)
                .orElseGet(() -> registroVazio(chamada, data));
    }

    @Transactional
    public RegistroChamadaResponse salvarRegistro(Long chamadaId, RegistroChamadaRequest request, Usuario usuarioLogado) {
        Chamada chamada = buscarChamada(chamadaId);
        validarAcesso(chamada, usuarioLogado);

        if (chamada.getStatus() != StatusChamada.ATIVA) {
            throw new IllegalArgumentException("Chamada encerrada não permite lançamentos");
        }

        LocalDate data = request.data() == null ? LocalDate.now() : request.data();
        RegistroChamada registro = registroRepository.findByChamadaIdAndData(chamadaId, data)
                .orElseGet(() -> {
                    RegistroChamada novo = new RegistroChamada();
                    novo.setChamada(chamada);
                    novo.setData(data);
                    novo.setCriadaPor(usuarioLogado);
                    return registroRepository.save(novo);
                });

        Map<Long, PresencaAluno> presencasAtuais = presencaRepository.findByRegistroId(registro.getId()).stream()
                .collect(Collectors.toMap(p -> p.getAluno().getId(), p -> p));

        for (PresencaAlunoRequest item : request.presencas()) {
            Aluno aluno = alunoRepository.findById(item.alunoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado: " + item.alunoId()));
            if (aluno.getTurma() == null || !aluno.getTurma().getId().equals(chamada.getTurma().getId())) {
                throw new IllegalArgumentException("Aluno não pertence à turma da chamada");
            }

            PresencaAluno presenca = presencasAtuais.getOrDefault(item.alunoId(), new PresencaAluno());
            presenca.setRegistro(registro);
            presenca.setAluno(aluno);
            presenca.setStatus(item.status());
            presenca.setObservacao(item.observacao());
            presencaRepository.save(presenca);
        }

        return toRegistroResponse(registro);
    }

    private Chamada buscarChamada(Long id) {
        return chamadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chamada não encontrada"));
    }

    private void validarAcesso(Chamada chamada, Usuario usuarioLogado) {
        if (usuarioLogado.getTipo() != TipoUsuario.PROFESSOR) return;

        boolean professorDaTurma = chamada.getTurma().getProfessores() != null
                && chamada.getTurma().getProfessores().stream().anyMatch(p -> p.getId().equals(usuarioLogado.getId()));
        if (!professorDaTurma) {
            throw new AccessDeniedException("Professor não vinculado à turma");
        }
    }

    private ChamadaResponse toResponse(Chamada chamada) {
        long presentes = presencaRepository.countByRegistroChamadaIdAndStatus(chamada.getId(), StatusPresenca.PRESENTE);
        long faltas = presencaRepository.countByRegistroChamadaIdAndStatus(chamada.getId(), StatusPresenca.FALTA);
        long justificadas = presencaRepository.countByRegistroChamadaIdAndStatus(chamada.getId(), StatusPresenca.JUSTIFICADA);

        return new ChamadaResponse(
                chamada.getId(),
                chamada.getNome(),
                chamada.getTurma().getId(),
                chamada.getTurma().getNome(),
                chamada.getTipoPeriodo(),
                chamada.getNumeroPeriodo(),
                chamada.getStatus(),
                registroRepository.countByChamadaId(chamada.getId()),
                presentes,
                faltas,
                justificadas
        );
    }

    private RegistroChamadaResponse registroVazio(Chamada chamada, LocalDate data) {
        List<PresencaAlunoResponse> presencas = alunoRepository.findByTurmaId(chamada.getTurma().getId()).stream()
                .sorted(Comparator.comparing(Aluno::getNome, String.CASE_INSENSITIVE_ORDER))
                .map(aluno -> new PresencaAlunoResponse(aluno.getId(), aluno.getNome(), StatusPresenca.PRESENTE, ""))
                .toList();
        return new RegistroChamadaResponse(null, chamada.getId(), data, presencas);
    }

    private RegistroChamadaResponse toRegistroResponse(RegistroChamada registro) {
        List<PresencaAlunoResponse> presencas = presencaRepository.findByRegistroId(registro.getId()).stream()
                .sorted(Comparator.comparing(p -> p.getAluno().getNome(), String.CASE_INSENSITIVE_ORDER))
                .map(p -> new PresencaAlunoResponse(
                        p.getAluno().getId(),
                        p.getAluno().getNome(),
                        p.getStatus(),
                        p.getObservacao()
                ))
                .toList();
        return new RegistroChamadaResponse(registro.getId(), registro.getChamada().getId(), registro.getData(), presencas);
    }
}
