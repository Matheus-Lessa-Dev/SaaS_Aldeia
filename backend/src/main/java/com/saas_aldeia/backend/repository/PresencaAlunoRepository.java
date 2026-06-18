package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.PresencaAluno;
import com.saas_aldeia.backend.model.StatusPresenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresencaAlunoRepository extends JpaRepository<PresencaAluno, Long> {
    List<PresencaAluno> findByRegistroId(Long registroId);
    long countByRegistroChamadaIdAndStatus(Long chamadaId, StatusPresenca status);

    @Query("""
            select p from PresencaAluno p
            join fetch p.registro r
            join fetch r.chamada c
            where p.aluno.id = :alunoId
            order by r.data desc, c.nome asc
            """)
    List<PresencaAluno> findFrequenciaByAlunoId(@Param("alunoId") Long alunoId);
}
