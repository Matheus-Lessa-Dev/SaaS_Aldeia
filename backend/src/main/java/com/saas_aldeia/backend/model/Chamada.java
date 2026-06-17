package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chamada")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chamada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoPeriodoChamada tipoPeriodo;

    @Column(nullable = false)
    private Integer numeroPeriodo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusChamada status = StatusChamada.ATIVA;

    @ManyToOne(optional = false)
    @JoinColumn(name = "turma_id")
    private Turma turma;

    @ManyToOne
    @JoinColumn(name = "criada_por_id")
    private Usuario criadaPor;
}
