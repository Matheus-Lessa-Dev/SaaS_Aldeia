package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.JogoRepository;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TurmaServiceTest {

    @Mock TurmaRepository turmaRepository;
    @Mock ProfessorRepository professorRepository;
    @Mock JogoRepository jogoRepository;
    @Mock AlunoRepository alunoRepository;
    @InjectMocks TurmaService turmaService;

    @Test
    void criar_savesClassWithTeachersAndGames() {
        Professor professor = professor(1L, "Maria");
        Jogo jogo = jogo(2L, "Memória");
        when(turmaRepository.existsByNome("5A")).thenReturn(false);
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(jogoRepository.findById(2L)).thenReturn(Optional.of(jogo));
        when(turmaRepository.save(any(Turma.class))).thenAnswer(invocation -> {
            Turma turma = invocation.getArgument(0);
            turma.setId(10L);
            return turma;
        });

        var response = turmaService.criar(new TurmaRequest("5A", "Manhã", List.of(1L), List.of(2L)));

        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.nome()).isEqualTo("5A");
        assertThat(response.nomesProfessores()).containsExactly("Maria");
        assertThat(response.nomesJogos()).containsExactly("Memória");
    }

    @Test
    void criar_duplicateName_throwsException() {
        when(turmaRepository.existsByNome("5A")).thenReturn(true);

        assertThatThrownBy(() -> turmaService.criar(new TurmaRequest("5A", "Manhã", null, null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Já existe uma turma com esse nome");
    }

    @Test
    void atualizar_keepsNameWhenSameAndUpdatesPeriod() {
        Turma turma = turma(10L, "5A", "Manhã");
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(turmaRepository.save(turma)).thenReturn(turma);

        var response = turmaService.atualizar(10L, new TurmaRequest("5A", "Tarde", null, null));

        assertThat(response.nome()).isEqualTo("5A");
        assertThat(response.periodo()).isEqualTo("Tarde");
        verify(turmaRepository, never()).existsByNome("5A");
    }

    @Test
    void atualizar_duplicateNewName_throwsException() {
        Turma turma = turma(10L, "5A", "Manhã");
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(turmaRepository.existsByNome("6A")).thenReturn(true);

        assertThatThrownBy(() -> turmaService.atualizar(10L, new TurmaRequest("6A", null, null, null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Já existe uma turma com esse nome");
    }

    @Test
    void vincularAlunos_setsClassForAllStudents() {
        Turma turma = turma(10L, "5A", "Manhã");
        Aluno aluno1 = aluno(1L);
        Aluno aluno2 = aluno(2L);
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(alunoRepository.findByTurmaId(10L)).thenReturn(List.of());
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno1));
        when(alunoRepository.findById(2L)).thenReturn(Optional.of(aluno2));

        turmaService.vincularAlunos(10L, List.of(1L, 2L));

        assertThat(aluno1.getTurma()).isEqualTo(turma);
        assertThat(aluno2.getTurma()).isEqualTo(turma);
        verify(alunoRepository).save(aluno1);
        verify(alunoRepository).save(aluno2);
    }

    @Test
    void vincularAlunos_missingStudent_throwsException() {
        Turma turma = turma(10L, "5A", "Manhã");
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(alunoRepository.findByTurmaId(10L)).thenReturn(List.of());
        when(alunoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> turmaService.vincularAlunos(10L, List.of(1L)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Aluno não encontrado: 1");
    }

    @Test
    void vincularAlunos_emptyListRemovesCurrentStudents() {
        Turma turma = turma(10L, "5A", "Manhã");
        Aluno aluno = aluno(1L);
        aluno.setTurma(turma);
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(alunoRepository.findByTurmaId(10L)).thenReturn(List.of(aluno));

        turmaService.vincularAlunos(10L, List.of());

        assertThat(aluno.getTurma()).isNull();
        verify(alunoRepository).save(aluno);
        verify(alunoRepository, never()).findById(any());
    }

    @Test
    void deletar_missingClass_throwsException() {
        when(turmaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> turmaService.deletar(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Turma não encontrada");
    }

    private static Turma turma(Long id, String nome, String periodo) {
        Turma turma = new Turma();
        turma.setId(id);
        turma.setNome(nome);
        turma.setPeriodo(periodo);
        return turma;
    }

    private static Professor professor(Long id, String nome) {
        Professor professor = new Professor();
        professor.setId(id);
        professor.setNome(nome);
        professor.setTipo(TipoUsuario.PROFESSOR);
        return professor;
    }

    private static Jogo jogo(Long id, String nome) {
        Jogo jogo = new Jogo();
        jogo.setId(id);
        jogo.setNome(nome);
        return jogo;
    }

    private static Aluno aluno(Long id) {
        Aluno aluno = new Aluno();
        aluno.setId(id);
        aluno.setTipo(TipoUsuario.ALUNO);
        return aluno;
    }
}
