package com.saas_aldeia.backend.security;

import com.saas_aldeia.backend.model.Admin;
import com.saas_aldeia.backend.model.TipoUsuario;
import com.saas_aldeia.backend.service.JwtService;
import com.saas_aldeia.backend.service.UserDetailsServiceImpl;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {

    @Mock JwtService jwtService;
    @Mock UserDetailsServiceImpl userDetailsService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilter_withoutBearerToken_doesNotAuthenticate() throws ServletException, IOException {
        JwtAuthFilter filter = new JwtAuthFilter(jwtService, userDetailsService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtService, never()).extractUsername("token");
    }

    @Test
    void doFilter_withValidToken_authenticatesUser() throws ServletException, IOException {
        JwtAuthFilter filter = new JwtAuthFilter(jwtService, userDetailsService);
        Admin admin = admin();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        when(jwtService.extractUsername("token")).thenReturn("admin@test.com");
        when(userDetailsService.loadUserByUsername("admin@test.com")).thenReturn(admin);
        when(jwtService.isValid("token", admin)).thenReturn(true);

        filter.doFilter(request, response, new MockFilterChain());

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getName()).isEqualTo("admin@test.com");
        assertThat(authentication.getAuthorities()).extracting("authority").containsExactly("ROLE_ADMIN");
    }

    @Test
    void doFilter_withInvalidToken_keepsRequestUnauthenticated() throws ServletException, IOException {
        JwtAuthFilter filter = new JwtAuthFilter(jwtService, userDetailsService);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer invalid");
        MockHttpServletResponse response = new MockHttpServletResponse();
        when(jwtService.extractUsername("invalid")).thenThrow(new IllegalArgumentException("invalid"));

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    private static Admin admin() {
        Admin admin = new Admin();
        admin.setEmail("admin@test.com");
        admin.setSenha("hash");
        admin.setTipo(TipoUsuario.ADMIN);
        admin.setNome("Admin");
        return admin;
    }
}
