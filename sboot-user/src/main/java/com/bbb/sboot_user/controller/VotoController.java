package com.bbb.sboot_user.controller;

import com.bbb.sboot_user.service.VotoService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/voto")
public class VotoController {

    private final VotoService votoService;

    public VotoController(VotoService votoService) {
        this.votoService = votoService;
    }

    @PostMapping("/registrar")
    @Transactional
    public ResponseEntity<String> registrarVoto(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String participanteId = payload.get("participanteId");
        return votoService.registrarVoto(userId, participanteId);
    }

    @GetMapping("/por-participante")
    public ResponseEntity<List<Map<String, Object>>> buscarVotosPorParticipante() {
        return votoService.buscarVotosPorParticipante();
    }

    @GetMapping("/total-geral")
    public ResponseEntity<Map<String, Object>> buscarTotalGeralVotos() {
        return votoService.buscarTotalGeralVotos();
    }

    @GetMapping("/por-hora")
    public ResponseEntity<List<Map<String, Object>>> buscarTotalVotosPorHora() {
        return votoService.buscarTotalVotosPorHora();
    }
}
