package com.saas_aldeia.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "usuario_id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends Usuario {

    @Column(nullable = false, length = 45)
    private String nome;
}