package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.RegistroChamada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroChamadaRepository extends JpaRepository<RegistroChamada, Long> {
    Optional<RegistroChamada> findByChamadaIdAndData(Long chamadaId, LocalDate data);
    List<RegistroChamada> findByChamadaId(Long chamadaId);
    long countByChamadaId(Long chamadaId);
}
