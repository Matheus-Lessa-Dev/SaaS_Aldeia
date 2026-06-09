package com.saas_aldeia.backend.controller;

import com.saas_aldeia.backend.dto.TrocaSenhaRequest;
import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PerfilControllerTest {

    @Mock
    UsuarioRepository usuarioRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    PerfilController controller;

    @Test
    void trocarSenha_withCurrentPassword_updatesPasswordAndFirstAccess() {
        Aluno usuario = usuario();
        when(passwordEncoder.matches("atual", "oldHash")).thenReturn(true);
        when(passwordEncoder.encode("novaSenha")).thenReturn("newHash");

        var response = controller.trocarSenha(usuario, new TrocaSenhaRequest("atual", "novaSenha"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(usuario.getSenha()).isEqualTo("newHash");
        assertThat(usuario.isPrimeiroAcesso()).isFalse();
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void trocarSenha_withWrongCurrentPassword_throwsException() {
        Aluno usuario = usuario();
        when(passwordEncoder.matches("errada", "oldHash")).thenReturn(false);

        assertThatThrownBy(() -> controller.trocarSenha(usuario, new TrocaSenhaRequest("errada", "novaSenha")))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Senha atual incorreta");
    }

    private static Aluno usuario() {
        Aluno aluno = new Aluno();
        aluno.setEmail("aluno@test.com");
        aluno.setSenha("oldHash");
        aluno.setTipo(TipoUsuario.ALUNO);
        aluno.setPrimeiroAcesso(true);
        return aluno;
    }
}
