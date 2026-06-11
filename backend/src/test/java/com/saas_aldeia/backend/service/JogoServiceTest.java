package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.model.Turma;
import com.saas_aldeia.backend.repository.AlunoRepository;
import com.saas_aldeia.backend.repository.JogoRepository;
import com.saas_aldeia.backend.repository.TurmaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JogoServiceTest {

    @Mock JogoRepository jogoRepository;
    @Mock TurmaRepository turmaRepository;
    @Mock AlunoRepository alunoRepository;
    @InjectMocks JogoService jogoService;

    @Test
    void criar_savesGameWithEmptyClasses() {
        when(jogoRepository.save(any(Jogo.class))).thenAnswer(invocation -> {
            Jogo jogo = invocation.getArgument(0);
            jogo.setId(1L);
            return jogo;
        });

        var response = jogoService.criar(new JogoRequest("Memória", "img.png", 10, "https://game.test", true, null));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Memória");
        assertThat(response.imgUrl()).isEqualTo("img.png");
        assertThat(response.tempo()).isEqualTo(10);
        assertThat(response.linkUrl()).isEqualTo("https://game.test");
        assertThat(response.habilitado()).isTrue();
    }

    @Test
    void criar_gameWithClasses_linksBothSides() {
        Turma turma = new Turma();
        turma.setId(10L);
        turma.setNome("5A");
        turma.setJogos(new ArrayList<>());
        when(turmaRepository.findById(10L)).thenReturn(Optional.of(turma));
        when(jogoRepository.save(any(Jogo.class))).thenAnswer(invocation -> {
            Jogo jogo = invocation.getArgument(0);
            jogo.setId(1L);
            return jogo;
        });

        var response = jogoService.criar(new JogoRequest("Memória", "img.png", 10, "https://game.test", true, List.of(10L)));

        assertThat(response.turmasIds()).containsExactly(10L);
        assertThat(response.nomesTurmas()).containsExactly("5A");
        assertThat(turma.getJogos()).singleElement().satisfies(jogo -> assertThat(jogo.getId()).isEqualTo(1L));
    }

    @Test
    void atualizar_updatesOnlyProvidedFields() {
        Jogo jogo = jogo(1L, "Antigo", "old.png", "5 min", "old");
        when(jogoRepository.findById(1L)).thenReturn(Optional.of(jogo));
        when(jogoRepository.save(jogo)).thenReturn(jogo);

        var response = jogoService.atualizar(1L, new JogoRequest("Novo", null, 12, null, null, null));

        assertThat(response.nome()).isEqualTo("Novo");
        assertThat(response.imgUrl()).isEqualTo("old.png");
        assertThat(response.tempo()).isEqualTo(12);
        assertThat(response.linkUrl()).isEqualTo("old");
    }

    @Test
    void deletar_missingGame_throwsException() {
        when(jogoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jogoService.deletar(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Jogo não encontrado");
    }

    @Test
    void listar_returnsMappedGames() {
        when(jogoRepository.findAll()).thenReturn(List.of(jogo(1L, "Jogo", "img", "tempo", "link")));

        var result = jogoService.listar();

        assertThat(result).singleElement().satisfies(response -> {
            assertThat(response.id()).isEqualTo(1L);
            assertThat(response.nome()).isEqualTo("Jogo");
        });
    }

    @Test
    void deletar_existingGame_deletesEntity() {
        Jogo jogo = jogo(1L, "Jogo", "img", "tempo", "link");
        when(jogoRepository.findById(1L)).thenReturn(Optional.of(jogo));

        jogoService.deletar(1L);

        verify(jogoRepository).delete(jogo);
    }

    @Test
    void deletar_gameWithClasses_clearsRelationshipsBeforeDelete() {
        Jogo jogo = jogo(1L, "Jogo", "img", "tempo", "link");
        Turma turma = new Turma();
        turma.setJogos(new ArrayList<>(List.of(jogo)));
        jogo.setTurmas(new ArrayList<>(List.of(turma)));
        when(jogoRepository.findById(1L)).thenReturn(Optional.of(jogo));

        jogoService.deletar(1L);

        assertThat(jogo.getTurmas()).isEmpty();
        assertThat(turma.getJogos()).doesNotContain(jogo);
        verify(jogoRepository).delete(jogo);
    }

    @Test
    void listarPorTurmaDoAluno_returnsOnlyEnabledClassGames() {
        Turma turma = new Turma();
        Jogo habilitado = jogo(1L, "Ativo", "img", "10", "link");
        habilitado.setHabilitado(true);
        Jogo desabilitado = jogo(2L, "Inativo", "img", "10", "link");
        desabilitado.setHabilitado(false);
        turma.setJogos(List.of(habilitado, desabilitado));
        Aluno aluno = new Aluno();
        aluno.setId(5L);
        aluno.setTurma(turma);
        when(alunoRepository.findById(5L)).thenReturn(Optional.of(aluno));

        var result = jogoService.listarPorTurmaDoAluno(5L);

        assertThat(result).singleElement().satisfies(jogo -> assertThat(jogo.nome()).isEqualTo("Ativo"));
    }

    private static Jogo jogo(Long id, String nome, String imgUrl, String tempo, String linkUrl) {
        Jogo jogo = new Jogo();
        jogo.setId(id);
        jogo.setNome(nome);
        jogo.setImgUrl(imgUrl);
        jogo.setTempo(tempo);
        jogo.setLinkUrl(linkUrl);
        return jogo;
    }
}
