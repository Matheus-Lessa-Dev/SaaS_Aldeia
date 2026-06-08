package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AdminRequest;
import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.repository.AdminRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock AdminRepository adminRepository;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AdminService adminService;

    @Test
    void listar_returnsMappedAdmins() {
        Admin admin = admin(1L, "Admin", "admin@test.com", "hash");
        when(adminRepository.findAll()).thenReturn(List.of(admin));

        var result = adminService.listar();

        assertThat(result).singleElement().satisfies(response -> {
            assertThat(response.id()).isEqualTo(1L);
            assertThat(response.nome()).isEqualTo("Admin");
            assertThat(response.email()).isEqualTo("admin@test.com");
        });
    }

    @Test
    void atualizar_updatesFieldsAndEncodesPassword() {
        Admin admin = admin(1L, "Antigo", "old@test.com", "oldHash");
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(passwordEncoder.encode("novaSenha")).thenReturn("newHash");
        when(adminRepository.save(admin)).thenReturn(admin);

        var response = adminService.atualizar(1L, new AdminRequest("Novo", "new@test.com", "novaSenha"));

        assertThat(response.nome()).isEqualTo("Novo");
        assertThat(response.email()).isEqualTo("new@test.com");
        assertThat(admin.getSenha()).isEqualTo("newHash");
    }

    @Test
    void atualizar_blankPassword_keepsCurrentPassword() {
        Admin admin = admin(1L, "Admin", "admin@test.com", "oldHash");
        when(adminRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(adminRepository.save(admin)).thenReturn(admin);

        adminService.atualizar(1L, new AdminRequest(null, null, " "));

        assertThat(admin.getSenha()).isEqualTo("oldHash");
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void deletar_existingAdmin_deletesById() {
        when(adminRepository.existsById(1L)).thenReturn(true);

        adminService.deletar(1L);

        verify(adminRepository).deleteById(1L);
    }

    @Test
    void buscarPorId_missingAdmin_throwsException() {
        when(adminRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminService.buscarPorId(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Admin não encontrado");
    }

    private static Admin admin(Long id, String nome, String email, String senha) {
        Admin admin = new Admin();
        admin.setId(id);
        admin.setNome(nome);
        admin.setEmail(email);
        admin.setSenha(senha);
        admin.setTipo(TipoUsuario.ADMIN);
        return admin;
    }
}
