package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.model.Aluno;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock UsuarioRepository usuarioRepository;
    @InjectMocks UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsername_returnsUserDetails() {
        Aluno aluno = new Aluno();
        aluno.setEmail("aluno@test.com");
        aluno.setSenha("hash");
        aluno.setTipo(TipoUsuario.ALUNO);
        when(usuarioRepository.findByEmail("aluno@test.com")).thenReturn(Optional.of(aluno));

        var result = userDetailsService.loadUserByUsername("aluno@test.com");

        assertThat(result.getUsername()).isEqualTo("aluno@test.com");
        assertThat(result.getAuthorities()).extracting("authority").containsExactly("ROLE_ALUNO");
    }

    @Test
    void loadUserByUsername_missingUser_throwsException() {
        when(usuarioRepository.findByEmail("x@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userDetailsService.loadUserByUsername("x@test.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado: x@test.com");
    }
}
