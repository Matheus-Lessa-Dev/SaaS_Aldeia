package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "professor")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Professor extends Usuario {

    @Column(nullable = false, length = 45)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 45)
    private String rua;

    @Column(length = 45)
    private String complemento;

    @Column(length = 20)
    private String telefone;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;
}
