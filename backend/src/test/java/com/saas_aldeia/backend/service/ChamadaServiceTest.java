package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.ChamadaRequest;
import com.saas_aldeia.backend.dto.PresencaAlunoRequest;
import com.saas_aldeia.backend.dto.RegistroChamadaRequest;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Chamada;
import com.saas_aldeia.backend.model.PresencaAluno;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.RegistroChamada;
import com.saas_aldeia.backend.model.StatusChamada;
import com.saas_aldeia.backend.model.StatusPresenca;
import com.saas_aldeia.backend.model.TipoPeriodoChamada;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.model.Usuario;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.ChamadaRepository;
import com.saas_aldeia.backend.repository.PresencaAlunoRepository;
import com.saas_aldeia.backend.repository.RegistroChamadaRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChamadaServiceTest {

    @Mock ChamadaRepository chamadaRepository;
    @Mock TurmaRepository turmaRepository;
    @Mock AlunoRepository alunoRepository;
    @Mock RegistroChamadaRepository registroRepository;
    @Mock PresencaAlunoRepository presencaRepository;
    @InjectMocks ChamadaService chamadaService;

    @Test
    void criar_adminCreatesActiveCallForClass() {
        Turma turma = turma(10L, "5A");
        Usuario admin = usuario(1L, TipoUsuario.ADMIN);
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(chamadaRepository.save(any(Chamada.class))).thenAnswer(invocation -> {
            Chamada chamada = invocation.getArgument(0);
            chamada.setId(20L);
            return chamada;
        });

        var response = chamadaService.criar(
                new ChamadaRequest("Chamada 1", 10L, TipoPeriodoChamada.BIMESTRE, 1),
                admin
        );

        assertThat(response.id()).isEqualTo(20L);
        assertThat(response.nome()).isEqualTo("Chamada 1");
        assertThat(response.turmaId()).isEqualTo(10L);
        assertThat(response.status()).isEqualTo(StatusChamada.ATIVA);
    }

    @Test
    void criar_teacherOutsideClass_isDenied() {
        Turma turma = turma(10L, "5A");
        turma.setProfessores(new ArrayList<>());
        Usuario professor = usuario(2L, TipoUsuario.PROFESSOR);
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));

        assertThatThrownBy(() -> chamadaService.criar(
                new ChamadaRequest("Chamada 1", 10L, TipoPeriodoChamada.BIMESTRE, 1),
                professor
        )).isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("Professor não vinculado à turma");
    }

    @Test
    void listar_professorReturnsOnlyTheirClassCalls() {
        Usuario professor = usuario(2L, TipoUsuario.PROFESSOR);
        Chamada chamada = chamada(30L, turma(10L, "5A"), StatusChamada.ATIVA);
        when(chamadaRepository.findByTurmaProfessoresId(2L)).thenReturn(List.of(chamada));

        var result = chamadaService.listar(professor);

        assertThat(result).singleElement().satisfies(item -> {
            assertThat(item.id()).isEqualTo(30L);
            assertThat(item.nomeTurma()).isEqualTo("5A");
        });
    }

    @Test
    void buscarRegistro_withoutSavedRecord_returnsStudentsSortedAlphabeticallyAsPresent() {
        Turma turma = turma(10L, "5A");
        Chamada chamada = chamada(30L, turma, StatusChamada.ATIVA);
        Usuario admin = usuario(1L, TipoUsuario.ADMIN);
        LocalDate data = LocalDate.of(2026, 6, 17);
        when(chamadaRepository.findById(30L)).thenReturn(Optional.of(chamada));
        when(registroRepository.findByChamadaIdAndData(30L, data)).thenReturn(Optional.empty());
        when(alunoRepository.findByTurmaId(10L)).thenReturn(List.of(
                aluno(2L, "Bruno", turma),
                aluno(1L, "Ana", turma)
        ));

        var result = chamadaService.buscarRegistro(30L, data, admin);

        assertThat(result.id()).isNull();
        assertThat(result.presencas()).extracting("nomeAluno").containsExactly("Ana", "Bruno");
        assertThat(result.presencas()).extracting("status").containsOnly(StatusPresenca.PRESENTE);
    }

    @Test
    void salvarRegistro_createsRecordAndSavesAttendance() {
        Turma turma = turma(10L, "5A");
        Chamada chamada = chamada(30L, turma, StatusChamada.ATIVA);
        Usuario admin = usuario(1L, TipoUsuario.ADMIN);
        Aluno aluno = aluno(7L, "Ana", turma);
        LocalDate data = LocalDate.of(2026, 6, 17);
        RegistroChamada registro = new RegistroChamada();
        registro.setId(40L);
        registro.setChamada(chamada);
        registro.setData(data);

        when(chamadaRepository.findById(30L)).thenReturn(Optional.of(chamada));
        when(registroRepository.findByChamadaIdAndData(30L, data)).thenReturn(Optional.empty());
        when(registroRepository.save(any(RegistroChamada.class))).thenReturn(registro);
        when(presencaRepository.findByRegistroId(40L)).thenReturn(List.of());
        when(alunoRepository.findById(7L)).thenReturn(Optional.of(aluno));

        var result = chamadaService.salvarRegistro(
                30L,
                new RegistroChamadaRequest(data, List.of(new PresencaAlunoRequest(7L, StatusPresenca.FALTA, "Ausente"))),
                admin
        );

        assertThat(result.id()).isEqualTo(40L);
        verify(presencaRepository).save(any(PresencaAluno.class));
    }

    @Test
    void salvarRegistro_closedCall_throwsException() {
        Chamada chamada = chamada(30L, turma(10L, "5A"), StatusChamada.ENCERRADA);
        Usuario admin = usuario(1L, TipoUsuario.ADMIN);
        when(chamadaRepository.findById(30L)).thenReturn(Optional.of(chamada));

        assertThatThrownBy(() -> chamadaService.salvarRegistro(
                30L,
                new RegistroChamadaRequest(LocalDate.now(), List.of(new PresencaAlunoRequest(7L, StatusPresenca.PRESENTE, ""))),
                admin
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Chamada encerrada não permite lançamentos");
    }

    @Test
    void salvarRegistro_studentOutsideClass_throwsException() {
        Turma turmaChamada = turma(10L, "5A");
        Turma outraTurma = turma(11L, "6A");
        Chamada chamada = chamada(30L, turmaChamada, StatusChamada.ATIVA);
        Usuario admin = usuario(1L, TipoUsuario.ADMIN);
        Aluno aluno = aluno(7L, "Ana", outraTurma);
        LocalDate data = LocalDate.of(2026, 6, 17);
        RegistroChamada registro = new RegistroChamada();
        registro.setId(40L);
        registro.setChamada(chamada);
        registro.setData(data);

        when(chamadaRepository.findById(30L)).thenReturn(Optional.of(chamada));
        when(registroRepository.findByChamadaIdAndData(30L, data)).thenReturn(Optional.of(registro));
        when(presencaRepository.findByRegistroId(40L)).thenReturn(List.of());
        when(alunoRepository.findById(7L)).thenReturn(Optional.of(aluno));

        assertThatThrownBy(() -> chamadaService.salvarRegistro(
                30L,
                new RegistroChamadaRequest(data, List.of(new PresencaAlunoRequest(7L, StatusPresenca.PRESENTE, ""))),
                admin
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Aluno não pertence à turma da chamada");
    }

    @Test
    void buscarPorId_missingCall_throwsException() {
        when(chamadaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> chamadaService.buscarPorId(99L, usuario(1L, TipoUsuario.ADMIN)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Chamada não encontrada");
    }

    private static Chamada chamada(Long id, Turma turma, StatusChamada status) {
        Chamada chamada = new Chamada();
        chamada.setId(id);
        chamada.setNome("Chamada");
        chamada.setTurma(turma);
        chamada.setTipoPeriodo(TipoPeriodoChamada.BIMESTRE);
        chamada.setNumeroPeriodo(1);
        chamada.setStatus(status);
        return chamada;
    }

    private static Turma turma(Long id, String nome) {
        Turma turma = new Turma();
        turma.setId(id);
        turma.setNome(nome);
        turma.setProfessores(new ArrayList<>());
        return turma;
    }

    private static Aluno aluno(Long id, String nome, Turma turma) {
        Aluno aluno = new Aluno();
        aluno.setId(id);
        aluno.setNome(nome);
        aluno.setTurma(turma);
        return aluno;
    }

    private static Usuario usuario(Long id, TipoUsuario tipo) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setTipo(tipo);
        return usuario;
    }
}

