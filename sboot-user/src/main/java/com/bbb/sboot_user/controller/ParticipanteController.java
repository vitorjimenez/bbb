package com.bbb.sboot_user.controller;

import com.bbb.sboot_user.model.Participante;
import com.bbb.sboot_user.model.Usuario;
import com.bbb.sboot_user.service.ParticipanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping(value = "/participante")
public class ParticipanteController {

    private final ParticipanteService service;

    public ParticipanteController(ParticipanteService service) {
        this.service = service;
    }

    @PostMapping(value = "/registro")
    @Transactional
    public ResponseEntity<String> registrarParticipante(@RequestBody Participante participante) {
        return service.registrarParticipante(participante);
    }

    @GetMapping(value = "/todos")
    public ResponseEntity<List<Participante>> listarParticipantes(){
        return service.listarParticipante();
    }

}
