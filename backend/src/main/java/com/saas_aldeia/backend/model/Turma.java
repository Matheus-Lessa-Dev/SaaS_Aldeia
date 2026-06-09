package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "turma")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 45)
    private String nome;

    @Column(length = 45)
    private String periodo;

    @OneToMany(mappedBy = "turma")
    private List<Aluno> alunos;

    @ManyToMany
    @JoinTable(
            name = "professor_has_turma",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"turma_id", "professor_id"})
    )
    private List<Professor> professores = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "jogo_has_turma",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "jogo_id")
    )
    private List<Jogo> jogos;
}
