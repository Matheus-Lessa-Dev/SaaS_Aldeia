package com.saas_aldeia.backend.config;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityConfigTest {

    @Test
    void sensitiveRoutesHaveExplicitRoleRestrictions() throws Exception {
        String source = Files.readString(Path.of(
                "src/main/java/com/saas_aldeia/backend/config/SecurityConfig.java"
        ));

        assertThat(source).contains(".requestMatchers(\"/admins/**\").hasRole(\"ADMIN\")");
        assertThat(source).contains(".requestMatchers(\"/alunos/me\").hasRole(\"ALUNO\")");
        assertThat(source).contains(".requestMatchers(\"/alunos/**\").hasAnyRole(\"ADMIN\", \"PROFESSOR\")");
        assertThat(source).contains(".requestMatchers(\"/professores/**\").hasAnyRole(\"ADMIN\", \"PROFESSOR\")");
        assertThat(source).contains(".requestMatchers(\"/turmas/**\").hasAnyRole(\"ADMIN\", \"PROFESSOR\")");
        assertThat(source).contains(".requestMatchers(\"/chamadas/minha-frequencia\").hasRole(\"ALUNO\")");
        assertThat(source).contains(".requestMatchers(\"/chamadas/**\").hasAnyRole(\"ADMIN\", \"PROFESSOR\")");
        assertThat(source).contains(".requestMatchers(\"/jogos/minha-turma\").hasRole(\"ALUNO\")");
        assertThat(source).contains(".requestMatchers(\"/jogos/**\").hasAnyRole(\"ADMIN\", \"PROFESSOR\")");
    }
}
