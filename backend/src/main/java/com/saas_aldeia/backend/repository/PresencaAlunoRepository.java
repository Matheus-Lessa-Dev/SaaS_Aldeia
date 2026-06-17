package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.PresencaAluno;
import com.saas_aldeia.backend.model.StatusPresenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresencaAlunoRepository extends JpaRepository<PresencaAluno, Long> {
    List<PresencaAluno> findByRegistroId(Long registroId);
    long countByRegistroChamadaIdAndStatus(Long chamadaId, StatusPresenca status);
}
