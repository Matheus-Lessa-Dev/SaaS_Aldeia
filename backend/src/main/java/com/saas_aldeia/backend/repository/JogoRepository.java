package com.saas_aldeia.backend.repository;

import com.saas_aldeia.backend.model.Jogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JogoRepository extends JpaRepository<Jogo, Long> {

    List<Jogo> findByNomeContainingIgnoreCase(String nome);
}
