package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "registro_chamada",
        uniqueConstraints = @UniqueConstraint(columnNames = {"chamada_id", "data"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistroChamada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "chamada_id")
    private Chamada chamada;

    @Column(nullable = false)
    private LocalDate data;

    @ManyToOne
    @JoinColumn(name = "criada_por_id")
    private Usuario criadaPor;
}
