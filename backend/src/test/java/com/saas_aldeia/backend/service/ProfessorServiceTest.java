package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.ProfessorRequest;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Professor;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.repository.ProfessorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfessorServiceTest {

    @Mock ProfessorRepository professorRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks ProfessorService professorService;

    @Test
    void buscarPorId_returnsMappedProfessor() {
        Professor professor = professor(1L, "Maria", "maria@test.com", "hash");
        professor.setDataNascimento(LocalDate.of(1990, 5, 20));
        professor.setRua("Rua A");
        professor.setComplemento("Apto 1");
        professor.setTelefone("44999999999");
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));

        var response = professorService.buscarPorId(1L);

        assertThat(response.nome()).isEqualTo("Maria");
        assertThat(response.email()).isEqualTo("maria@test.com");
        assertThat(response.telefone()).isEqualTo("44999999999");
    }

    @Test
    void atualizar_updatesPasswordWhenProvided() {
        Professor professor = professor(1L, "Antiga", "old@test.com", "oldHash");
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(passwordEncoder.encode("novaSenha")).thenReturn("newHash");
        when(professorRepository.save(professor)).thenReturn(professor);

        var response = professorService.atualizar(1L, new ProfessorRequest(
                "Nova", LocalDate.of(1991, 1, 1), "new@test.com", "novaSenha", "Rua B", "Casa", "4400000000"
        ));

        assertThat(response.nome()).isEqualTo("Nova");
        assertThat(response.email()).isEqualTo("new@test.com");
        assertThat(professor.getSenha()).isEqualTo("newHash");
    }

    @Test
    void deletar_existingProfessor_deletesEntity() {
        Professor professor = professor(1L, "Maria", "maria@test.com", "hash");
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));

        professorService.deletar(1L);

        verify(professorRepository).delete(professor);
    }

    @Test
    void deletar_professorWithClasses_clearsRelationshipsBeforeDelete() {
        Professor professor = professor(1L, "Maria", "maria@test.com", "hash");
        Turma turma = new Turma();
        turma.setProfessores(new ArrayList<>(List.of(professor)));
        professor.setTurmas(new ArrayList<>(List.of(turma)));
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));

        professorService.deletar(1L);

        assertThat(professor.getTurmas()).isEmpty();
        assertThat(turma.getProfessores()).doesNotContain(professor);
        verify(professorRepository).delete(professor);
    }

    @Test
    void atualizar_missingProfessor_throwsException() {
        when(professorRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> professorService.atualizar(99L, new ProfessorRequest(null, null, null, null, null, null, null)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Professor não encontrado");
    }

    private static Professor professor(Long id, String nome, String email, String senha) {
        Professor professor = new Professor();
        professor.setId(id);
        professor.setNome(nome);
        professor.setEmail(email);
        professor.setSenha(senha);
        professor.setTipo(TipoUsuario.PROFESSOR);
        return professor;
    }
}
