package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "aluno")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Aluno extends Usuario {

    @Column(nullable = false, length = 45)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 45)
    private String rua;

    @Column(length = 45)
    private String complemento;

    @Column(name = "nome_responsavel", length = 45)
    private String nomeResponsavel;

    @Column(name = "telefone_responsavel", length = 20)
    private String telefoneResponsavel;

    @Column(name = "email_responsavel", length = 45)
    private String emailResponsavel;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;
}