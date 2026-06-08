package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.repository.JogoRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JogoServiceTest {

    @Mock JogoRepository jogoRepository;
    @InjectMocks JogoService jogoService;

    @Test
    void criar_savesGameWithEmptyClasses() {
        when(jogoRepository.save(any(Jogo.class))).thenAnswer(invocation -> {
            Jogo jogo = invocation.getArgument(0);
            jogo.setId(1L);
            return jogo;
        });

        var response = jogoService.criar(new JogoRequest("Memória", "img.png", "10 min", "https://game.test"));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nome()).isEqualTo("Memória");
        assertThat(response.imgUrl()).isEqualTo("img.png");
        assertThat(response.tempo()).isEqualTo("10 min");
        assertThat(response.linkUrl()).isEqualTo("https://game.test");
    }

    @Test
    void atualizar_updatesOnlyProvidedFields() {
        Jogo jogo = jogo(1L, "Antigo", "old.png", "5 min", "old");
        when(jogoRepository.findById(1L)).thenReturn(Optional.of(jogo));
        when(jogoRepository.save(jogo)).thenReturn(jogo);

        var response = jogoService.atualizar(1L, new JogoRequest("Novo", null, "12 min", null));

        assertThat(response.nome()).isEqualTo("Novo");
        assertThat(response.imgUrl()).isEqualTo("old.png");
        assertThat(response.tempo()).isEqualTo("12 min");
        assertThat(response.linkUrl()).isEqualTo("old");
    }

    @Test
    void deletar_missingGame_throwsException() {
        when(jogoRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> jogoService.deletar(99L))
                .isInstanceOf(IllegalArgumentException.class)
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
    void deletar_existingGame_deletesById() {
        when(jogoRepository.existsById(1L)).thenReturn(true);

        jogoService.deletar(1L);

        verify(jogoRepository).deleteById(1L);
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
