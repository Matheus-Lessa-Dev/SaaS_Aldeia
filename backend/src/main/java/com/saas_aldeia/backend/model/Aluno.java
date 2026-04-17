package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "aluno")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 45)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(nullable = false, length = 75, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

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