package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.AdminRequest;
import com.saas_aldeia.backend.dto.AdminResponse;
import com.saas_aldeia.backend.dto.AlunoRequest;
import com.saas_aldeia.backend.dto.AlunoResponse;
import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.dto.JogoResponse;
import com.saas_aldeia.backend.dto.ProfessorRequest;
import com.saas_aldeia.backend.dto.ProfessorResponse;
import com.saas_aldeia.backend.dto.TurmaAlunosRequest;
import com.saas_aldeia.backend.dto.TurmaRequest;
import com.saas_aldeia.backend.dto.TurmaResponse;
import com.saas_aldeia.backend.service.AdminService;
import com.saas_aldeia.backend.service.AlunoService;
import com.saas_aldeia.backend.service.JogoService;
import com.saas_aldeia.backend.service.ProfessorService;
import com.saas_aldeia.backend.service.TurmaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceControllersTest {

    @Mock AdminService adminService;
    @Mock AlunoService alunoService;
    @Mock ProfessorService professorService;
    @Mock JogoService jogoService;
    @Mock TurmaService turmaService;

    @Test
    void adminController_delegatesCrudEndpoints() {
        AdminController controller = new AdminController(adminService);
        var response = new AdminResponse(1L, "Admin", "admin@test.com");
        var request = new AdminRequest("Admin", "admin@test.com", "senha");
        when(adminService.listar()).thenReturn(List.of(response));
        when(adminService.buscarPorId(1L)).thenReturn(response);
        when(adminService.atualizar(1L, request)).thenReturn(response);

        assertThat(controller.listar().getBody()).containsExactly(response);
        assertThat(controller.buscar(1L).getBody()).isEqualTo(response);
        assertThat(controller.atualizar(1L, request).getBody()).isEqualTo(response);
        assertThat(controller.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(adminService).deletar(1L);
    }

    @Test
    void alunoController_delegatesCrudEndpoints() {
        AlunoController controller = new AlunoController(alunoService);
        var response = new AlunoResponse(1L, "João", "joao@test.com", LocalDate.of(2010, 3, 15), "Rua", "Casa", "Resp", "44", "resp@test.com", "5A");
        var request = new AlunoRequest("João", null, null, null, null, null, null, null, null, null);
        when(alunoService.listar()).thenReturn(List.of(response));
        when(alunoService.buscarPorId(1L)).thenReturn(response);
        when(alunoService.atualizar(1L, request)).thenReturn(response);

        assertThat(controller.listar(null).getBody()).containsExactly(response);
        assertThat(controller.buscar(1L).getBody()).isEqualTo(response);
        assertThat(controller.atualizar(1L, request).getBody()).isEqualTo(response);
        assertThat(controller.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(alunoService).deletar(1L);
    }

    @Test
    void professorController_delegatesCrudEndpoints() {
        ProfessorController controller = new ProfessorController(professorService);
        var response = new ProfessorResponse(1L, "Maria", "maria@test.com", LocalDate.of(1990, 5, 20), "Rua", "Apto", "44");
        var request = new ProfessorRequest("Maria", null, null, null, null, null, null);
        when(professorService.listar()).thenReturn(List.of(response));
        when(professorService.buscarPorId(1L)).thenReturn(response);
        when(professorService.atualizar(1L, request)).thenReturn(response);

        assertThat(controller.listar().getBody()).containsExactly(response);
        assertThat(controller.buscar(1L).getBody()).isEqualTo(response);
        assertThat(controller.atualizar(1L, request).getBody()).isEqualTo(response);
        assertThat(controller.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(professorService).deletar(1L);
    }

    @Test
    void jogoController_delegatesCrudEndpoints() {
        JogoController controller = new JogoController(jogoService);
        var response = new JogoResponse(1L, "Memória", "img", 10, "link", true);
        var request = new JogoRequest("Memória", "img", 10, "link", true);
        when(jogoService.listar()).thenReturn(List.of(response));
        when(jogoService.buscarPorId(1L)).thenReturn(response);
        when(jogoService.criar(request)).thenReturn(response);
        when(jogoService.atualizar(1L, request)).thenReturn(response);

        assertThat(controller.listar().getBody()).containsExactly(response);
        assertThat(controller.buscar(1L).getBody()).isEqualTo(response);
        assertThat(controller.criar(request).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(controller.atualizar(1L, request).getBody()).isEqualTo(response);
        assertThat(controller.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(jogoService).deletar(1L);
    }

    @Test
    void turmaController_delegatesCrudAndAssociationEndpoints() {
        TurmaController controller = new TurmaController(turmaService);
        var response = new TurmaResponse(1L, "5A", "Manhã", List.of("Maria"), List.of("Memória"), 0);
        var request = new TurmaRequest("5A", "Manhã", List.of(1L), List.of(2L));
        when(turmaService.listar()).thenReturn(List.of(response));
        when(turmaService.buscarPorId(1L)).thenReturn(response);
        when(turmaService.criar(request)).thenReturn(response);
        when(turmaService.atualizar(1L, request)).thenReturn(response);

        assertThat(controller.listar().getBody()).containsExactly(response);
        assertThat(controller.buscar(1L).getBody()).isEqualTo(response);
        assertThat(controller.criar(request).getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(controller.atualizar(1L, request).getBody()).isEqualTo(response);
        assertThat(controller.vincularTurma(1L, new TurmaAlunosRequest(List.of(10L))).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(controller.deletar(1L).getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(turmaService).vincularAlunos(1L, List.of(10L));
        verify(turmaService).deletar(1L);
    }
}
