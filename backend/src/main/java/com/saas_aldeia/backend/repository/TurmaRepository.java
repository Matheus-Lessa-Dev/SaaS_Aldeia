package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    List<Turma> findByPeriodo(String periodo);

    boolean existsByNome(String nome);
}
