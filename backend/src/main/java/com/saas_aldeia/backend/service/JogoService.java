package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.dto.JogoResponse;
import com.saas_aldeia.backend.model.Jogo;
import com.saas_aldeia.backend.repository.JogoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JogoService {

    private final JogoRepository jogoRepository;

    public List<JogoResponse> listar() {
        return jogoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public JogoResponse buscarPorId(Long id) {
        return toResponse(buscar(id));
    }

    @Transactional
    public JogoResponse criar(JogoRequest request) {
        Jogo jogo = new Jogo();
        jogo.setNome(request.nome());
        jogo.setImgUrl(request.imgUrl());
        jogo.setTempo(toTempoStorage(request.tempo()));
        jogo.setLinkUrl(request.linkUrl());
        jogo.setHabilitado(request.habilitado() == null || request.habilitado());
        jogo.setTurmas(new ArrayList<>());
        return toResponse(jogoRepository.save(jogo));
    }

    @Transactional
    public JogoResponse atualizar(Long id, JogoRequest request) {
        Jogo jogo = buscar(id);

        if (request.nome() != null)    jogo.setNome(request.nome());
        if (request.imgUrl() != null)  jogo.setImgUrl(request.imgUrl());
        if (request.tempo() != null)   jogo.setTempo(toTempoStorage(request.tempo()));
        if (request.linkUrl() != null) jogo.setLinkUrl(request.linkUrl());
        if (request.habilitado() != null) jogo.setHabilitado(request.habilitado());

        return toResponse(jogoRepository.save(jogo));
    }

    @Transactional
    public void deletar(Long id) {
        if (!jogoRepository.existsById(id))
            throw new IllegalArgumentException("Jogo não encontrado");
        jogoRepository.deleteById(id);
    }

    private Jogo buscar(Long id) {
        return jogoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jogo não encontrado"));
    }

    private JogoResponse toResponse(Jogo j) {
        return new JogoResponse(j.getId(), j.getNome(), j.getImgUrl(), toTempoResponse(j.getTempo()), j.getLinkUrl(), j.isHabilitado());
    }

    private String toTempoStorage(Integer tempo) {
        return tempo == null ? null : String.valueOf(tempo);
    }

    private Integer toTempoResponse(String tempo) {
        if (tempo == null || tempo.isBlank()) return null;

        String digits = tempo.trim().replaceAll("[^0-9]", "");
        if (digits.isBlank()) return null;

        return Integer.valueOf(digits);
    }
}
