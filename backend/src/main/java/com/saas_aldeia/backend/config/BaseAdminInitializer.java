package com.saas_aldeia.backend.config;

import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.repository.AdminRepository;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BaseAdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base-admin.email:admin@base.com}")
    private String baseAdminEmail;

    @Value("${app.base-admin.password:Aldeia@2026Base!}")
    private String baseAdminPassword;

    @Value("${app.base-admin.name:Administrador Base}")
    private String baseAdminName;

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByEmail(baseAdminEmail)) {
            return;
        }

        Admin admin = new Admin();
        admin.setEmail(baseAdminEmail);
        admin.setSenha(passwordEncoder.encode(baseAdminPassword));
        admin.setTipo(TipoUsuario.ADMIN);
        admin.setNome(baseAdminName);
        admin.setPrimeiroAcesso(false);
        adminRepository.save(admin);
    }
}
