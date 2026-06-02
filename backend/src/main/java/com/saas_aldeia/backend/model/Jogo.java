package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "jogo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 45)
    private String nome;

    @Column(name = "img_url", length = 1000)
    private String imgUrl;

    @Column(length = 45)
    private String tempo;

    @Column(name = "link_url", length = 1000)
    private String linkUrl;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean habilitado = true;

    @ManyToMany(mappedBy = "jogos")
    private List<Turma> turmas;
}
