package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "presenca_aluno",
        uniqueConstraints = @UniqueConstraint(columnNames = {"registro_id", "aluno_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PresencaAluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "registro_id")
    private RegistroChamada registro;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusPresenca status;

    @Column(length = 255)
    private String observacao;
}
