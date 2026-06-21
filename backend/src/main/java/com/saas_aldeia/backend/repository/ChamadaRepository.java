package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.Chamada;
import com.saas_aldeia.backend.model.StatusChamada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadaRepository extends JpaRepository<Chamada, Long> {
    List<Chamada> findByTurmaProfessoresId(Long professorId);
    boolean existsByTurmaIdAndStatus(Long turmaId, StatusChamada status);
    boolean existsByTurmaIdAndStatusAndIdNot(Long turmaId, StatusChamada status, Long id);
}
