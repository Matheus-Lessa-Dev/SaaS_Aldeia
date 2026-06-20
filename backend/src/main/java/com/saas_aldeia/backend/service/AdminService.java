package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.AdminRequest;
import com.saas_aldeia.backend.dto.AdminResponse;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.repository.AdminRepository;
import com.saas_aldeia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminResponse> listar() {
        return adminRepository.findAll().stream().map(this::toResponse).toList();
    }

    public AdminResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional
    public AdminResponse atualizar(Long id, AdminRequest request) {
        Admin admin = buscar(id);

        if (request.nome() != null)  admin.setNome(request.nome());
        if (request.email() != null) {
            String email = request.email().trim();
            if (usuarioRepository.existsByEmailAndIdNot(email, admin.getId())) {
                throw new IllegalArgumentException("Email ja cadastrado");
            }
            admin.setEmail(email);
        }
        if (request.senha() != null && !request.senha().isBlank())
            admin.setSenha(passwordEncoder.encode(request.senha()));

        return toResponse(adminRepository.save(admin));
    }

    @Transactional
    public void deletar(Long id) {
        if (!adminRepository.existsById(id))
            throw new ResourceNotFoundException("Admin não encontrado");
        adminRepository.deleteById(id);
    }

    private Admin buscar(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin não encontrado"));
    }

    private AdminResponse toResponse(Admin a) {
        return new AdminResponse(a.getId(), a.getNome(), a.getEmail());
    }
}
