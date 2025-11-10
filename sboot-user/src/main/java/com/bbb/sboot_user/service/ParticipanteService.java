package com.bbb.sboot_user.service;

import com.bbb.sboot_user.Util.Exception.ParticipanteException;
import com.bbb.sboot_user.model.Participante;
import com.bbb.sboot_user.repository.ParticipanteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ParticipanteService {

    public boolean isParticipanteValido(Participante participante){
        return !Objects.equals(participante.getNome(), "")
                && !Objects.equals(participante.getDescricao(), "")
                && !Objects.equals(participante.getUrlFoto(), "");
    }
    String response = "";
    private final String serviceLog = "[ PARTICIPANTE SERVICE ]";

    private static final Logger logger = LoggerFactory.getLogger(ParticipanteService.class);

    private final ParticipanteRepository repository;

    public ParticipanteService(ParticipanteRepository repository) {
        this.repository = repository;
    }

    public ResponseEntity<String> registrarParticipante(Participante participante){
        logger.info(serviceLog + ": REGISTRAR PARTICIPANTE - " + participante);
        if (!isParticipanteValido(participante)){
            logger.warn(serviceLog + ": PARTICIPANTE INVÁLIDO - " + participante.toString());
            response = "Todos os campos precisam estar preenchidos.";
            return ResponseEntity.status(500).body(response);
        }

        try {
            logger.info(serviceLog + ": SUCESSO AO REGISTRAR PARTICIPANTE");
            participante.setCriadoEm(LocalDateTime.now());
            response = "Sucesso ao registrar participante.";
            repository.save(participante);
            return ResponseEntity.status(200).body(response);
        } catch (ParticipanteException e){
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    public ResponseEntity<List<Participante>> listarParticipante(){
        logger.info(serviceLog + ": LISTAR PARTICIPANTE");
        List<Participante> listaParticipantes = new ArrayList<Participante>();
        try {
            logger.info(serviceLog + ": CONSULTA REALIZADA COM SUCESSO.");
            listaParticipantes = repository.findAll();
        } catch (ParticipanteException e) {
            logger.warn(serviceLog + ": ERRO AO LISTAR PARTICIPANTE - " + e.getMessage() );
            ResponseEntity.status(500).body("Houve um erro na consulta dos participantes.");
        }
        return ResponseEntity.status(200).body(listaParticipantes);
    }
}
