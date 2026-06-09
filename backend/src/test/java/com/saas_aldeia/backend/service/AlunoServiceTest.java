package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AlunoRequest;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlunoServiceTest {

    @Mock AlunoRepository alunoRepository;
    @Mock TurmaRepository turmaRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AlunoService alunoService;

    @Test
    void listar_returnsMappedStudentsWithClassName() {
        Turma turma = turma(10L, "5A");
        Aluno aluno = aluno(1L, "João", "joao@test.com", "hash");
        aluno.setTurma(turma);
        when(alunoRepository.findAll()).thenReturn(List.of(aluno));

        var result = alunoService.listar();

        assertThat(result).singleElement().satisfies(response -> {
            assertThat(response.id()).isEqualTo(1L);
            assertThat(response.nome()).isEqualTo("João");
            assertThat(response.nomeTurma()).isEqualTo("5A");
        });
    }

    @Test
    void atualizar_updatesClassAndEncodedPassword() {
        Aluno aluno = aluno(1L, "Antigo", "old@test.com", "oldHash");
        Turma turma = turma(10L, "5A");
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(passwordEncoder.encode("novaSenha")).thenReturn("newHash");
        when(alunoRepository.save(aluno)).thenReturn(aluno);

        var response = alunoService.atualizar(1L, new AlunoRequest(
                "Novo",
                LocalDate.of(2010, 3, 15),
                "new@test.com",
                "novaSenha",
                "Rua A",
                "Casa",
                "Responsável",
                "44999999999",
                "resp@test.com",
                10L
        ));

        assertThat(response.nome()).isEqualTo("Novo");
        assertThat(response.email()).isEqualTo("new@test.com");
        assertThat(response.nomeTurma()).isEqualTo("5A");
        assertThat(aluno.getSenha()).isEqualTo("newHash");
    }

    @Test
    void atualizar_blankPasswordDoesNotEncode() {
        Aluno aluno = aluno(1L, "João", "joao@test.com", "oldHash");
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(alunoRepository.save(aluno)).thenReturn(aluno);

        alunoService.atualizar(1L, new AlunoRequest(null, null, null, " ", null, null, null, null, null, null));

        assertThat(aluno.getSenha()).isEqualTo("oldHash");
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void atualizar_missingClass_throwsException() {
        Aluno aluno = aluno(1L, "João", "joao@test.com", "hash");
        when(alunoRepository.findById(1L)).thenReturn(Optional.of(aluno));
        when(turmaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> alunoService.atualizar(1L, new AlunoRequest(null, null, null, null, null, null, null, null, null, 99L)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Turma não encontrada");
    }

    @Test
    void deletar_existingStudent_deletesById() {
        when(alunoRepository.existsById(1L)).thenReturn(true);

        alunoService.deletar(1L);

        verify(alunoRepository).deleteById(1L);
    }

    @Test
    void buscarPorId_missingStudent_throwsException() {
        when(alunoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> alunoService.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Aluno não encontrado");
    }

    private static Aluno aluno(Long id, String nome, String email, String senha) {
        Aluno aluno = new Aluno();
        aluno.setId(id);
        aluno.setNome(nome);
        aluno.setEmail(email);
        aluno.setSenha(senha);
        aluno.setTipo(TipoUsuario.ALUNO);
        return aluno;
    }

    private static Turma turma(Long id, String nome) {
        Turma turma = new Turma();
        turma.setId(id);
        turma.setNome(nome);
        return turma;
    }
}
