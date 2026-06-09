package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    Optional<Professor> findByEmail(String email);

    boolean existsByEmail(String email);

    @Modifying
    @Query(value = "UPDATE professor SET turma_id = NULL WHERE turma_id = :turmaId", nativeQuery = true)
    void desvincularTurmaLegada(@Param("turmaId") Long turmaId);
}
