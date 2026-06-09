package com.saas_aldeia.backend.service;

import com.saas_aldeia.backend.dto.JogoRequest;
import com.saas_aldeia.backend.dto.JogoResponse;
import com.saas_aldeia.backend.exception.ResourceNotFoundException;
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
        jogo.setNome(trimToNull(request.nome()));
        jogo.setImgUrl(trimToNull(request.imgUrl()));
        jogo.setTempo(toTempoStorage(request.tempo()));
        jogo.setLinkUrl(trimToNull(request.linkUrl()));
        jogo.setHabilitado(request.habilitado() == null || request.habilitado());
        jogo.setTurmas(new ArrayList<>());
        return toResponse(jogoRepository.save(jogo));
    }

    @Transactional
    public JogoResponse atualizar(Long id, JogoRequest request) {
        Jogo jogo = buscar(id);

        if (request.nome() != null)    jogo.setNome(trimToNull(request.nome()));
        if (request.imgUrl() != null)  jogo.setImgUrl(trimToNull(request.imgUrl()));
        if (request.tempo() != null)   jogo.setTempo(toTempoStorage(request.tempo()));
        if (request.linkUrl() != null) jogo.setLinkUrl(trimToNull(request.linkUrl()));
        if (request.habilitado() != null) jogo.setHabilitado(request.habilitado());

        return toResponse(jogoRepository.save(jogo));
    }

    @Transactional
    public void deletar(Long id) {
        if (!jogoRepository.existsById(id))
            throw new ResourceNotFoundException("Jogo não encontrado");
        jogoRepository.deleteById(id);
    }

    private Jogo buscar(Long id) {
        return jogoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jogo não encontrado"));
    }

    private JogoResponse toResponse(Jogo j) {
        return new JogoResponse(j.getId(), j.getNome(), j.getImgUrl(), toTempoResponse(j.getTempo()), j.getLinkUrl(), j.isHabilitado());
    }

    private String toTempoStorage(Integer tempo) {
        return tempo == null ? null : String.valueOf(tempo);
    }

    private String trimToNull(String value) {
        if (value == null) return null;

        String trimmed = value.trim();
        return trimmed.isBlank() ? null : trimmed;
    }

    private Integer toTempoResponse(String tempo) {
        if (tempo == null || tempo.isBlank()) return null;

        String digits = tempo.trim().replaceAll("[^0-9]", "");
        if (digits.isBlank()) return null;

        return Integer.valueOf(digits);
    }
}
